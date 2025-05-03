import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const SalesChart = ({
  // Header configuration
  title = "Sales this week",
  value = "$12,423",
  
  // Change indicator
  changeValue = "23%",
  changeType = "increase", // 'increase' or 'decrease'
  
  // Chart configuration
  height = 200,
  width = "100%",
  
  // Chart data
  seriesData = [
    {
      name: "Developer Edition",
      data: [1500, 1418, 1456, 1526, 1356, 1256],
      color: "#1A56DB",
    },
    {
      name: "Designer Edition",
      data: [643, 413, 765, 412, 1423, 1731],
      color: "#7E3BF2",
    }
  ],
  
  // X-axis configuration
  xAxisCategories = ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
  
  // Time period options for dropdown
  timeOptions = [
    "Yesterday",
    "Today",
    "Last 7 days",
    "Last 30 days",
    "Last 90 days"
  ],
  defaultTimeOption = "Last 7 days",
  
  // Report link
  reportLabel = "Sales Report",
  reportLink = "#",
  
  // Theme
  isDarkMode = false,
}) => {
  // State for time period dropdown
  const [selectedTime, setSelectedTime] = useState(defaultTimeOption);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Chart configuration
  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: height,
      width: width,
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        formatter: function (value) {
          return '$' + value;
        }
      },
      theme: isDarkMode ? 'dark' : 'light',
    },
    legend: {
      show: false
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
      curve: 'smooth',
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    xaxis: {
      categories: xAxisCategories,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (value) {
          return '$' + value;
        }
      }
    },
  });

  // Update chart when props change
  useEffect(() => {
    setChartOptions(prevOptions => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        height: height,
        width: width,
      },
      xaxis: {
        ...prevOptions.xaxis,
        categories: xAxisCategories,
      }
    }));
  }, [height, width, xAxisCategories]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Select time period
  const selectTimePeriod = (option) => {
    setSelectedTime(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`w-full bg-white rounded-lg shadow-sm ${isDarkMode ? 'dark:bg-gray-800' : ''} p-4 md:p-6`}>
      <div className="mt-4">
        <ReactApexChart 
          options={chartOptions} 
          series={seriesData} 
          type="area" 
          height={height} 
        />
      </div>      
    </div>
  );
};

export default SalesChart;