import React, { useState, useMemo, useEffect } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Calendar } from 'lucide-react';
import DateRangeSelector from '../../../components/dateRangePicker/dateRange';
import Dropdown from "../../../components/dropdown/dropdown";
import { OutStockColumns, mockProductTableData, mockCategoryData, mockCityData, mockChartData } from './utils';
import CustomTableSample from '../../../components/MainTable/sample';
import MultipleAxisChart from '../../../components/multiAxisChart/multiAxisChart';
import { Tooltip } from '@mui/material';
import PlatformSelector from '../../../components/platformSelector/platforms';
import { RiPinDistanceFill } from 'react-icons/ri';

export default function StockAvailability() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [dateState, setDateState] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 8)),
            endDate: new Date(new Date().setDate(new Date().getDate() - 2)),
            key: 'selection',
        },
    ]);

    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSellerPlatform, setSelectedSellerPlatform] = useState('Blinkit');
    const [platformSearch, setPlatformSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    const [selectedMetric1, setSelectedMetric1] = useState('Units Sold DRR');
    const [selectedMetric2, setSelectedMetric2] = useState('Instock Darkstores');
    const [selectedMetrics, setSelectedMetrics] = useState(['Units Sold DRR', 'Instock Darkstores']);
    const [chartData, setChartData] = useState({
        dates: [],
        metric1Data: [],
        metric2Data: []
    });

    const [productPage, setProductPage] = useState({
        currentPage: 1,
        pageSize: 20
    });

    const [isLoading, setIsLoading] = useState(false);

    const [productName, setProductName] = useState('');
    const [cityName, setCityName] = useState('');

    const [cityColumnDatas, setCityColumnDatas] = useState([]);

    const chartMetrics1 = [
        { name: "Units Sold DRR", uid: "Units Sold DRR" },
    ];

    const chartMetrics2 = [
        { name: "Instock Darkstores", uid: "Instock Darkstores" },
        { name: "OOS Darkstores", uid: "OOS Darkstores" },
        { name: "Inventory", uid: "Inventory" },
    ];

    useEffect(() => {
        // Initialize with mock data
        setSelectedCities(mockCityData.map(city => city.name));
        setSelectedCategory(mockCategoryData.map(category => category.name));
        setCityColumnDatas(["Delhi", "Mumbai", "Bangalore", "Chennai"]);

        // Set chart data
        setChartData({
            dates: mockChartData.dates,
            metric1Data: mockChartData.unitsData,
            metric2Data: mockChartData.instockData
        });

        setIsLoading(false);
    }, []);

    // Handle applying date filters
    const handleApplyFilters = () => {
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            // Get filtered data based on our selections
            // In this case, we're just reusing the same mock data
            setChartData({
                dates: mockChartData.dates,
                metric1Data: mockChartData.unitsData,
                metric2Data: mockChartData.instockData
            });

            setIsLoading(false);
        }, 500);

        setIsDatePopoverOpen(false);
    };

    // Handle metrics change
    const handleMetricsChange = (newSelectedMetrics) => {
        // Limit to exactly 2 selections maximum
        const limitedMetrics = newSelectedMetrics.slice(0, 2);
        setSelectedMetrics(limitedMetrics);

        // Update individual metric states
        if (limitedMetrics.length > 0) {
            setSelectedMetric1(limitedMetrics[0]);
        } else {
            setSelectedMetric1(null);
        }

        if (limitedMetrics.length > 1) {
            setSelectedMetric2(limitedMetrics[1]);
        } else {
            setSelectedMetric2(null);
        }

        // Simulate fetching chart data
        setIsLoading(true);
        setTimeout(() => {
            setChartData({
                dates: mockChartData.dates,
                metric1Data: limitedMetrics[0] === 'Units Sold DRR' ? mockChartData.unitsData : mockChartData.revenueData,
                metric2Data: limitedMetrics[1] === 'Instock Darkstores' ? mockChartData.instockData : mockChartData.oosData
            });
            setIsLoading(false);
        }, 300);
    };

    // Handle pagination for products table
    const handleSetCurrentPageProducts = (page) => {
        setProductPage(prev => ({
            ...prev,
            currentPage: page
        }));
    };

    const handleSetPageSizeProducts = (size) => {
        setProductPage({
            currentPage: 1,
            pageSize: size
        });
    };

    // Combine all metrics for dropdown
    const allMetrics = [...chartMetrics1, ...chartMetrics2].filter(
        (metric, index, self) =>
            index === self.findIndex((m) => m.uid === metric.uid)
    );

    // Component for metrics dropdown
    const metricsDropdownComponent = (
        <div className='w-full flex xl:flex max-lg:flex-col gap-4 items-center'>
            <div className='w-full flex items-center'>
                <Dropdown
                    CategoryOptions={allMetrics}
                    setSelectedCategories={handleMetricsChange}
                    selectedCategories={selectedMetrics}
                    itemName='Select Metrics'
                    isOpen={openDropdown === 'Metrics'}
                    setIsOpen={() => setOpenDropdown(openDropdown === 'Metrics' ? null : 'Metrics')}
                    isSingleSelect={false}
                    showCount={true}
                    SelectedDatas={() => {
                        // Trigger chart update
                        handleMetricsChange(selectedMetrics);
                    }}
                    maxSelections={2}
                />
            </div>
        </div>
    );

    // Prepare chart data
    const chartMetricsData = useMemo(() => {
        return {
            xAxisCategories: chartData.dates || [],
            roasData: Array.isArray(chartData.metric1Data) ? chartData.metric1Data.map(value => Math.round(value)) : [],
            revenueData: Array.isArray(chartData.metric2Data) ? chartData.metric2Data.map(value => Math.round(value)) : []
        };
    }, [chartData]);

    // Format table data for display
    const ProductsTableData = useMemo(() => {
        return mockProductTableData.map((item, i) => {
            // Format the subCities data correctly
            const formattedSubCities = item.city_data && item.city_data.length > 0
                ? item.city_data.map((city, j) => ({
                    key: `${i}-${j}`,
                    city_name:
                        <span className="text-xs md:text-[12px] text-gray-500 font-medium h-[2rem] flex items-center justify-between w-full">
                            <span className="text-xs md:text-[12px] text-gray-500 font-medium h-[1.3rem] flex items-center pl-6 w-full text-center">
                                {city.city}
                            </span>
                        </span>,
                    instock_darkstores: (
                        <span className="flex items-center justify-center w-[7rem] gap-1 text-[11px]">
                            <span className="text-gray-900">{city.instock_darkstores_avg || "0"} stores |</span>
                            <span className={`${(city.instock_darkstores_per < 40) ? 'text-red-500' : 'text-green-500'} font-medium`}>
                                {city.instock_darkstores_per || "0"}%
                            </span>
                        </span>
                    ),
                    inventory: (
                        <span className=" gap-1 w-[7rem] flex items-center justify-center">
                            <span className="text-gray-900">{city.available_stock_avg}</span>
                        </span>
                    ),
                    units_sold: (
                        <span className=" gap-1 w-[7rem] flex items-center justify-center">
                            <span className="text-gray-900">{city.units_sold_drr}</span>
                        </span>
                    ),
                    revenue: (
                        <span className="flex-col gap-2 text-[11px] w-[7rem] flex items-center justify-center">
                            {city.final_revenue_drr ? `₹${city.final_revenue_drr}` : "0"}
                        </span>
                    ),
                    outstock_darkstores: (
                        <span className="flex items-center text-[11px] justify-center w-[7rem] gap-1">
                            <span className="text-gray-900">{city.oos_darkstores_avg || "0"} stores |</span>
                            <span className={`${(city.oos_darkstores_per > 40) ? 'text-red-500' : 'text-green-500'} font-medium`}>
                                {city.oos_darkstores_per || "0"}%
                            </span>
                        </span>
                    ),
                    inactive_darkstores: (
                        <span className="flex items-center text-[11px] justify-center w-[7rem] gap-1">
                            <span className="text-gray-900">{city.inactive_darkstores_avg || "0"} stores |</span>
                            <span className={`${(city.inactive_darkstores_per > 40) ? 'text-red-500' : 'text-green-500'} font-medium`}>
                                {city.inactive_darkstores_per || "-"}%
                            </span>
                        </span>
                    ),
                    potential_loss: (
                        <span className="flex-col gap-2 text-[11px] w-[7rem] flex items-center justify-center">
                            {city.potential_units_drr ? `${city.potential_units_drr}` : "0"}
                        </span>
                    ),
                    days_to_oos: (
                        <span className="flex-col gap-2 text-[11px] w-[7rem] flex items-center justify-center">
                            {(city.units_sold_drr !== 0
                                ? (city.available_stock_avg / city.units_sold_drr).toFixed(0)
                                : 0)}
                        </span>
                    )
                }))
                : [];

            return {
                key: i,
                id: i + 1,
                internal_product_id: item.product_id, // Keep plain ID for row identification
                product_id: (
                    <span className="text-xs md:text-[12px] text-gray-500 font-medium h-[2rem] flex items-center justify-center text-center">
                        {item.product_id}
                    </span>
                ),
                // Store the formatted subCities array
                subCities: formattedSubCities,
                product_name: (
                    <span className="text-xs md:text-[12px] text-gray-500 font-medium h-[2rem] flex items-center justify-between w-full">
                        <div className='w-full flex'>
                            <div className="flex flex-col gap-1 w-full cursor-pointer">
                                <span className="text-xs md:text-[12px] text-gray-800 font-medium">
                                    {item.product_name}
                                </span>
                            </div>
                        </div>
                    </span>
                ),
                instock_darkstores: (
                    <span className="flex items-center justify-center w-[7rem] gap-1">
                        <span className="text-gray-900">{item.instock_darkstores_avg} |</span>
                        <span className={`${item.instock_darkstores_per < 40 ? 'text-red-500' : 'text-green-500'} font-medium`}>{item.instock_darkstores_per}%</span>
                    </span>
                ),
                inventory: (
                    <span className=" gap-1 w-[7rem] flex items-center justify-center">
                        <span className="text-gray-900">{item.available_stock_avg}</span>
                    </span>
                ),
                units_sold: (
                    <span className=" gap-1 w-[7rem] flex items-center justify-center">
                        <span className="text-gray-900">{item.units_sold_drr}</span>
                    </span>
                ),
                revenue: (
                    <span className="flex-col gap-2 w-[7rem] flex items-center justify-center">
                        ₹{item.final_revenue_drr}
                    </span>
                ),
                outstock_darkstores: (
                    <span className="flex items-center justify-center w-[7rem] gap-1">
                        <span className="text-gray-900">{item.oos_darkstores_avg} |</span>
                        <span className={`${item.oos_darkstores_per > 40 ? 'text-red-500' : 'text-green-500'} font-medium`}>{item.oos_darkstores_per}%</span>
                    </span>
                ),
                inactive_darkstores: (
                    <span className="flex items-center justify-center w-[7rem] gap-1">
                        <span className="text-gray-900">{item.inactive_darkstores_avg} |</span>
                        <span className={`${item.inactive_darkstores_per > 40 ? 'text-red-500' : 'text-green-500'} font-medium`}>{item.inactive_darkstores_per}%</span>
                    </span>
                ),
                potential_loss: (
                    <span className="flex-col gap-2 w-[7rem] flex items-center justify-center">
                        {item.potential_units_drr}
                    </span>
                ),
                days_to_oos: (
                    <span className="flex-col gap-2 text-[11px] w-[7rem] flex items-center justify-center">
                        {(item.units_sold_drr !== 0
                            ? (item.available_stock_avg / item.units_sold_drr).toFixed(0)
                            : 0)}
                    </span>
                )
            };
        });
    }, [mockProductTableData]);

    return (
        <div className='flex flex-col justify-center w-full h-full pb-3'>
            <div className="px-2 flex gap-3 items-center h-[3.6rem] bg-gray-900 justify-between mb-2">
                <div className='flex gap-3 w-full items-center '>
                    <h2 className="text-md md:text-lg font-medium w-full text-white">Stock Availability</h2>
                </div>

                <div className='flex gap-3 items-center justify-center'>
                    <div className="w-full mx-2">
                        <PlatformSelector
                            setSelect={setSelectedSellerPlatform}
                            selectedPlatform={selectedSellerPlatform}
                            platforms={['Blinkit', 'Zepto', 'Swiggy']}
                        />
                    </div>
                    <div>
                        {dateState.length > 0 &&
                            dateState[0].startDate &&
                            dateState[0].endDate &&
                            new Date(dateState[0].startDate).toString() !== "Invalid Date" ? (
                            <Popover
                                placement="bottom"
                                showArrow={true}
                                isOpen={isDatePopoverOpen}
                                onOpenChange={setIsDatePopoverOpen}
                            >
                                <PopoverTrigger>
                                    <Button className="bg-gray-700 text-white border-1 text-[13px] font-medium border-gray-300 rounded-lg h-[2.2rem]">
                                        {`${new Date(dateState[0].startDate).toLocaleDateString()} - ${new Date(dateState[0].endDate).toLocaleDateString()}`}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <DateRangeSelector
                                        freezeOnlySevenDays={true}
                                        DateState={dateState}
                                        setDate={(newDateState) => {
                                            setDateState(newDateState);
                                        }}
                                        applyDate={handleApplyFilters}
                                        months={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Popover
                                placement="bottom"
                                showArrow={true}
                                isOpen={isDatePopoverOpen}
                                onOpenChange={setIsDatePopoverOpen}
                            >
                                <PopoverTrigger>
                                    <Button className="bg-gray-700 text-white border-1 text-[13px] font-medium border-gray-300 rounded-lg h-[2.2rem]">
                                        <Calendar className="w-5 h-5" /> Date Range
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <DateRangeSelector
                                        freezeOnlySevenDays={true}
                                        DateState={dateState}
                                        setDate={(newDateState) => {
                                            setDateState(newDateState);
                                        }}
                                        applyDate={handleApplyFilters}
                                        months={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>
            <div className='px-3 overflow-y-auto scrollbar-hide h-full w-full flex items-center justify-center'>
                <div className='h-full w-[100%] flex flex-col gap-3'>
                    <div className=' w-full lg:h-[27rem] md:h-[31rem] flex justify-between'>
                        <div className='w-[100%] border rounded-md shadow-md h-full'>
                            <MultipleAxisChart
                                title="Daily Product Availability Tracker"
                                xAxisTitle="Trends"
                                xAxisCategories={chartMetricsData.xAxisCategories}
                                leftYAxisTitle={selectedMetric1}
                                leftYAxisData={chartMetricsData.roasData}
                                rightYAxisTitle={selectedMetric2}
                                rightYAxisData={chartMetricsData.revenueData}
                                DropdownComponent={metricsDropdownComponent}
                                height={340}
                            />
                        </div>
                    </div>
                    <div className='w-full flex gap-3'>
                        <div className='w-[100%] rounded-lg shadow-md'>
                            <CustomTableSample
                                headerPadding='py-2 px-3'
                                SummaryDetailsShow={false}
                                showSortIcon={false}
                                columns={OutStockColumns}
                                data={ProductsTableData}
                                FirstColumnWidth='w-[13rem]'
                                SecondColumnWidth='w-[20rem]'
                                isNestedTable={true}
                                totalRecords={mockProductTableData.length}
                                productsCount={mockProductTableData.length}
                                currentPage={productPage.currentPage}
                                pageSize={productPage.pageSize}
                                onPageChange={handleSetCurrentPageProducts}
                                onPageSizeChange={handleSetPageSizeProducts}
                                isFirstColumnFixed={true}
                                isLastColumnFixed={false}
                                hideHeader={false}
                                Title='Product Stock Visibility by Dark Store'
                                isSearch={true}
                                SearchPlaceholder='Search Products'
                                isStatusDropdown={false}
                                isCategoryDropdown={true}
                                isColumnsDropdown={false}
                                AddButton={false}
                                isPagination={true}
                                onlySearch={true}
                                CustomSearchWidth='w-[20rem]'
                                customeHeightWidth='h-[calc(100vh-200px)] w-full'
                                isDateRange={false}
                                isDownload={false}
                                isFilter={false}
                                FixColumnCount='1'
                                isMetricsShow={false}
                                isWeekDropDown={false}
                                dropDowncomponent={''}
                                onChange={(value) => {
                                    setPlatformSearch(value);
                                }}
                                searchItem={() => {
                                    // Search functionality would go here
                                }}
                                onClear={() => {
                                    setPlatformSearch('');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}