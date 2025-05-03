import React, { useEffect, useMemo, useState } from "react";
import { Card, Checkbox, Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import CustomTableSample from "../../../components/MainTable/sample";
import Dropdown from "../../../components/dropdown/dropdown";
import DateRangeSelector from '../../../components/dateRangePicker/dateRange';
import PlatformSelector from '../../../components/platformSelector/platforms'
import { Calendar } from "lucide-react";
import { Tooltip } from "@mui/material";

// ATC % 
// CTR %
// CPM
// CVR %
// AOV
// TOTAL REVENUE
// SELLING PRICE
// TOTAL ORDER QTY
// AD ORDER QTY
// AD SPENDS

// Static data for the component
import { staticData } from "./utils";

export default function ProductAnalysis() {
    // State management
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
            key: 'selection',
        },
    ]);
    const [isMetricsOpen, setIsMetricsOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(true); // Sidebar state
    const [selectedSellerPlatform, setSelectedSellerPlatform] = useState('Zepto');
    const [productNameFilter, setProductNameFilter] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(["outofstock", "instock"]);
    const [stockFlags, setStockFlags] = useState(['In Stock', 'Out of Stock']);
    const [selectedStockFlags, setSelectedStockFlags] = useState(['In Stock', 'Out of Stock']);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState('TOTAL REVENUE');
    const [sortOrder, setSortOrder] = useState('DESC');

    const [tempSelectedPlatformMetrics, setTempSelectedPlatformMetrics] = useState([
        "TOTAL REVENUE", "TOTAL ORDER QTY", "AOV"
    ]);

    const [tempSelectedMarketingMetrics, setTempSelectedMarketingMetrics] = useState([
         "AD SPENDS"
    ]);

    const [selectedPlatformMetrics, setSelectedPlatformMetrics] = useState([
        "TOTAL REVENUE", "TOTAL ORDER QTY", "AOV",  "TOTAL ROAS", "AD SPENDS"
    ]);

    const [selectedMarketingMetrics, setSelectedMarketingMetrics] = useState([
        
    ]);

    // Static table columns
    const [tableColumns, setTableColumns] = useState([
        { label: "PRODUCT", value: "product_name", sortable: true, custom_width: "w-[20rem]" },
        { label: "TOTAL REVENUE", value: "TOTAL REVENUE", sortable: true, custom_width: "w-[9rem]" },
        { label: "TOTAL ORDER QTY", value: "TOTAL ORDER QTY", sortable: true, custom_width: "w-[10rem]" },
        { label: "AD SPENDS", value: "AD SPENDS", sortable: true, custom_width: "w-[9rem]" },
        { label: "AOV", value: "AOV", sortable: true, custom_width: "w-[9rem]" },
    ]);

    // Static metrics data
    const platformMetrics = [
        "TOTAL REVENUE", "TOTAL ORDER QTY",   "AOV", 
        "SELLING PRICE", "CVR %"
    ];

    const marketingMetrics = [
        "AD SPENDS", "AD ORDER QTY", "CPM", "CTR %", "ATC %",
    ];

    // Static categories
    const categories = ["Dairy", "Beverages", "Snacks", "Fruits", "Vegetables", "Bakery"];

    // Static status options
    const statusOptions = [
        { name: "outofstock", uid: "outofstock", title: "Out Stock" },
        { name: "instock", uid: "instock", title: "In Stock" },
    ];

    // Static summary data
    const summary = {
        "TOTAL REVENUE": 2500000,
        "TOTAL ORDER QTY": 15000,
        "TOTAL ROAS": 3.5,
        "AD SPENDS": 150000,
        "AOV": 600,
    };

    // Use the static products data from utils
    const products = staticData.products;
    const totalRecordsData = products.length;
    const RoasSummary = 2.8; // Static ROAS summary value

    // Event handlers
    const handleApplyFilters = () => {
        setIsDatePopoverOpen(false);
    };

    const toggleMetrics = () => {
        setIsMetricsOpen(!isMetricsOpen);
    };

    const togglePlatformMetric = (metric) => {
        setTempSelectedPlatformMetrics(prev =>
            prev.includes(metric)
                ? prev.filter(item => item !== metric)
                : [...prev, metric]
        );
    };

    const toggleMarketingMetric = (metric) => {
        setTempSelectedMarketingMetrics(prev =>
            prev.includes(metric)
                ? prev.filter(item => item !== metric)
                : [...prev, metric]
        );
    };

    const toggleStockFlag = (flag) => {
        setSelectedStockFlags(prev =>
            prev.includes(flag)
                ? prev.filter(f => f !== flag)
                : [...prev, flag]
        );
    };

    const applyFilters = () => {
        // Update the selected metrics
        setSelectedPlatformMetrics([...tempSelectedPlatformMetrics]);
        setSelectedMarketingMetrics([...tempSelectedMarketingMetrics]);

        // Update table columns based on selected metrics
        const newColumns = [
            { label: "PRODUCT", value: "product_name", sortable: true, custom_width: "w-[28rem]" }
        ];

        // Combine selected metrics from both categories
        const selectedMetrics = [...new Set([...tempSelectedPlatformMetrics, ...tempSelectedMarketingMetrics])];

        // Add columns for selected metrics
        selectedMetrics.forEach(metricName => {
            newColumns.push({
                label: metricName,
                value: metricName,
                sortable: true,
                custom_width: "w-[9rem]"
            });
        });

        setTableColumns(newColumns);
        setCurrentPage(1);
    };

    const handleSetCurrentPage = (page) => {
        setCurrentPage(page);
    };

    const handleSetPageSize = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const setSorting = (column) => {
        setSortBy(column);
        setSortOrder(prevOrder => (sortBy === column && prevOrder === "ASC" ? "DESC" : "ASC"));
    };

    const downloadExcel = () => {
        alert("Download Excel functionality would go here in a real application");
    };

    // Format product data for the table
    const ProductsData = useMemo(() => {
        if (!products || products.length === 0) return [];

        return products.map((item, i) => {
            const rowData = {
                key: item.internal_product_id || i,
                product_name: (
                    <div className="flex gap-3 h-full w-full">
                        <div className="w-8 md:w-[45px] h-[35px] bg-gray-300 border rounded-md flex items-center justify-center text-black font-semibold">
                            {item.internal_product_name?.charAt(0)?.toUpperCase() ?? ''}
                        </div>
                        <div className="text-xs md:text-[12px] text-gray-500 font-medium h-[2rem] flex items-center justify-between w-full">
                                <span className="text-xs md:text-[11px] font-medium cursor-pointer">
                                    {item.internal_product_name}
                                </span>
                        </div>
                    </div>
                ),
                "TOTAL REVENUE": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        ₹{Number(Number(item["TOTAL REVENUE"]).toFixed(0)).toLocaleString("en-IN")}
                    </span>

                ),
                "AD SPENDS": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        ₹{Number(Number(item["AD SPENDS"]).toFixed(0)).toLocaleString("en-IN")}
                    </span>
                ),
                "TOTAL ROAS": (
                    <div
                        className={`px-2 py-1 text-xs md:text-[10.5px] font-medium rounded-full w-fit ${item["TOTAL ROAS"] >= RoasSummary
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                            }`}
                    >
                        {item["TOTAL ROAS"] === 0 || item["TOTAL ROAS"] === null ? '-' : (
                            <span>
                                {Number(item["TOTAL ROAS"]).toFixed(2)}x
                            </span>
                        )}
                    </div>
                ),
                "TOTAL ORDER QTY": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        {Number(item["TOTAL ORDER QTY"]).toLocaleString("en-IN")} pcs
                    </span>
                ),
                "SELLING PRICE": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        ₹{Number(Number(item["SELLING PRICE"]).toFixed(0)).toLocaleString("en-IN")}
                    </span>
                ),
                "AOV": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        ₹{Number(item["AOV"]).toFixed(0)}
                    </span>
                ),
                "CVR %": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        {Number(item["CVR %"]).toFixed(2)}%
                    </span>
                ),
                "AD ORDER QTY": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        {Number(Number(item["AD ORDER QTY"]).toFixed(0)).toLocaleString("en-IN")}
                    </span>
                ),
                "CPM": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        {Number(item["CPM"]).toFixed(2)}
                    </span>
                ),
                "CTR %": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        {Number(item["CTR %"]).toFixed(2)}%
                    </span>
                ),
                "ATC %": (
                    <span className="text-xs md:text-[10.5px] text-gray-500 font-medium">
                        {Number(item["ATC %"]).toFixed(2)}%
                    </span>
                ),
            };

            return rowData;
        });
    }, [products, RoasSummary]);

    const categoryOptions = categories.map(category => ({
        name: category,
        uid: category
    }));

    // Get appropriate sizing based on sidebar and metrics panel state
    const getTableContainerSize = () => {
        if (!isMetricsOpen && isOpen) return "w-[calc(100vw-25rem)]";
        if (isMetricsOpen && !isOpen) return "w-[calc(100vw-17rem)]";
        if (!isMetricsOpen && !isOpen) return "w-[calc(100vw-34.5rem)]";
        return "w-[calc(100vw-6.5rem)]";
    };

    // Component rendering
    return (
        <div className="flex flex-col w-full ">
            <div className="pl-5 pr-2 flex gap-3 items-center h-[3.6rem] bg-gray-900 justify-between mb-2">
                <h2 className="text-md md:text-lg text-white font-medium">Product Analysis</h2>
                <div className='flex gap-3 items-center justify-center'>
                    <div className="w-full ">
                        <PlatformSelector
                            setSelect={setSelectedSellerPlatform}
                            selectedPlatform={selectedSellerPlatform}
                            platforms={['Blinkit', 'Zepto', 'Swiggy']}
                        />
                    </div>
                    <div>
                        {dateRange.length > 0 &&
                            dateRange[0].startDate &&
                            dateRange[0].endDate &&
                            new Date(dateRange[0].startDate).toString() !== "Invalid Date" ? (
                            <Popover
                                placement="bottom"
                                showArrow={true}
                                isOpen={isDatePopoverOpen}
                                onOpenChange={setIsDatePopoverOpen}
                            >
                                <PopoverTrigger>
                                    <Button className="bg-gray-700 text-white border-1 text-[13px] font-medium border-gray-300 rounded-lg h-[2.2rem]">
                                        {`${new Date(dateRange[0].startDate).toLocaleDateString()} - ${new Date(dateRange[0].endDate).toLocaleDateString()}`}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <DateRangeSelector
                                        freezeOnlySevenDays={false}
                                        DateState={dateRange}
                                        setDate={(newDateState) => {
                                            setDateRange(newDateState);
                                        }}
                                        applyDate={() => {
                                            handleApplyFilters();
                                        }}
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
                                    <Button className="bg-gray-700 border-1 font-medium text-white border-gray-300 h-[2.2rem] rounded-lg">
                                        <Calendar className="w-5 h-5" /> Date Range
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <DateRangeSelector
                                        freezeOnlySevenDays={false}
                                        DateState={dateRange}
                                        setDate={(newDateState) => {
                                            setDateRange(newDateState);
                                        }}
                                        applyDate={() => {
                                            handleApplyFilters();
                                        }}
                                        months={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-2 flex flex-col lg:flex-row gap-4 transition-all h-[calc(100vh-73px)] duration-300 ease-in-out">
                <div
                    className={`shadow-md rounded-md flex-grow transition-all duration-300 ${isMetricsOpen ? "w-full" : "w-full lg:w-4/6"} transition-all duration-300 ease-in-out`}
                >
                    <CustomTableSample
                        customeHeightWidth='h-[calc(100vh-173px)] w-full'
                        SearchPlaceholder='Search a Product or Product ID'
                        columns={tableColumns}
                        data={ProductsData}
                        totalRecords={totalRecordsData}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        onPageChange={handleSetCurrentPage}
                        onPageSizeChange={handleSetPageSize}
                        isFirstColumnFixed={true}
                        isLastColumnFixed={false}
                        hideHeader={false}
                        isSearch={true}
                        onChange={(value) => {
                            setProductNameFilter(value);
                        }}
                        onClear={(value) => {
                            setProductNameFilter('');
                        }}
                        SearchValue={productNameFilter}
                        isStatusDropdown={true}
                        StatusOptions={statusOptions}
                        isCategoryDropdown={true}
                        CategoryOptions={categoryOptions}
                        setSelectedCategories={setSelectedCategories}
                        isColumnsDropdown={true}
                        AddButton={false}
                        isPagination={true}
                        tableRootStyle={{}}
                        isDateRange={false}
                        isDownload={true}
                        isMetricsShow={true}
                        handleMetrics={toggleMetrics}
                        error={null}
                        summaryData={summary}
                        downloadExcelSheet={downloadExcel}
                        productsCount={products.length}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        setSorting={setSorting}
                        FirstColumnWidth='w-[30rem]'
                    />
                </div>

                {!isMetricsOpen && (
                    <div className="w-full transition-all rounded-2xl shadow-md duration-300 ease-in-out lg:w-1/5 flex-shrink-0">
                        <Card className="h-full overflow-hidden border ">
                            <div className="p-4 flex flex-col h-full gap-4">
                                <div className="flex-1 space-y-4 h-full">
                                    <Card className="p-3 px-2 shadow-md border h-[13%]">
                                        <div className="text-sm md:text-[16px] font-medium mb-2">Stock Flag</div>
                                        <div className="flex gap-2 text-[12px] max-lg:flex-col">
                                            {stockFlags.map((flag) => (
                                                <Checkbox
                                                    key={flag}
                                                    id={`platform-${flag}`}
                                                    isSelected={selectedStockFlags.includes(flag)}
                                                    onChange={() => toggleStockFlag(flag)}
                                                >
                                                    <span className="text-[13px]">{flag}</span>
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </Card>
                                    <Card className="p-4 shadow-md border h-[37%]">
                                        <h2 className="text-sm md:text-[16px] font-medium mb-4">
                                            Platform Metrics
                                        </h2>

                                        <div className="space-y-2 h-[90%] overflow-auto customscrollbar">
                                            {platformMetrics
                                                .filter((metric) => metric !== "TOTAL REVENUE")
                                                .map((metric) => (
                                                    <div
                                                        key={metric}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            id={`platform-${metric}`}
                                                            isSelected={tempSelectedPlatformMetrics.includes(metric)}
                                                            onChange={() => togglePlatformMetric(metric)}
                                                        />
                                                        <label
                                                            htmlFor={`platform-${metric}`}
                                                            className="text-xs md:text-[12px]"
                                                        >
                                                            {metric}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                    </Card>

                                    <Card className="p-4 shadow-md border h-[36%]">
                                        <h2 className="text-sm md:text-[16px] font-medium mb-3">
                                            Marketing Metrics
                                        </h2>

                                        <div className="space-y-2 h-[90%] overflow-auto customscrollbar">
                                            {marketingMetrics.map((metric) => (
                                                <div
                                                    key={metric}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={`marketing-${metric}`}
                                                        isSelected={tempSelectedMarketingMetrics.includes(metric)}
                                                        onChange={() => toggleMarketingMetric(metric)}
                                                    />
                                                    <label
                                                        htmlFor={`marketing-${metric}`}
                                                        className="text-xs md:text-[12px]"
                                                    >
                                                        {metric}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    <div className="flex gap-2">
                                        <Button
                                            className="bg-blue-700 flex-1 text-white font-medium text-sm md:text-[13.5px]"
                                            variant="solid"
                                            onPress={applyFilters}
                                        >
                                            Apply Filter
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}