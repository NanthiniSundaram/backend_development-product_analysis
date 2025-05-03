import { create } from "zustand";

export const useProductAnalysisStore = create((set, get) => {
    const defaultColumns = [
        { label: "PRODUCT", value: "product", sortable: true, width: "300px" },
        { label: "QUANTITY", value: "quantity", sortable: true, width: "200px" },
        { label: "TOTAL REVENUE", value: "totalRevenue", sortable: true, width: "200px" },
        { label: "INVENTORY", value: "inventory", sortable: true, width: "200px" },
        { label: "AD SPENDS", value: "adSpends", sortable: true, width: "200px" },
        { label: "ROAS", value: "roas", sortable: true, width: "200px" },
    ];

    const defaultMetrics = defaultColumns
        .map(col => col.label.charAt(0) + col.label.slice(1))
        .filter(label => label !== 'PRODUCT');

    return {
        defaultColumns,
        tableColumns: [...defaultColumns],
        defaultMetrics,
        isMetricsOpen: false,
        selectedPlatform: '',
        tempSelectedPlatformMetrics: [...defaultMetrics],
        tempSelectedMarketingMetrics: [],
        selectedPlatformMetrics: [...defaultMetrics],
        selectedMarketingMetrics: [],

        dateState: [
            {
                startDate: '',
                endDate: '',
                key: 'selection',
            },
        ],

        ProductsPageState: {
            currentPage: 1,
            pageSize: 10,
        },

        toggleMetrics: () => set((state) => ({ isMetricsOpen: !state.isMetricsOpen })),
        setPlatform: (platform) => set({ selectedPlatform: platform }),
        togglePlatformMetric: (metric) => {
            set((state) => {
                const isCurrentlySelected = state.tempSelectedPlatformMetrics.includes(metric);

                const newSelectedMetrics = isCurrentlySelected
                    ? state.tempSelectedPlatformMetrics.filter(item => item !== metric)
                    : [...state.tempSelectedPlatformMetrics, metric];

                return {
                    tempSelectedPlatformMetrics: newSelectedMetrics
                };
            });
        },

        toggleMarketingMetric: (metric) => {
            set((state) => {
                const isCurrentlySelected = state.tempSelectedMarketingMetrics.includes(metric);
                const newSelectedMetrics = isCurrentlySelected
                    ? state.tempSelectedMarketingMetrics.filter(item => item !== metric)
                    : [...state.tempSelectedMarketingMetrics, metric];

                return {
                    tempSelectedMarketingMetrics: newSelectedMetrics
                };
            });
        },

        setDateState: (newState) => set({ dateState: newState }),

        handleSetCurrentPage: (num) => set((state) => ({
            ProductsPageState: {
                ...state.ProductsPageState,
                currentPage: num,
            },
        })),

        handleSetPageSize: (num) => set((state) => ({
            ProductsPageState: {
                ...state.ProductsPageState,
                pageSize: num,
                currentPage: 1,
            },
        })),



        handleTotalColumns: () => {
            set((state) => {
                const productColumn = state.defaultColumns.find(col => col.value === "product");
                const newColumns = [productColumn];
                state.tempSelectedPlatformMetrics.forEach(metricName => {
                    const columnValue = metricName.toLowerCase().replace(/\s+/g, '');
                    const columnLabel = metricName.toUpperCase();

                    const defaultColumn = state.defaultColumns.find(
                        col => col.label === columnLabel
                    );

                    if (defaultColumn) {
                        newColumns.push(defaultColumn);
                    } else {
                        newColumns.push({
                            label: columnLabel,
                            value: columnValue,
                            sortable: true,
                            width: "200px"
                        });
                    }
                });

                state.tempSelectedMarketingMetrics.forEach(metricName => {
                    newColumns.push({
                        label: metricName.toUpperCase(),
                        value: metricName.toLowerCase().replace(/\s+/g, '_'),
                        sortable: true,
                        width: "200px"
                    });
                });

                return {
                    tableColumns: newColumns,
                    selectedPlatformMetrics: [...state.tempSelectedPlatformMetrics],
                    selectedMarketingMetrics: [...state.tempSelectedMarketingMetrics]
                };
            });
        },

        clearSelections: () => {
            set((state) => ({
                tempSelectedPlatformMetrics: [...state.defaultMetrics],
                tempSelectedMarketingMetrics: [],
                selectedPlatformMetrics: [...state.defaultMetrics],
                selectedMarketingMetrics: [],
                selectedPlatform: '',
                tableColumns: [...state.defaultColumns]
            }));
        },
    };
});








import React, { useMemo, useState } from "react";
import { columns, data, TableData } from "./utils";
import CustomTable from "../../../../components/table";
import {
  Card,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useProductAnalysisStore } from "../../../../store/analysis/product-analysis/productStore";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Download, List } from "lucide-react";
import { DownArrow } from "../../../../assets/svg/arrowDown";
import Bar from "../../../../assets/bar.svg";
import { DateRangePicker } from "@heroui/date-picker";
import CustomTableSample from "../../../../components/table/sample";
import { useSidebarStore } from "../../../../store/sidebar/sidebarStore";
import { addDays } from "date-fns";
import SwiggyLogo from "../../../../assets/swiggy.png";

export default function ProductAnalysis() {
  const {
    selectedPlatformMetrics,
    selectedMarketingMetrics,
    selectedPlatform,
    togglePlatformMetric,
    toggleMarketingMetric,
    setPlatform,
    ProductsPageState,
    handleSetCurrentPage,
    handleSetPageSize,
    toggleMetrics,
    isMetricsOpen,
    handleTotalColumns,
    tableColumns,
    dateState,
    setDateState,
    defaultMetrics,
    defaultColumns,
    tempSelectedPlatformMetrics,
  } = useProductAnalysisStore();

  const { isOpen } = useSidebarStore();

  const statusOptions = [
    { name: "High ROAS", uid: "high" },
    { name: "Low ROAS", uid: "low" },
  ];

  const categoryOptions = [
    { name: "Electronics", uid: "electronics" },
    { name: "Fashion", uid: "fashion" },
    { name: "Dairy Products", uid: "dairy_products" },
  ];

  const defaultColumnValues = tableColumns
    .map(
      (col) =>
        // Convert the column labels to match the format of platform metrics
        col.label.charAt(0) + col.label.slice(1).toLowerCase()
    )
    .filter((label) => label !== "Product");

  const platformMetrics = [
    "QUANTITY",
    "TOTAL REVENUE",
    "FINAL PRICE",
    "MAX SELLING PRICE",
    "DISCOUNT %",
    "INVENTORY",
    "ROAS",
    "TOTAL ORDER QTY",
    "AOV",
    "STOCK AT DOORSTORE",
    "STOCK AT WAREHOUSE",
    "CONVERSION RATE",
  ];

  const marketingMetrics = [
    "AD ORDER QTY",
    "AD REVENUE",
    "AD SPENDS",
    "AD ROAS",
    "BLENDED ROAS",
    "IMPRESSIONS",
    "CPM",
    "CLICKS",
    "CTR %",
    "ADD TO CARTS",
    "ATC %",
  ];

  const platforms = [
    { name: "Zepto", color: "bg-blue-100" },
    { name: "Blinkit", color: "bg-yellow-100" },
    { name: "Swiggy", color: "bg-orange-100" },
  ];

  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [viewType, setViewType] = useState("grid");

  const ProductsData = useMemo(() => {
    return data?.map((item, i) => ({
      key: i,
      product: (
        <div className="flex gap-3 w-full md:w-[13rem]">
          <img
            src={item.img}
            alt=""
            className="w-8 md:w-10 h-8 md:h-10 bg-gray-200 rounded-md"
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs md:text-[14px] font-medium">
              {" "}
              {item?.product}{" "}
            </span>
            <span className="text-xs md:text-[14px] text-gray-500 font-medium">
              ${item?.product_rate.toLocaleString()}
            </span>
          </div>
        </div>
      ),
      quantity: (
        <span className="text-xs md:text-sm text-gray-500 font-medium">
          {" "}
          {item?.quantity}{" "}
        </span>
      ),
      totalRevenue: (
        <span className="text-xs md:text-sm text-gray-500 font-medium">
          ₹{item.totalRevenue.toLocaleString()}
        </span>
      ),
      inventory: (
        <span className="text-xs md:text-sm text-gray-500 font-medium">
          {item.inventory.toLocaleString()} pcs
        </span>
      ),
      adSpends: (
        <span className="text-xs md:text-sm text-gray-500 font-medium">
          ${item.adSpends.toLocaleString()}
        </span>
      ),
      roas: (
        <div
          className={`px-2 py-1 text-xs md:text-sm font-medium rounded-full w-fit ${
            item.roas >= 8
              ? "bg-success-50 text-success-700"
              : item.roas >= 7
              ? "bg-warning-50 text-warning-700"
              : "bg-error-50 text-error-700"
          }`}
        >
          {item.roas.toFixed(2)}x
        </div>
      ),
    }));
  }, [data]);

  return (
    <div className="flex flex-col w-full ">
      <div className="flex gap-3 items-center">
        <img src={Bar} className="w-6 h-6" />
        <h2 className="text-lg md:text-xl font-semibold">Product Analysis</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4 h-[calc(100vh-8.5rem)]  transition-all duration-300 ease-in-out">
        <div
          className={`flex-grow transition-all duration-300 ${
            isMetricsOpen ? "w-full" : "w-full lg:w-3/4"
          }  transition-all duration-300 ease-in-out`}
        >
          {/* ${!isMetricsOpen && isOpen ? 'bg-[red]' : isMetricsOpen && !isOpen ? 'bg-[blue]' : !isMetricsOpen && !isOpen ? 'bg-[pink]' : 'bg-[green] '} */}
          <CustomTableSample
            columns={tableColumns}
            data={ProductsData}
            totalRecords={data}
            currentPage={ProductsPageState.currentPage}
            pageSize={ProductsPageState.pageSize}
            onPageChange={handleSetCurrentPage}
            onPageSizeChange={handleSetPageSize}
            isFirstColumnFixed={true}
            isLastColumnFixed={false}
            hideHeader={false}
            isSearch={true}
            isStatusDropdown={true}
            StatusOptions={statusOptions}
            isCategoryDropdown={true}
            CategoryOptions={categoryOptions}
            isColumnsDropdown={true}
            AddButton={false}
            isPagination={true}
            tableRootStyle={{
              height: "calc(100vh - 1rem)",
              overflowX: "auto",
            }}
            customeHeightWidth={`${
              !isMetricsOpen && isOpen
                ? "w-[calc(100vw-30rem)]"
                : isMetricsOpen && !isOpen
                ? "w-[calc(100vw-17rem)]"
                : !isMetricsOpen && !isOpen
                ? "w-[calc(100vw-40rem)]"
                : "w-[calc(100vw-6.5rem)]"
            }`}
            isDateRange={true}
            isDownload={true}
            isMetricsShow={true}
            DateState={dateState}
            setDate={setDateState}
            monthsRange={2}
            handleMetrics={toggleMetrics}
          />
        </div>

        {!isMetricsOpen && (
          <div className="w-full  transition-all duration-300 ease-in-out lg:w-1/4 flex-shrink-0">
            <Card className="h-full overflow-hidden border shadow-none">
              <div className="p-4 flex flex-col h-full gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`
                      bg-gradient-to-r from-[#845ca9] to-[#7a13c3]
                      px-4 py-2 rounded-xl cursor-pointer shadow-lg
                      transform hover:scale-105 transition-transform
                      ${
                        selectedPlatform === "Zepto"
                          ? "ring-2 ring-purple-900"
                          : ""
                      }
                    `}
                    onClick={() => setPlatform("Zepto")}
                  >
                    <div className=" flex items-center justify-center bg-gradient-to-r from-[#FF5C85] via-[#FB5B7F] to-[#FA6E54] bg-clip-text text-transparent">
                      <span
                        className={`${
                          isOpen ? "text-2xl -mt-1" : "text-xl"
                        } font-bold italic `}
                      >
                        zepto
                      </span>
                    </div>
                  </div>
                  <div
                    className={`
                      bg-[#FFE141] 
                      px-4 py-2 rounded-xl cursor-pointer shadow-lg
                      transform hover:scale-105 transition-transform
                      ${
                        selectedPlatform === "Blinkit"
                          ? "ring-2 ring-yellow-700"
                          : ""
                      }
                    `}
                    onClick={() => setPlatform("Blinkit")}
                  >
                    <div
                      className={`${
                        isOpen ? "text-2xl" : "text-xl"
                      } flex items-center justify-center`}
                    >
                      <span className="text-black font-bold ">blink</span>
                      <span className="text-[#00B37A] font-bold ">it</span>
                    </div>
                  </div>

                  <div
                    className={`
                      bg-[#FC8019] 
                      px-4 py-2 rounded-xl cursor-pointer shadow-lg
                      transform hover:scale-105 transition-transform flex items-center justify-center
                      ${
                        selectedPlatform === "Swiggy"
                          ? "ring-2 ring-orange-700"
                          : ""
                      }
                    `}
                    onClick={() => setPlatform("Swiggy")}
                  >
                    <div className="flex items-center gap-1">
                      <img
                        src={SwiggyLogo}
                        alt="logo"
                        className={`${isOpen ? "-ml-2 w-4 " : "-ml-2 w-3 "} `}
                      />
                      <span
                        className={`${
                          isOpen ? "text-md" : "text-sm"
                        } text-white font-bold `}
                      >
                        SWIGGY
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 h-full">
                  <Card className="p-4 shadow-none border h-[38%]">
                    <h2 className="text-sm md:text-lg font-medium mb-4">
                      Platform Metrics
                    </h2>
                    <div className="space-y-2 h-[90%] overflow-auto customscrollbar">
                      {platformMetrics.map((metric) => (
                        <div
                          key={metric}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`platform-${metric}`}
                            isSelected={tempSelectedPlatformMetrics.includes(
                              metric
                            )}
                            onChange={() => togglePlatformMetric(metric)}
                          />
                          <label
                            htmlFor={`platform-${metric}`}
                            className="text-xs md:text-sm"
                          >
                            {metric}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4 shadow-none border h-[38%]">
                    <h2 className="text-sm md:text-lg font-medium mb-3">
                      Marketing Metrics
                    </h2>
                    <div className="space-y-2 h-[90%]  overflow-auto customscrollbar ">
                      {/* {marketingMetrics.map((metric) => (
                        <div key={metric} className="flex items-center space-x-2">
                          <Checkbox
                            id={`marketing-${metric}`}
                            checked={selectedMarketingMetrics.includes(metric)}
                            onChange={() => toggleMarketingMetric(metric)}
                          />
                          <label htmlFor={`marketing-${metric}`} className="text-xs md:text-sm">{metric}</label>
                        </div>
                      ))} */}

                      {marketingMetrics.map((metric) => (
                        <div
                          key={metric}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`marketing-${metric}`}
                            isSelected={tempSelectedPlatformMetrics.includes(
                              metric
                            )}
                            onChange={() => togglePlatformMetric(metric)}
                          />
                          <label
                            htmlFor={`marketing-${metric}`}
                            className="text-xs md:text-sm"
                          >
                            {metric}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Button
                    className=" bg-primary-400 w-full text-white font-medium text-sm md:text-md"
                    variant="solid"
                    onPress={handleTotalColumns}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

\
const tableData = useMemo(() => {
    const transformedData = [];

    // Calculate which categories to show based on pagination
    const startCategoryIndex = (currentPageState - 1) * categoriesPerPage;
    const endCategoryIndex = startCategoryIndex + categoriesPerPage;
    const paginatedCategories = filteredData.slice(startCategoryIndex, endCategoryIndex);

    paginatedCategories.forEach(item => {
      // Calculate category summary
      const categorySummary = {};
      columnValues.forEach(columnValue => {
        const mappedKey = columnNameMapping[columnValue];

        if (mappedKey && item.metrics && item.metrics[mappedKey]) {
          // Sum up values for metric columns
          categorySummary[columnValue] = Object.values(item.metrics[mappedKey]).reduce((sum, val) => sum + val, 0);
        } else if (item[mappedKey] !== undefined) {
          // For any additional columns not in metrics
          categorySummary[columnValue] = item[mappedKey];
        } else {
          categorySummary[columnValue] = "-";
        }
      });

      // Summary row for the category
      const summaryRow = {
        id: `${item.id}-summary`,
        category: item.category,
        SUBCATEGORY: "Summary",
        isCategorySummary: true,
        parentId: item.id,
        hasToggle: true,
      };

      // Add all column values with proper formatting
      columnValues.forEach(columnValue => {
        if (columnValue === "category" || columnValue === "SUBCATEGORY") {
          // Already added above
        } else {
          const value = categorySummary[columnValue] || 0;

          // Format based on column type (you can expand this formatting as needed)
          if (
            columnValue === "QTY.SOLD" ||
            columnValue === "REVENUE LOSS" ||
            columnValue === "TOTAL REVENUE" ||
            columnValue === "AD SPENDS" ||
            columnValue === "AD REVENUE"
          ) {
            summaryRow[columnValue] = `$${value.toLocaleString()}`;
          } else {
            summaryRow[columnValue] = value.toLocaleString();
          }
        }
      });

      // Add category summary row
      transformedData.push(summaryRow);

      // Add product rows
      if (!showSummaryOnly || expandedCategories[item.id]) {
        item.SUBCATEGORY.forEach((subcat, index) => {
          const productRow = {
            id: `${item.id}-${index}`,
            category: "",  // Empty for subcategories
            SUBCATEGORY: subcat,
            isParent: false,
            parentId: item.id,
            isLastChild: index === item.SUBCATEGORY.length - 1,
            isLastInCategory: index === item.SUBCATEGORY.length - 1
          };

          // Add all column values with proper formatting
          columnValues.forEach(columnValue => {
            if (columnValue === "category" || columnValue === "SUBCATEGORY") {
              // Already added above
            } else {
              const mappedKey = columnNameMapping[columnValue];

              if (mappedKey && item.metrics && item.metrics[mappedKey]) {
                const value = item.metrics[mappedKey]?.[subcat];

                // Handle undefined or missing values
                if (value === undefined) {
                  productRow[columnValue] = "a";
                } else {
                  // Format based on column type
                  if (
                    columnValue === "CATEGORY" ||
                    columnValue === "QTY.SOLD" ||
                    columnValue === "QTY.SOLD" ||
                    columnValue === "REVENUE LOSS" ||
                    columnValue === "TOTAL REVENUE" ||
                    columnValue === "AD SPENDS" ||
                    columnValue === "AD REVENUE" 
                  ) {
                    productRow[columnValue] = `$${value.toLocaleString()}`;
                  } else {
                    productRow[columnValue] = value.toLocaleString();
                  }
                }
              } else {
                productRow[columnValue] = "-";
              }
            }
          });

          transformedData.push(productRow);
        });
      }
    });

    return transformedData;
  }, [currentPageState, filteredData, showSummaryOnly, expandedCategories, columnValues]);


  import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, List, Download, Calendar } from "lucide-react";
import DateRangeSelector from "../dateRangePicker/dateRange";
import * as XLSX from 'xlsx';

export default function CategoryTable(props) {
  const {
    Title = '',
    SearchPlaceholder = 'Search category...',
    isSearch = true,
    isDownload = true,
    handleMetrics,
    isCategoryDropdown = true,
    dropDowncomponent,
    isDateRange = true,
    dateState,
    DateState,
    monthsRange = 2,
    setDate,
    columns = defaultColumns, // Use provided columns or default
    data = [],
    category,
    customeHeightWidth,
    applyDate,
    currentPage = 1,
    onCurrentPageChange,
    pageSize = 10,
    onPageSizeChange,
  } = props;

  const [filterValue, setFilterValue] = useState("");
  const [currentPageState, setCurrentPageState] = useState(currentPage);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "category_name",
    direction: "ascending",
  });
  const [expandedCategories, setExpandedCategories] = useState({});

  // Transform data to create table rows with category and subcategory structure
  const transformedData = useMemo(() => {
    const result = [];

    data.forEach(categoryItem => {
      // Category summary row
      const categorySummary = {
        id: `summary-${categoryItem.id}`,
        category_name: categoryItem.category_name,
        subcategory_name: "Summary",
        isCategorySummary: true,
        parentId: categoryItem.id,
        hasToggle: true,
        ...Object.fromEntries(
          Object.keys(categoryItem.metrics).map(metricKey => [
            metricKey, 
            `$${categoryItem.categorySummary.insights[metricKey].total.toLocaleString()}`
          ])
        )
      };
      result.push(categorySummary);

      // Subcategory rows
      categoryItem.subcategories.forEach((subcategory, index) => {
        const subcategoryRow = {
          id: `${categoryItem.id}-${index}`,
          category_name: "",
          subcategory_name: subcategory,
          isParent: false,
          parentId: categoryItem.id,
          isLastChild: index === categoryItem.subcategories.length - 1,
          isLastInCategory: index === categoryItem.subcategories.length - 1,
          ...Object.fromEntries(
            Object.keys(categoryItem.metrics).map(metricKey => [
              metricKey, 
              `$${categoryItem.metrics[metricKey][subcategory].toLocaleString()}`
            ])
          )
        };
        result.push(subcategoryRow);
      });
    });

    return result;
  }, [data]);

  // Filtering logic
  const filteredItems = useMemo(() => {
    if (!filterValue.trim()) return transformedData;

    const searchTerm = filterValue.toLowerCase().trim();
    return transformedData.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm)
      )
    );
  }, [transformedData, filterValue]);

  // Sorting logic
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      // Always keep parent rows with their children
      if (a.parentId !== b.parentId) {
        return a.parentId - b.parentId;
      }

      // Keep category summary at the top of each category
      if (a.isCategorySummary && !b.isCategorySummary) return -1;
      if (!a.isCategorySummary && b.isCategorySummary) return 1;

      const column = sortDescriptor.column;
      let aValue = a[column] || "";
      let bValue = b[column] || "";

      // Remove currency symbols and commas for comparison
      aValue = typeof aValue === 'string' ? aValue.replace(/[^0-9.]/g, '') : aValue;
      bValue = typeof bValue === 'string' ? bValue.replace(/[^0-9.]/g, '') : bValue;

      // Convert to numbers if possible
      aValue = isNaN(Number(aValue)) ? aValue : Number(aValue);
      bValue = isNaN(Number(bValue)) ? bValue : Number(bValue);

      // Compare
      if (aValue < bValue) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortDescriptor.direction === "ascending" ? 1 : -1;

      return 0;
    });
  }, [filteredItems, sortDescriptor]);

  // Pagination and other methods remain similar to previous implementation
  // ... (previous pagination and helper method implementations)

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md w-full border border-gray-200 h-full">
      {/* Header and other components remain the same */}
      
      <div className="relative flex-grow overflow-auto customscrollbargray" style={{ height: 'calc(100vh - 220px)' }}>
        <Table
          aria-label="Category analysis table"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          classNames={{
            wrapper: `${customeHeightWidth} widthscrollbar`,
            base: "overflow-hidden",
            table: "w-full",
            thead: "sticky top-0 z-10 bg-gray-50",
            th: "bg-gray-50 text-xs sm:text-sm font-semibold text-gray-700 py-3 px-4 text-center",
            tbody: "divide-y divide-gray-200",
            tr: "hover:bg-gray-50",
            td: "text-xs sm:text-sm py-3 px-4 text-center",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn 
                key={column.value} 
                allowsSorting={column.sortable}
                style={{ width: column.width || 'auto' }}
                className="sticky top-0 z-10 bg-gray-50 text-center"
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody>
            {sortedItems.map((item) => {
              const isCategorySummary = item.isCategorySummary;

              return (
                <TableRow 
                  key={item.id}
                  className={isCategorySummary ? "bg-gray-50" : "hover:bg-gray-50"}
                >
                  {columns.map((column) => {
                    const cellValue = item[column.value] !== undefined ? item[column.value] : "-";
                    
                    let cellClass = "text-center";
                    if (isCategorySummary) {
                      cellClass += " font-medium bg-gray-50 border-b-2 border-gray-300";
                    }

                    return (
                      <TableCell
                        key={`${item.id}-${column.value}`}
                        className={cellClass}
                        style={{ width: column.width || 'auto' }}
                      >
                        {cellValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination component remains the same */}
    </div>
  );
}

// Default columns matching your specified format
const defaultColumns = [
  { label: "CATEGORY", value: "category_name", sortable: true },
  { label: "SUBCATEGORY", value: "subcategory_name", sortable: true },
  { label: "TOTAL REVENUE", value: "TOTAL REVENUE", sortable: true, width: "200px" },
  { label: "INVENTORY", value: "INVENTORY", sortable: true, width: "200px" },
  { label: "AD SPENDS", value: "AD SPENDS", sortable: true, width: "200px" },
  { label: "ROAS", value: "ROAS", sortable: true, width: "200px" },
];