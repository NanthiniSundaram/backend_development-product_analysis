// CustomTableSample.jsx - Updated with nested table support and expand/collapse arrows
import React, { useEffect, useState, useRef } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import {
  renderSummaryCell,
  getStickyColumnClass,
  getCellStyle,
  getColumnPositions,
  calculateMinTableWidth
} from "./tableUtil";
import TableHeader from "./header";
import TablePagination from "./pagination";

export default function CustomTableSample(props) {
  const {
    Title = '',
    columns = [],
    data = [],
    summaryData = {},
    totalRecords,
    currentPage = 1,
    pageSize = 20,
    onPageChange,
    onPageSizeChange,
    isLastColumnFixed = false,
    hideHeader = false,
    isSearch = true,
    onChange,
    // SearchValue,
    searchItem,
    SearchPlaceholder = 'Search a Product',
    isStatusDropdown = true,
    statusComponent,
    isCategoryDropdown = true,
    isColumnsDropdown = true,
    isWeekDropDown = false,
    isFilter = false,
    AddButton = true,
    StatusOptions = [],
    CategoryOptions = [],
    WeekOptions = [],
    isPagination = true,
    customeHeightWidth = 'h-[calc(100vh-210px)] w-full',
    isDateRange = false,
    dateRangeComponent = 'Date Range',
    isDownload = false,
    ToggleShow = false,
    TabComponent,
    isMetricsShow = false,
    isPopupShow = false,
    OverallHeight = '',
    DateState,
    setDate,
    applyDate,
    monthsRange,
    handleMetrics,
    handlePopup,
    setSelectedCategories,
    dropDowncomponent,
    downloadExcelSheet,
    productsCount,
    Sorting = "ASC",
    onlySearch = false,
    onClear,
    showSortIcon = true,
    sortBy,
    sortOrder,
    setSorting,
    Loading = false,
    columnScroll = 'overflow-x-hidden',
    marginTop,
    SummaryDetailsShow = true,
    scrollBarHide = false,
    headerPadding = 'py-2',
    FirstColumnWidth = '',
    SecondColumnWidth = '',
    tableColumnHeaderClass = 'py-[0.7rem]',
    CustomSearchWidth = '',
    FixColumnCount = 1,
    // New props for nested table
    isNestedTable = false,
  } = props;

  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localSelectedCategories, setLocalSelectedCategories] = useState([]);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [tableWidth, setTableWidth] = useState('100%');
  const [scrollPosition, setScrollPosition] = useState(0);
  const tableContainerRef = useRef(null);
  const tableBodyRef = useRef(null);
  const tableHeaderRef = useRef(null);

  // States for nested table functionality
  const [expandedRows, setExpandedRows] = useState({});
  const [showAllNested, setShowAllNested] = useState(false);

  // Function to toggle expansion of a specific row
  const toggleRowExpansion = (rowId) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Function to toggle expansion of all rows
  const toggleAllNested = () => {
    const newShowAllNested = !showAllNested;
    setShowAllNested(newShowAllNested);

    // If showing all nested, expand all rows that have subCities
    // Otherwise, collapse all rows
    if (newShowAllNested) {
      const allExpanded = {};
      data.forEach(item => {
        if (item.subCities && item.subCities.length > 0) {
          allExpanded[item.internal_product_id] = true;
        }
      });
      setExpandedRows(allExpanded);
    } else {
      setExpandedRows({});
    }
  };

  // Calculate column positions for fixed columns
  const columnPositions = getColumnPositions(columns, FirstColumnWidth, SecondColumnWidth, FixColumnCount);

  useEffect(() => {
    const updateWidth = () => {
      if (tableContainerRef.current) {
        const containerWidth = tableContainerRef.current.offsetWidth;
        const minTableWidth = calculateMinTableWidth(columns);
        setTableWidth(Math.max(containerWidth, minTableWidth) + 'px');
      }
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => window.removeEventListener('resize', updateWidth);
  }, [columns, tableContainerRef]);

  useEffect(() => {
    const handleBodyScroll = () => {
      if (tableBodyRef.current && tableHeaderRef.current) {
        const scrollLeft = tableBodyRef.current.scrollLeft;
        tableHeaderRef.current.scrollLeft = scrollLeft;
        setScrollPosition(scrollLeft);
      }
    };

    const bodyElement = tableBodyRef.current;
    if (bodyElement) {
      bodyElement.addEventListener('scroll', handleBodyScroll);
      return () => bodyElement.removeEventListener('scroll', handleBodyScroll);
    }
  }, [tableBodyRef, tableHeaderRef]);

  // Fix: Ensure a valid totalRecords value
  const validTotalRecords = totalRecords || data.length || 0;
  const pages = Math.max(1, Math.ceil(validTotalRecords / pageSize));

  // Fix pagination logic issue
  useEffect(() => {
    if (currentPage > pages && pages > 0) {
      onPageChange?.(1);
    }
  }, [currentPage, pages, onPageChange]);

  const renderCell = React.useCallback((item, columnKey, isSubCity = false) => {
    const cellValue = item[columnKey];

    // For the first column, add expand/collapse arrows if it has subCities
    if (columnKey === columns[0].value && isNestedTable && !isSubCity) {
      const hasSubCities = item.subCities && item.subCities.length > 0;
      const isExpanded = expandedRows[item.internal_product_id];

      if (hasSubCities) {
        return (
          <div className="flex gap-2 items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full  hover:bg-gray-200 transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </span>
            <span className="w-full">{cellValue}</span>
          </div>
        );
      }

    }

    // For city rows, add indentation
    if (isSubCity && columnKey === 'city_name') {
      return (
        <div className="flex items-center ml-8 text-gray-700">
          {cellValue}
        </div>
      );
    }

    // Default cell rendering
    return (
      <div className={`flex items-center justify-center mx-0 px-0 ${isSubCity ? '' : columnKey === 'product_name' && isNestedTable ? 'ml-9' : ''}`}>
        {cellValue}
      </div>
    );
  }, [expandedRows, isNestedTable, columns]);

  const onSearchChange = React.useCallback((value) => {
    setFilterValue(value);
    onPageChange?.(1);
  }, [onPageChange]);

  // For server-side or client-side pagination
  const currentItems = React.useMemo(() => {
    // For server-side pagination, just return the data directly
    if (onPageChange && onPageSizeChange) {
      return data;
    }

    // For client-side pagination, slice the data correctly
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize, onPageChange, onPageSizeChange]);

  return (
    <div className={`flex flex-col bg-white rounded-lg overflow-hidden border-1 h-full border-gray-300 ${OverallHeight}`} ref={tableContainerRef}>

      {/* Fixed Header Section - Using the TableHeader component with nested table props */}
      <div className={`sticky flex flex-col rounded-lg items-between justify-center z-40 px-2 border-b border-gray-100 bg-white ${headerPadding}`}>
        <TableHeader
          Title={Title}
          isSearch={isSearch}
          // SearchValue={SearchValue}
          SearchPlaceholder={SearchPlaceholder}
          onChange={onChange}
          onClear={onClear}
          searchItem={searchItem}
          isStatusDropdown={isStatusDropdown}
          statusComponent={statusComponent}
          isCategoryDropdown={isCategoryDropdown}
          dropDowncomponent={dropDowncomponent}
          isWeekDropDown={isWeekDropDown}
          WeekOptions={WeekOptions}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          isDateRange={isDateRange}
          dateRangeComponent={dateRangeComponent}
          isFilter={isFilter}
          isDownload={isDownload}
          downloadExcelSheet={downloadExcelSheet}
          isMetricsShow={isMetricsShow}
          handleMetrics={handleMetrics}
          isPopupShow={isPopupShow}
          handlePopup={handlePopup}
          ToggleShow={ToggleShow}
          TabComponent={TabComponent}
          AddButton={AddButton}
          CustomSearchWidth={CustomSearchWidth}
          onlySearch={onlySearch}
          // New props for nested table
          isNestedTable={isNestedTable}
          showAllNested={showAllNested}
          toggleAllNested={toggleAllNested}
        />
      </div>

      <div className="flex flex-col relative px-0">
        {/* Table Container */}
        <div className={`flex-grow relative ${marginTop}`}>
          {data.length !== 0 ? (
            <div className="relative">
              {/* Unified scrollable container */}
              <div
                ref={tableBodyRef}
                className={`${customeHeightWidth} overflow-y-auto overflow-x-auto widthscrollbar`}
                style={{ scrollBehavior: 'smooth' }}
              >
                <table className="min-w-full border-collapse table-fixed bg-white" style={{ width: tableWidth }}>
                  {/* Table Header */}
                  {!hideHeader && (
                    <thead className="sticky w-full top-0 z-40 bg-gray-100 shadow-sm">
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={column.value}
                            className={`${getStickyColumnClass(index, columns, isLastColumnFixed, FirstColumnWidth, SecondColumnWidth, FixColumnCount)} ${tableColumnHeaderClass} text-xs font-semibold text-gray-800 border-b border-gray-300 text-center bg-[#f3f4f6]`}
                            style={{
                              ...getCellStyle(index, columns, isLastColumnFixed, columnPositions, FixColumnCount, true),
                              display: "",
                              placeItems: "center",
                              backgroundColor: "#f3f4f6" // Consistent header color
                            }}
                          >
                            <div
                              className="flex items-center justify-center gap-1 cursor-pointer"
                              onClick={() => column.sortable && setSorting(column.value)}
                            >
                              <span className="text-[13px] font-medium">
                                {typeof column.label === "string"
                                  ? column.label
                                    .toLowerCase()
                                    .split(' ')
                                    .map(word =>
                                      word.length <= 3 && word != 'at' && word != 'of' && word != 'out'
                                        ? word.toUpperCase()
                                        : word.charAt(0).toUpperCase() + word.slice(1)
                                    )
                                    .join(' ')
                                  : column.label}
                              </span>

                              {showSortIcon && column.sortable ? (
                                <Tooltip
                                  title={<span className="text-[12px] font-poppins font-medium py-4">Sort</span>}
                                  placement="top"
                                  arrow
                                >
                                  <span className="text-gray-500 text-lg relative ml-1 z-0">
                                    <div className="flex flex-col items-center">
                                      <IoIosArrowUp
                                        className={`text-[12px] ${sortBy === column.value && sortOrder === "ASC"
                                          ? "text-gray-800"
                                          : "text-gray-400"}`}
                                      />
                                      <IoIosArrowDown
                                        className={`text-[12px] ${sortBy === column.value && sortOrder === "DESC"
                                          ? "text-gray-800"
                                          : "text-gray-400"}`}
                                        style={{ marginTop: "-6px" }}
                                      />
                                    </div>
                                  </span>
                                </Tooltip>
                              ) :
                                <span className="text-gray-500 text-lg relative ml-1 z-0">
                                  <div className="flex flex-col items-center">
                                    <span
                                      className={`h-6 text-[12px] ${sortBy === column.value && sortOrder === "ASC"
                                        ? "text-gray-800"
                                        : "text-gray-400"}`}
                                    />
                                    <span
                                      className={`text-[12px] ${sortBy === column.value && sortOrder === "DESC"
                                        ? "text-gray-800"
                                        : "text-gray-400"}`}
                                      style={{ marginTop: "-6px" }}
                                    />
                                  </div>
                                </span>
                              }
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}

                  {/* Summary Row (Sticky below header) */}
                  {SummaryDetailsShow && Object.keys(summaryData).length > 0 && (
                    <tbody className="sticky top-[2.5rem] z-30 bg-gray-50 shadow-sm">
                      <tr>
                        {columns.map((column, index) => (
                          <td
                            key={`summary-${column.value}`}
                            className={`${getStickyColumnClass(index, columns, isLastColumnFixed, FirstColumnWidth, SecondColumnWidth, FixColumnCount)} py-[0.4rem] px-4 text-[12px] font-medium text-gray-700  border-b-2 border-gray-50 !bg-gray-50 ${column.value === 'Summary' ? 'bg-[red] hidden' : ''}`}
                            style={getCellStyle(index, columns, isLastColumnFixed, columnPositions, FixColumnCount)}
                          >
                            {renderSummaryCell(column.value, summaryData)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  )}

                  {/* Table Body with support for nested rows */}
                  <tbody>
                    {currentItems.map((item, i) => {
                      const hasSubCities = isNestedTable && item.subCities && item.subCities.length > 0;
                      const isExpanded = expandedRows[item.internal_product_id];

                      return (
                        <React.Fragment key={item.internal_product_id || `item-${i}`}>
                          {/* Main product row */}
                          <tr
                            className={`hover:bg-white transition-colors ${i % 2 === 0 && !isNestedTable ? 'bg-white' : !isNestedTable ? 'bg-gray-50' : ''} ${hasSubCities ? 'cursor-pointer' : ''}`}
                            onClick={() => {
                              if (hasSubCities) {
                                toggleRowExpansion(item.internal_product_id);
                              }
                            }}
                          >
                            {columns.map((column, columnIndex) => (
                              <td
                                key={`${item.internal_product_id || i}-${column.value}`}
                                className={`${getStickyColumnClass(columnIndex, columns, isLastColumnFixed, FirstColumnWidth, SecondColumnWidth, FixColumnCount)} py-2 px-4 text-xs border-b border-gray-200 text-gray-700`}
                                style={getCellStyle(columnIndex, columns, isLastColumnFixed, columnPositions, FixColumnCount)}
                              >
                                {renderCell(item, column.value)}
                              </td>
                            ))}
                          </tr>

                          {/* Nested city rows - only render if expanded */}
                          {hasSubCities && isExpanded && item.subCities.map((city, cityIndex) => (
                            <tr
                              key={`${item.internal_product_id}-city-${cityIndex}`}
                              className="bg-gray-100 border-b border-gray-200 transition-all animate-fadeIn"
                            >
                              {columns.map((column, columnIndex) => {
                                // For the first column, show city name
                                const displayValue = columnIndex === 0
                                  ? { ...city, city_name: city.city_name }
                                  : city;

                                const columnKey = columnIndex === 0
                                  ? 'city_name'
                                  : column.value;

                                return (
                                  <td
                                    key={`${item.internal_product_id}-city-${cityIndex}-${column.value}`}
                                    className={`${getStickyColumnClass(columnIndex, columns, isLastColumnFixed, FirstColumnWidth, SecondColumnWidth, FixColumnCount)} py-1 px-4 text-xs border-b border-gray-200 text-gray-600`}
                                    style={{
                                      ...getCellStyle(columnIndex, columns, isLastColumnFixed, columnPositions, FixColumnCount),
                                      backgroundColor: 'rgba(249, 250, 251, 0.8)'  // Light background for nested rows
                                    }}
                                  >
                                    {renderCell(displayValue, columnKey, true)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center py-16 h-64 ${customeHeightWidth} `}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                className="mb-4"
              >
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg font-medium text-gray-500"
              >
                No data found
              </motion.p>
            </div>
          )}
        </div>
      </div>


      {/* Fixed Footer with Pagination - Using the TablePagination component */}
      {isPagination && data.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={validTotalRecords}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}