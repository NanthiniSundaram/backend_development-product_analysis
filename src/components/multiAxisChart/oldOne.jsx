import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const MultipleAxisChart = ({
  // Chart title
  title = "Financial Performance Analysis",
  
  // Main chart configuration
  height = 500,
  
  // X-axis configuration
  xAxisTitle = "Timeline",
  xAxisCategories = [2018, 2019, 2020, 2021, 2022, 2023, 2024],
  
  // Left Y-axis (Bar chart) configuration
  leftYAxisTitle = "ROAS",
  leftYAxisData = [1.4, 2.1, 2.5, 1.8, 2.4, 3.2, 3.8],
  leftYAxisColor = "#2563eb", // Blue
  
  // Right Y-axis (Line chart) configuration
  rightYAxisTitle = "Revenue",
  rightYAxisData = [25, 32, 38, 42, 48, 53, 60],
  rightYAxisColor = "#f97316", // Orange
  
  // Optional dropdown component
  DropdownComponent = null,
}) => {
  // Calculate max values and add 20% buffer
  const calculateYaxisMax = (data) => {
    const maxValue = Math.max(...data);
    return Math.ceil(maxValue * 1.2); // 20% buffer and round up
  };

  // State to store chart options and series
  const [chartState, setChartState] = useState({
    series: [
      {
        name: leftYAxisTitle,
        type: 'column',
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
          speed: 800
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: [0, 1],
        formatter: function(val) {
          // Don't show zero values
          if (val === 0) return '';
          return val;
        },
        offsetY: -20, // Keep original offset
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold'
          // Colors will be set per series
        },
        background: {
          enabled: false // Remove background
        }
      },
      stroke: {
        width: [0, 4]
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 6,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
          dataLabels: {
            position: 'top',
            offsetY: -15 // Keep original bar offset
          }
        }
      },
      markers: {
        size: [0, 6],
        strokeWidth: 0,
        fillOpacity: 1,
        shape: 'circle',
        radius: 4,
        hover: {
          size: 8,
        }
      },
      fill: {
        opacity: [0.85, 1],
        type: ['solid', 'solid']
      },
      colors: [leftYAxisColor, rightYAxisColor],
      xaxis: {
        categories: xAxisCategories,
        title: {
          text: xAxisTitle,
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px'
          }
        }
      },
      yaxis: [
        {
          seriesName: leftYAxisTitle,
          min: 0,
          max: calculateYaxisMax(leftYAxisData), // 20% greater than max value
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: leftYAxisColor
          },
          labels: {
            style: {
              colors: leftYAxisColor,
              fontFamily: 'Poppins, sans-serif',
            }
          },
          title: {
            text: leftYAxisTitle,
            style: {
              color: leftYAxisColor,
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: rightYAxisTitle,
          opposite: true,
          min: 0,
          max: calculateYaxisMax(rightYAxisData), // 20% greater than max value
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: rightYAxisColor
          },
          labels: {
            style: {
              colors: rightYAxisColor,
              fontFamily: 'Poppins, sans-serif',
            }
          },
          title: {
            text: rightYAxisTitle,
            style: {
              color: rightYAxisColor,
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
            }
          }
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
        }
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40,
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.85
          }
        }
      }
    }
  });

  // Update chart when props change
  useEffect(() => {
    setChartState({
      series: [
        {
          name: leftYAxisTitle,
          type: 'column',
          data: leftYAxisData,
          dataLabels: {
            style: {
              colors: [leftYAxisColor] // Match color with the bars
            }
          }
        },
        {
          name: rightYAxisTitle,
          type: 'line',
          data: rightYAxisData,
          dataLabels: {
            style: {
              colors: [rightYAxisColor] // Match color with the line
            }
          }
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
            max: calculateYaxisMax(leftYAxisData), // 20% greater than max value
            title: {
              ...chartState.options.yaxis[0].title,
              text: leftYAxisTitle
            },
            axisBorder: {
              ...chartState.options.yaxis[0].axisBorder,
              color: leftYAxisColor
            },
            labels: {
              ...chartState.options.yaxis[0].labels,
              style: {
                ...chartState.options.yaxis[0].labels.style,
                colors: leftYAxisColor
              }
            }
          },
          {
            ...chartState.options.yaxis[1],
            min: 0,
            max: calculateYaxisMax(rightYAxisData), // 20% greater than max value
            title: {
              ...chartState.options.yaxis[1].title,
              text: rightYAxisTitle
            },
            axisBorder: {
              ...chartState.options.yaxis[1].axisBorder,
              color: rightYAxisColor
            },
            labels: {
              ...chartState.options.yaxis[1].labels,
              style: {
                ...chartState.options.yaxis[1].labels.style,
                colors: rightYAxisColor
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
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] font-medium text-gray-800 font-poppins">{title}</h2>
        {DropdownComponent && <div className="ml-auto">{DropdownComponent}</div>}
      </div>
      <div id="chart" className="w-full">
        <ReactApexChart 
          options={chartState.options} 
          series={chartState.series} 
          type="line" 
          height={height} 
          className="w-full"
        />
      </div>
    </div>
  );
};

export default MultipleAxisChart;