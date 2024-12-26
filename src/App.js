import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { registerables } from 'chart.js';
import './App.css'


// Register chart.js components
ChartJS.register(...registerables);

const App = () => {
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Fetch data from the CSV file
  useEffect(() => {
    Papa.parse('https://raw.githubusercontent.com/shaktids/stock_app_test/refs/heads/main/dump.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setData(result.data);
      },
    });
  }, []);

  // Handle company selection
  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    updateChartData(company);
  };

  // Update chart data based on the selected company
  const updateChartData = (company) => {
    const companyData = data.filter(item => item.index_name === company);
    const chartLabels = companyData.map(item => item.index_date);
    const chartValues = companyData.map(item => parseFloat(item.closing_index_value));

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: `${company} Stock Prices`,
          data: chartValues,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
      ],
    });
  };

  // Chart configuration options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Stock Price (₹)',
        },
        ticks: {
          beginAtZero: false,
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', padding: '20px', backgroundColor: 'pink' }}>
        <h1 style={{color:'blue',textAlign:'center' ,fontSize:'40px'}}>Companies List</h1>
        <ul>
          {[...new Set(data.map(item => item.index_name))].map((company, index) => (
            <li key={index} onClick={() => handleCompanyClick(company)} style={{ cursor: 'pointer', listStyleType:'circle' }}>
              {company}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, padding: '20px',backgroundColor:'lightblue' }}>
        <h3>{selectedCompany ? `${selectedCompany} Stock Chart` : 'Select a Company'}</h3>
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>Select a company to view its stock chart.</p>
        )}
      </div>
    </div>
  );
};

export default App;