import React, { useEffect, useState, useRef } from "react";
import {
  Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
} from "@heroui/react";
import { ChevronDownIcon, PlusIcon, Download, Filter, AlertCircle } from "lucide-react";
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { motion } from "framer-motion";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import SearchIcon from '../../assets/svg/Search.svg';
import { MdOutlineTableRows } from "react-icons/md";
import TableSkeleton from "../tableSkeleton/skeleton";
import { HiAdjustmentsVertical } from "react-icons/hi2";
import { Tooltip } from "@mui/material";

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
    SearchValue,
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
  const calculateMinTableWidth = () => {
    let totalWidth = 0;
    columns.forEach((col, index) => {
      if (col.custom_width) {
        const widthMatch = col.custom_width.match(/w-\[([^\]]+)\]/);
        if (widthMatch && widthMatch[1]) {
          const width = widthMatch[1];
          // Convert to pixels for calculation (rough estimation)
          // Assuming 1rem = 16px
          if (width.includes('rem')) {
            totalWidth += parseFloat(width) * 16;
          } else if (width.includes('px')) {
            totalWidth += parseFloat(width);
          } else {
            // Default width if unrecognized format
            totalWidth += 150;
          }
        } else {
          totalWidth += 150; // Default width
        }
      } else if (col.width) {
        // Fallback to the width property if it exists
        const widthValue = parseInt(col.width.replace(/[^0-9]/g, ''));
        totalWidth += widthValue;
      } else {
        // Default column width
        totalWidth += 150;
      }
    });

    return totalWidth;
  };

  useEffect(() => {
    const updateWidth = () => {
      if (tableContainerRef.current) {
        const containerWidth = tableContainerRef.current.offsetWidth;
        const minTableWidth = calculateMinTableWidth();
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

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      default:
        return <div className="flex items-center justify-center mx-0 px-0">{cellValue}</div>;
    }
  }, []);

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

  const extractTextFromReactElement = (element) => {
    if (!element) return '';
    if (typeof element === 'string' || typeof element === 'number') {
      return String(element);
    }
    if (React.isValidElement(element)) {
      return extractTextFromReactElement(element.props?.children);
    }
    if (Array.isArray(element)) {
      return element.map(extractTextFromReactElement).join(' ');
    }
    if (element && typeof element === 'object' && element.props?.children) {
      return extractTextFromReactElement(element.props.children);
    }
    return String(element || '');
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-2 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
          {Title !== '' && (
            <div className="flex items-center font-medium text-md">{Title}</div>
          )}
          <div className={`${Title !== '' ? 'gap-2 justify-end' : 'gap-3 justify-between w-full'} flex flex-col sm:flex-row items-start  sm:items-center`}>
            {isSearch && (
              <Input
                isClearable
                className={`${Title !== '' ? '' : 'sm:max-w-[26%]'} w-full font-medium ${CustomSearchWidth}`}
                placeholder={SearchPlaceholder}
                startContent={<img src={SearchIcon} className="w-5" />}
                endContent={''}
                value={SearchValue}
                onClear={onClear}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchItem(e.target.value);
                  }
                }}
                classNames={{
                  inputWrapper: 'border-1 bg-white border-gray-300 font-medium shadow-sm hover:border-gray-400 focus-within:border-blue-500',
                  input: "placeholder:text-[12px] text-[12px] font-poppins"

                }}
              />
            )}
            {!onlySearch && (
              <div className="flex flex-wrap gap-2 items-center">
                {isStatusDropdown && (
                  <div>{statusComponent}</div>
                )}

                {isCategoryDropdown && <div>{dropDowncomponent}</div>}

                {isWeekDropDown && (
                  <Dropdown>
                    <DropdownTrigger className="hidden sm:flex">
                      <Button
                        endContent={<ChevronDownIcon className="text-small" />}
                        variant="flat"
                        className="font-medium border border-gray-300 bg-gray-50 hover:bg-gray-100"
                      >
                        Week
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Table Columns"
                      closeOnSelect={false}
                      selectedKeys={statusFilter}
                      selectionMode="multiple"
                      onSelectionChange={setStatusFilter}
                    >
                      {WeekOptions.map((week) => (
                        <DropdownItem key={week.uid} className="capitalize">
                          {week.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                )}

                {isDateRange && (
                  <div>{dateRangeComponent}</div>
                )}

                {isFilter && (
                  <button
                    variant='bordered'
                    className='flex items-center justify-center border h-9 w-9 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors'
                  >
                    <Filter className="h-4" />
                  </button>
                )}

                <div className="flex gap-2">
                  {isDownload && (
                    <Tooltip
                      title={
                        <span className="text-[12px] font-poppins font-medium py-4">Download</span>
                      }
                      placement="top"
                      color=""
                      arrow
                    >
                      <button
                        variant='bordered'
                        className='flex items-center ml-1 justify-center border h-9 w-9 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors'
                        onClick={downloadExcelSheet}
                      >
                        <Download className="h-4" />
                      </button>
                    </Tooltip>
                  )}
                  {isMetricsShow && (

                    <Tooltip
                      title={
                        <span className="text-[12px] font-poppins font-medium py-4">Expand View</span>
                      }
                      placement="top"
                      color=""
                      arrow
                    >
                      <button
                        variant="bordered"
                        size="icon"
                        onClick={handleMetrics}
                        className='flex items-center justify-center border h-9 w-9 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors'
                      >
                        <MdOutlineTableRows className="text-xl rotate-90" />
                      </button>
                    </Tooltip>
                  )}
                  {isPopupShow && (
                    <button
                      variant="bordered"
                      size="icon"
                      onClick={handlePopup}
                      className='flex items-center justify-center border h-9 w-9 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors'
                    >
                      <HiAdjustmentsVertical className="text-xl rotate-90" />
                    </button>
                  )}
                </div>

                {ToggleShow && (
                  <div>
                    {TabComponent}
                  </div>
                )}

                {AddButton && (
                  <Button color="primary" endContent={<PlusIcon />} className="shadow-sm hover:shadow-md transition-shadow">
                    Add New
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    isSearch,
    isStatusDropdown,
    isColumnsDropdown,
    AddButton,
    isPagination,
    onClear,
    onSearchChange,
    StatusOptions,
    DateState,
    setDate,
    monthsRange,
    isDateRange,
    isDownload,
    isMetricsShow,
    Title,
    SearchValue,
    SearchPlaceholder,
    dropDowncomponent,
    TabComponent
  ]);

  // Calculate column positions for fixed columns
  const getColumnPositions = () => {
    const positions = [];
    let currentPosition = 0;

    for (let i = 0; i < FixColumnCount; i++) {
      if (i >= columns.length) break;

      const column = columns[i];
      let columnWidth = 150; // Default width

      // Parse width from custom_width if available
      if (column.custom_width) {
        const widthMatch = column.custom_width.match(/w-\[([^\]]+)\]/);
        if (widthMatch && widthMatch[1]) {
          const width = widthMatch[1];
          if (width.includes('rem')) {
            columnWidth = parseFloat(width) * 16;
          } else if (width.includes('px')) {
            columnWidth = parseFloat(width);
          }
        }
      } else if (column.width) {
        // Fallback to width property
        columnWidth = parseInt(column.width.replace(/[^0-9]/g, ''));
      } else if (i === 0 && FirstColumnWidth) {
        // Use FirstColumnWidth for first column if available
        const widthMatch = FirstColumnWidth.match(/w-\[([^\]]+)\]/);
        if (widthMatch && widthMatch[1]) {
          const width = widthMatch[1];
          if (width.includes('rem')) {
            columnWidth = parseFloat(width) * 16;
          } else if (width.includes('px')) {
            columnWidth = parseFloat(width);
          }
        }
      } else if (i === 1 && SecondColumnWidth) {
        // Use SecondColumnWidth for second column if available
        const widthMatch = SecondColumnWidth.match(/w-\[([^\]]+)\]/);
        if (widthMatch && widthMatch[1]) {
          const width = widthMatch[1];
          if (width.includes('rem')) {
            columnWidth = parseFloat(width) * 16;
          } else if (width.includes('px')) {
            columnWidth = parseFloat(width);
          }
        }
      }

      positions.push({
        start: currentPosition,
        width: columnWidth
      });

      currentPosition += columnWidth;
    }

    return positions;
  };

  const columnPositions = getColumnPositions();

  // Enhanced sticky column class generator that handles FixColumnCount
  const getStickyColumnClass = (columnIndex) => {
    if (!columns[columnIndex]) return "";

    const isLast = columnIndex === columns.length - 1;
    const column = columns[columnIndex];

    // Handle column width - prioritize custom_width over other properties
    let widthClass = "";
    if (column.custom_width) {
      // Use custom_width directly as a Tailwind class
      widthClass = `${column.custom_width} `;
    } else if (column.width) {
      // Fallback to width property
      widthClass = `min-w-[${column.width}] w-[${column.width}] `;
    } else if (columnIndex === 0 && FirstColumnWidth) {
      // Use FirstColumnWidth for first column if available
      widthClass = `${FirstColumnWidth} `;
    } else if (columnIndex === 1 && SecondColumnWidth) {
      // Use SecondColumnWidth for second column if available
      widthClass = `${SecondColumnWidth} `;
    } else {
      // Default width class if nothing else is specified
      widthClass = "min-w-[150px] ";
    }

    // Add sticky classes for fixed columns based on FixColumnCount
    let stickyClass = "";
    if (columnIndex < FixColumnCount) {
      stickyClass = "sticky z-30";
    } else if (isLast && isLastColumnFixed) {
      stickyClass = "sticky right-0 z-20 shadow-sm border-l border-gray-200";
    }

    return `${widthClass} ${stickyClass}`.trim();
  };

  // Enhanced cell styling for sticky columns with FixColumnCount support
  const getCellStyle = (columnIndex, isHeader = false) => {
    if (!columns[columnIndex]) return {};

    const isLast = columnIndex === columns.length - 1;
    const column = columns[columnIndex];

    let style = {};

    // Add width to style if present in custom_width (for non-tailwind contexts)
    if (column.custom_width) {
      const widthMatch = column.custom_width.match(/w-\[([^\]]+)\]/);
      if (widthMatch && widthMatch[1]) {
        // Extract width value (e.g., '25rem')
        const width = widthMatch[1];
        // Add width to style - CSS will handle the unit conversion
        style.width = width;
      }
    }

    // Add sticky position for fixed columns based on FixColumnCount
    if (columnIndex < FixColumnCount) {
      const position = columnPositions[columnIndex];

      style = {
        ...style,
        position: 'sticky',
        left: position ? `${position.start}px` : `${columnIndex * 150}px`,
        zIndex: isHeader ? 1 : 1,
        // backgroundColor: isHeader ? '#f9fafb' : 'white',
      };

      // Add right border only to the last fixed column
      // if (columnIndex === FixColumnCount - 1) {
      style.borderRight = '1px solid #e5e7eb'; // gray-200 equivalent
      style.boxShadow = '4px 0 6px -4px rgba(0, 0, 0, 0.1)';
      // }
    }

    // Add sticky position for last column
    if (isLast && isLastColumnFixed) {
      style = {
        ...style,
        position: 'sticky',
        right: 0,
        zIndex: isHeader ? 30 : 10,
        backgroundColor: isHeader ? '#f9fafb' : 'white',
      };
    }

    return style;
  };

  const renderSummaryCell = (columnKey, summaryData) => {
    if (!summaryData) return <div className="flex items-center justify-center mx-0 px-0">-</div>;

    if (columnKey === "product_name" || columnKey === "city_name" || columnKey === "DATE") {
      return <div className="flex items-center justify-center mx-0 px-0 font-medium text-gray-600">Summary</div>;
    }

    if (summaryData.hasOwnProperty(columnKey)) {
      if (summaryData[columnKey] === null) {
        return <div className="flex items-center justify-center mx-0 px-0">-</div>;
      }

      // Format based on column type
      if (columnKey === "TOTAL REVENUE") {
        return <div className="flex items-center justify-center mx-0 px-0">₹{Number(Number(summaryData[columnKey]).toFixed(0)).toLocaleString("en-IN")}</div>;
      }
      if (columnKey === "TOTAL STOCK") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(Number(summaryData['AVG TOTAL STOCK']).toFixed(0)).toLocaleString("en-IN")} pcs</div>;
      }
      if (columnKey === "AD SPENDS") {
        return <div className="flex items-center justify-center mx-0 px-0">₹{Number(Number(summaryData[columnKey]).toFixed(0)).toLocaleString("en-IN")}</div>;
      }
      if (columnKey === "TOTAL ROAS") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData['TOTAL ROAS']).toFixed(2)}x</div>;
      }
      if (columnKey === "TOTAL ORDER QTY") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toLocaleString("en-IN")} pcs</div>;
      }
      if (columnKey === "SELLING PRICE") {
        return <div className="flex items-center justify-center mx-0 px-0">₹{Number(Number(summaryData['SELLING PRICE']).toFixed(0)).toLocaleString("en-IN")}</div>;
      }
      if (columnKey === "MRP") {
        return <div className="flex items-center justify-center mx-0 px-0">₹{Number(Number(summaryData['MRP']).toFixed(0)).toLocaleString("en-IN")}</div>;
      }
      if (columnKey === "DISCOUNT %") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(2)}%</div>;
      }
      if (columnKey === "AOV") {
        return <div className="flex items-center justify-center mx-0 px-0">₹{Number(summaryData[columnKey]).toFixed(0)}</div>;
      }
      if (columnKey === "STOCK AT DARKSTORE") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(Number(summaryData['AVG STOCK AT DARKSTORE']).toFixed(0)).toLocaleString("en-IN")} pcs</div>;
      }
      if (columnKey === "STOCK AT WAREHOUSE") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(Number(summaryData['AVG STOCK AT WAREHOUSE']).toFixed(0)).toLocaleString("en-IN")} pcs</div>;
      }
      if (columnKey === "CVR %") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(2)}%</div>;
      }
      if (columnKey === "AD ORDER QTY") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(Number(summaryData[columnKey]).toFixed(0)).toLocaleString("en-IN")}</div>;
      }
      if (columnKey === "AD REVENUE") {
        return <div className="flex items-center justify-center mx-0 px-0">₹{Number(Number(summaryData[columnKey]).toFixed(0)).toLocaleString("en-IN")}</div>;
      }
      if (columnKey === "AD ROAS") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(2)}</div>;
      }
      if (columnKey === "AD IMPRESSIONS") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(Number(summaryData[columnKey]).toFixed(0)).toLocaleString("en-IN")}</div>;
      }
      if (columnKey === "CPM") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData['AVG CPM']).toFixed(2)}</div>;
      }
      if (columnKey === "AD CLICKS") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(2)}</div>;
      }
      if (columnKey === "CTR %") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(2)}%</div>;
      }
      if (columnKey === "AD CART") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(0)} pcs</div>;
      }
      if (columnKey === "ATC %") {
        return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(2)}%</div>;
      }

      return <div className="flex items-center justify-center mx-0 px-0">{Number(summaryData[columnKey]).toFixed(2)}</div>;
    }

    return <div className="flex items-center justify-center mx-0 px-0">-</div>;
  };


  return (
    <div className={`flex flex-col bg-white rounded-lg  border-1 h-full border-gray-300 ${OverallHeight}`} ref={tableContainerRef}>
      {/* Fixed Header Section */}
      <div className={`sticky flex flex-col rounded-lg items-between justify-center z-40 px-2 border-b border-gray-100 bg-white ${headerPadding}`}>
        {topContent}
      </div>

      {!Loading ? (
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
                              className={`${getStickyColumnClass(index)} ${tableColumnHeaderClass} text-xs font-semibold text-gray-800 border-b border-gray-300 text-center`}
                              style={{
                                ...getCellStyle(index, true),
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

                                {showSortIcon && column.sortable && (
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
                                )}


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
                              className={`${getStickyColumnClass(index)} py-[0.4rem] px-4 text-[12px] font-medium text-gray-700 border-b border-gray-300 bg-gray-50 ${column.value === 'Summary' ? 'bg-[red] hidden' : ''}`}
                              style={getCellStyle(index)}
                            >
                              {renderSummaryCell(column.value, summaryData)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    )}

                    {/* Table Body - now directly follows the header in the same scrollable container */}
                    <tbody>
                      {currentItems.map((item, i) => (
                        <tr
                          key={item.id || `item-${i}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {columns.map((column, columnIndex) => (
                            <td
                              key={`${item.id || i}-${column.value}`}
                              className={`${getStickyColumnClass(columnIndex)} cursor-pointe py-2 px-4 text-xs border-b  border-gray-200 text-gray-700`}
                              style={{
                                ...getCellStyle(columnIndex),
                                backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa', // Zebra striping
                              }}
                            >
                              {renderCell(item, column.value)}
                            </td>
                          ))}
                        </tr>
                      ))}
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
      ) : (
        <div className={`${customeHeightWidth}`}>
          <TableSkeleton />
        </div>
      )}

      {/* Fixed Footer with Pagination */}
      {isPagination && data.length > 0 && (
        <div className="sticky bottom-0 py-[0.3rem] px-4 bg-gray-50 border-t border-gray-300 rounded-b-lg z-30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-gray-600 order-2 sm:order-1">
              {`${validTotalRecords > 0 ? `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, validTotalRecords)} of ${validTotalRecords} entries` : 'No entries'}`}
            </span>

            <div className="flex items-center justify-center order-1 sm:order-2 w-full sm:w-auto">
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="light"
                  isDisabled={currentPage === 1}
                  onPress={() => onPageChange(1)}
                  className="text-blue-600 font-medium text-xs px-2 hover:bg-blue-50"
                >
                  First
                </Button>

                <Button
                  size="sm"
                  variant="light"
                  isDisabled={currentPage === 1}
                  onPress={() => onPageChange(currentPage - 1)}
                  className="text-blue-600 font-medium text-xs px-2 hover:bg-blue-50"
                >
                  Prev
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                    let pageToShow;
                    if (pages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= pages - 2) {
                      pageToShow = pages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageToShow}
                        size="sm"
                        variant={currentPage === pageToShow ? "solid" : "light"}
                        className={`min-w-[28px] h-7 ${currentPage === pageToShow
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-600 hover:bg-blue-50 font-medium"
                          }`}
                        onPress={() => onPageChange(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="light"
                  isDisabled={currentPage === pages}
                  onPress={() => onPageChange(currentPage + 1)}
                  className="text-blue-600 font-medium text-xs px-2 hover:bg-blue-50"
                >
                  Next
                </Button>

                <Button
                  size="sm"
                  variant="light"
                  isDisabled={currentPage === pages}
                  onPress={() => onPageChange(pages)}
                  className="text-blue-600 font-medium text-xs px-2 hover:bg-blue-50"
                >
                  Last
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 order-3">
              <span className="text-xs text-gray-500 font-medium">Rows per page:</span>
              <select
                className="bg-white outline-none border border-gray-300 rounded cursor-pointer px-2 py-1 text-xs text-gray-600 font-medium"
                value={pageSize}
                onChange={(e) => {
                  const newPageSize = Number(e.target.value);
                  onPageSizeChange?.(newPageSize);
                  onPageChange?.(1);
                }}
              >
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}