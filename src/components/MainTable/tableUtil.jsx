import React from 'react';

export const getStickyColumnClass = (columnIndex, columns, isLastColumnFixed, FirstColumnWidth, SecondColumnWidth, FixColumnCount = 1) => {
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
    stickyClass = "sticky z-30 bg-white";
  } else if (isLast && isLastColumnFixed) {
    stickyClass = "sticky right-0 z-20 shadow-sm border-l border-gray-200";
  }

  return `${widthClass} ${stickyClass}`.trim();
};

export const getCellStyle = (columnIndex, columns, isLastColumnFixed, columnPositions, FixColumnCount = 1, isHeader = false) => {
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

    // Add right border to fixed columns
    style.borderRight = '1px solid #e5e7eb'; // gray-200 equivalent
    style.boxShadow = '4px 0 6px -4px rgba(0, 0, 0, 0.1)';
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

export const renderSummaryCell = (columnKey, summaryData) => {
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

// Helper function to calculate column positions
export const getColumnPositions = (columns, FirstColumnWidth, SecondColumnWidth, FixColumnCount = 1) => {
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

// Helper function to calculate minimum table width
export const calculateMinTableWidth = (columns) => {
  let totalWidth = 0;
  columns.forEach((col) => {
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