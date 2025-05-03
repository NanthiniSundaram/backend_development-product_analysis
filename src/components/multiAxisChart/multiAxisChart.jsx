import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ResponsiveContainer } from 'recharts';

const DualAxisLineChart = ({
  // Chart title
  title = "Revenue and CPM Trends",

  // Main chart configuration
  height = 500,

  // X-axis configuration
  xAxisTitle = "Trends",
  xAxisCategories = ['2025-03-04', '2025-03-05', '2025-03-06', '2025-03-07', '2025-03-08', '2025-03-09', '2025-03-10', '2025-03-11', '2025-03-12', '2025-03-13', '2025-03-14', '2025-03-15', '2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-21', '2025-03-22', '2025-03-23'],

  // Left Y-axis configuration
  leftYAxisTitle = "TOTAL REVENUE",
  leftYAxisData = [7962, 15925, 23887, 31850, 39812, 31850, 15925, 15925, 15925, 15925, 15925, 15925, 15925, 7962, 15925, 15925, 15925, 15925, 7962, 23887],
  leftYAxisColor = "#228B22", // Green

  // Right Y-axis configuration
  rightYAxisTitle = "CPM",
  rightYAxisData = [5780, 5780, 3303, 4129, 5780, 3303, 2477, 2477, 3303, 3303, 3303, 3303, 2477, 3303, 3303, 2477, 3303, 3303, 3303, 3303],
  rightYAxisColor = "#D35400", // Dark orange

  // Optional dropdown component
  DropdownComponent = null,
}) => {
  // Calculate max values and add 20% buffer
  const calculateYaxisMax = (data) => {
    const maxValue = Math.max(...data);
    return Math.ceil(maxValue * 1.2); // 20% buffer and round up
  };

  // Check if the series names are the special percentage cases
  const isLeftPercentageSeries = leftYAxisTitle === "Instock Darkstores" || leftYAxisTitle === "OOS Darkstores";
  const isRightPercentageSeries = rightYAxisTitle === "Instock Darkstores" || rightYAxisTitle === "OOS Darkstores";

  // State to store chart options and series
  const [chartState, setChartState] = useState({
    series: [
      {
        name: leftYAxisTitle,
        type: 'line',
        data: leftYAxisData
      },
      {
        name: rightYAxisTitle,
        type: 'line',
        data: rightYAxisData
      }
    ],
    options: {
      chart: {
        height: height,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false
        },
        fontFamily: 'Poppins, sans-serif',
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
        },
        zoom: {
          enabled: false
        },
        background: '#fff',
        events: {
          mouseMove: function (event, chartContext, config) {
            // Changes cursor to pointer when hovering over chart
            const chartElement = document.getElementById('chart');
            if (chartElement) chartElement.style.cursor = 'pointer';
          },
          mouseLeave: function (event, chartContext, config) {
            // Changes cursor back to default when leaving chart
            const chartElement = document.getElementById('chart');
            if (chartElement) chartElement.style.cursor = 'default';
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2, 2], // Thinner lines
        curve: 'smooth',
        lineCap: 'round',
        dashArray: [0, 0]
      },
      colors: [leftYAxisColor, rightYAxisColor],
      markers: {
        size: 5, // Slightly smaller markers
        strokeWidth: 2,
        strokeColors: ['#fff', '#fff'],
        fillOpacity: 1,
        shape: 'circle',
        radius: 2,
        hover: {
          size: 7,
          sizeOffset: 3
        }
      },
      fill: {
        opacity: [1, 1],
        type: ['solid', 'solid']
      },
      xaxis: {
        categories: xAxisCategories,
        labels: {
          style: {
            colors: '#000',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px'
          },
          formatter: function (value) {
            return value;
          },
          rotateAlways: false,
          hideOverlappingLabels: true
        },
        title: {
          text: xAxisTitle,
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#000'
          },
          offsetY: -10
        },
        tooltip: {
          enabled: false // Disables individual x-axis tooltips
        },
        crosshairs: {
          show: false // Removes the crosshair line on hover
        },
        axisBorder: {
          show: true,
          color: '#e0e0e0',
        },
        axisTicks: {
          show: true,
          color: '#e0e0e0',
        }
      },
      yaxis: [
        {
          seriesName: leftYAxisTitle,
          min: 0,
          max: calculateYaxisMax(leftYAxisData),
          tickAmount: 8,
          forceNiceScale: true,
          axisTicks: {
            show: true,
            color: '#959aa4',
            width: 5,
            offsetX: 0
          },
          axisBorder: {
            show: true,
            color: '#959aa4',
            width: 1,
            offsetX: 0
          },
          labels: {
            style: {
              colors: '#000', // Black color for values
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 400
            },
            formatter: function (val) {
              // Add percentage sign if it's a percentage series
              return isLeftPercentageSeries ? val.toFixed(0) + "%" : val.toFixed(0);
            },
            offsetX: 0,
            offsetY: 0,
            minWidth: 0,
            maxWidth: 160
          },
          title: {
            text: leftYAxisTitle,
            style: {
              color: leftYAxisColor, // Color for title
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600
            },
            offsetX: -10,
            offsetY: 0,
            rotate: -90
          },
          tooltip: {
            enabled: false
          },
          crosshairs: {
            show: false
          }
        },
        {
          seriesName: rightYAxisTitle,
          opposite: true,
          min: 0,
          max: calculateYaxisMax(rightYAxisData),
          tickAmount: 8,
          forceNiceScale: true,
          axisTicks: {
            show: true,
            color: '#959aa4',
            width: 5,
            offsetX: 0
          },
          axisBorder: {
            show: true,
            color: '#959aa4',
            width: 1,
            offsetX: 0
          },
          labels: {
            style: {
              colors: '#000', // Black color for values
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 400
            },
            formatter: function (val) {
              // Add percentage sign if it's a percentage series
              return isRightPercentageSeries ? '' + val.toFixed(0) + "%" : '' + val.toFixed(0);
            },
            offsetX: 0,
            align: 'left',
            minWidth: 0,
            maxWidth: 160
          },
          title: {
            text: rightYAxisTitle,
            style: {
              color: rightYAxisColor, // Color for title
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600
            },
            offsetX: 10,
            offsetY: 0,
            rotate: -90
          },
          crosshairs: {
            show: false
          }
        },
      ],
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        followCursor: true,
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
        },
        theme: 'light',
        x: {
          formatter: function (val) {
            // Find the corresponding category/date
            if (val >= 1 && val <= xAxisCategories.length) {
              return xAxisCategories[val - 1];
            }
            return val;
          }
        },
        y: {
          formatter: function (val, { seriesIndex, dataPointIndex, w }) {
            const seriesName = w.globals.seriesNames[seriesIndex];
            // Check if series name includes "Instock Darkstores" or "OOS Darkstores"
            if (seriesName === "Instock Darkstores" || seriesName === "OOS Darkstores") {
              return val + "%";
            }
            // For other series, just return the value
            return val;
          }
        },
        marker: {
          show: true,
        },
        fixed: {
          enabled: false,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        }
      },
      legend: {
        show: false,
        position: 'bottom',
        horizontalAlign: 'right',
        floating: false,
        offsetX: 0,
        offsetY: -20,
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        markers: {
          width: 12,
          height: 1,
          strokeWidth: 0,
          radius: 12,
          offsetX: 2, // Keep this 0
          offsetY: 0,
          gap: 10,
        },
        itemMargin: {
          horizontal: 5,
          vertical: 0,
        },
        labels: {
          colors: undefined, // Inherit default
          useSeriesColors: false,
        },
        formatter: function (seriesName, opts) {
          return `<div style="margin-left: 8px;">${seriesName}</div>`;
        }
      },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          right: 30,
          left: 30
        }
      }
    }
  });

  // Update chart when props change
  useEffect(() => {
    // Update flags to check if series names are percentage cases
    const updatedIsLeftPercentageSeries = leftYAxisTitle === "Instock Darkstores" || leftYAxisTitle === "OOS Darkstores";
    const updatedIsRightPercentageSeries = rightYAxisTitle === "Instock Darkstores" || rightYAxisTitle === "OOS Darkstores";
    
    setChartState({
      series: [
        {
          name: leftYAxisTitle,
          type: 'line',
          data: leftYAxisData
        },
        {
          name: rightYAxisTitle,
          type: 'line',
          data: rightYAxisData
        }
      ],
      options: {
        ...chartState.options,
        colors: [leftYAxisColor, rightYAxisColor],
        xaxis: {
          ...chartState.options.xaxis,
          categories: xAxisCategories,
          title: {
            ...chartState.options.xaxis.title,
            text: xAxisTitle
          }
        },
        yaxis: [
          {
            ...chartState.options.yaxis[0],
            min: 0,
            max: calculateYaxisMax(leftYAxisData),
            title: {
              ...chartState.options.yaxis[0].title,
              text: leftYAxisTitle,
              style: {
                ...chartState.options.yaxis[0].title.style,
                color: leftYAxisColor
              }
            },
            labels: {
              ...chartState.options.yaxis[0].labels,
              formatter: function (val) {
                // Add percentage sign if it's a percentage series
                return updatedIsLeftPercentageSeries ? val.toFixed(0) + "%" : val.toFixed(0);
              }
            }
          },
          {
            ...chartState.options.yaxis[1],
            min: 0,
            max: calculateYaxisMax(rightYAxisData),
            title: {
              ...chartState.options.yaxis[1].title,
              text: rightYAxisTitle,
              style: {
                ...chartState.options.yaxis[1].title.style,
                color: rightYAxisColor
              }
            },
            labels: {
              ...chartState.options.yaxis[1].labels,
              formatter: function (val) {
                // Add percentage sign if it's a percentage series
                return updatedIsRightPercentageSeries ? '' + val.toFixed(0) + "%" : '' + val.toFixed(0);
              }
            }
          }
        ]
      }
    });
  }, [
    height,
    xAxisTitle,
    xAxisCategories,
    leftYAxisTitle,
    leftYAxisData,
    leftYAxisColor,
    rightYAxisTitle,
    rightYAxisData,
    rightYAxisColor
  ]);

  return (
    <div className="bg-white px-2 pt-2 rounded-md">
      {title && (
        <div className="flex px-4 justify-between items-center mb-4">
          <h2 className="text-md font-medium text-gray-800 font-poppins">{title}</h2>
          {DropdownComponent && <div className="ml-auto">{DropdownComponent}</div>}
        </div>
      )}
      <div id="chart" className="w-full cursor-pointer">
        <ResponsiveContainer width="100%" height={height}>
          <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="area"
            height={height}
            className="w-full"
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DualAxisLineChart;