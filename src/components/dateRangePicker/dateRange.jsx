import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import format from "date-fns/format";
import { enGB } from "date-fns/locale";
import { addDays, subDays, differenceInDays, isSameMonth, subMonths, isAfter, isBefore, isEqual, isSameDay } from "date-fns";
import { Button } from "@heroui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import './date.css';
import { Tooltip } from "@mui/material";

const predefinedRanges = {
  "Today": [new Date(), new Date()],
  "Yesterday": [subDays(new Date(), 1), subDays(new Date(), 1)],
  "Last 7 days": [subDays(new Date(), 6), new Date()],
  "Last 30 days": [subDays(new Date(), 29), new Date()],
  "Last 90 days": [subDays(new Date(), 89), new Date()],
  "Last 365 days": [subDays(new Date(), 364), new Date()],
  "All time": [new Date(2000, 0, 1), new Date()],
};

const DateRangePicker = ({
  DateState,
  setDate,
  applyDate,
  showSelectionPreview = true,
  moveRangeOnFirstSelection = false,
  months = 2,
  direction = "horizontal",
  preventSnapRefocus = true,
  calendarFocus = "backwards",
  freezeOnlySevenDays = false,
}) => {
  const [open, setOpen] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Custom");

  // Set the current date for default focus
  const currentDate = new Date();
  // Reset hours to start of day for proper comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Yesterday as the last selectable date (end of yesterday)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);

  // Initialize local state from props or with yesterday
  const [localRange, setLocalRange] = useState(DateState || [
    {
      startDate: yesterday,
      endDate: yesterday,
      key: "selection",
    },
  ]);

  // Update local state when props change
  useEffect(() => {
    if (DateState) {
      setLocalRange(DateState);
    }
  }, [DateState]);

  const handleFilterClick = (filter) => {
    if (predefinedRanges[filter]) {
      const [startDate, endDate] = predefinedRanges[filter];

      // For "Today", use yesterday instead since today is now unselectable
      let adjustedStartDate = startDate;
      let adjustedEndDate = endDate;
      
      // If the filter includes today, replace it with yesterday
      if (isSameDay(endDate, new Date())) {
        adjustedEndDate = yesterday;
      }
      if (isSameDay(startDate, new Date())) {
        adjustedStartDate = yesterday;
      }

      // Enforce 7-day limit if freezeOnlySevenDays is true
      if (freezeOnlySevenDays && differenceInDays(adjustedEndDate, adjustedStartDate) > 6) {
        // If the range is more than 7 days and freezeOnlySevenDays is true,
        // adjust to exactly 7 days for predefined ranges
        if (filter === "Last 30 days" || filter === "Last 90 days" ||
          filter === "Last 365 days" || filter === "All time") {
          adjustedEndDate = addDays(adjustedStartDate, 6);
        }
      }

      const newRange = [{
        startDate: adjustedStartDate,
        endDate: adjustedEndDate,
        key: "selection"
      }];

      setLocalRange(newRange);
      setDate(newRange); // Update parent state
    }
    setSelectedFilter(filter);
    if (filter === "Custom") {
      // setOpen(!open)
    }
  };

  const handleReset = () => {
    // Reset to yesterday instead of current date
    const resetRange = [{
      startDate: yesterday,
      endDate: yesterday,
      key: "selection"
    }];
    setLocalRange(resetRange);
    setDate(resetRange); // Update parent state
  };

  const handleDateChange = (item) => {
    const { startDate, endDate } = item.selection;

    // Don't allow selection of today or future dates
    if (isAfter(endDate, yesterday) || isSameDay(endDate, today)) {
      // If end date is after yesterday, set it to yesterday
      const adjustedRange = [{
        ...item.selection,
        endDate: yesterday
      }];
      
      setLocalRange(adjustedRange);
      setDate(adjustedRange);
      return;
    }

    // If freezeOnlySevenDays is true, enforce a maximum of 7 days selection
    if (freezeOnlySevenDays && startDate && endDate) {
      const dayDifference = differenceInDays(endDate, startDate);

      if (dayDifference > 6) {
        // Adjust the end date to be exactly 7 days from the start date
        const adjustedEndDate = addDays(startDate, 6);
        const adjustedRange = [{
          ...item.selection,
          endDate: adjustedEndDate
        }];

        setLocalRange(adjustedRange);
        setDate(adjustedRange);
        return;
      }
    }

    // For normal case (no adjustment needed)
    setLocalRange([item.selection]);
    setDate([item.selection]);
  };

  const handleApplyDate = () => {
    // Make sure dates are normalized to start/end of day to avoid time inconsistencies
    const normalizedRange = [{
      ...localRange[0],
      startDate: new Date(localRange[0].startDate.setHours(0, 0, 0, 0)),
      endDate: new Date(localRange[0].endDate.setHours(23, 59, 59, 999))
    }];

    setLocalRange(normalizedRange);
    setDate(normalizedRange);

    if (typeof applyDate === 'function') {
      applyDate();
    }
    setOpen(false);
  };

  // Custom day renderer to handle disabled current/future dates and styling selected dates
  const customDayContent = (day) => {
    const isOutsideMonth = !isSameMonth(day, new Date(day.getFullYear(), day.getMonth(), 1));
    const isFutureDate = isAfter(day, yesterday) || isSameDay(day, today);
    
    // Check if day is in selected range
    const isSelected = localRange[0] && (
      (isAfter(day, localRange[0].startDate) && isBefore(day, localRange[0].endDate)) ||
      isSameDay(day, localRange[0].startDate) || 
      isSameDay(day, localRange[0].endDate)
    );
    
    if (isOutsideMonth) {
      return <div className="opacity-30">{format(day, "d")}</div>;
    }
    
    if (isFutureDate) {
      return <div className="text-gray-300 blur-[0.5px] cursor-not-allowed">{format(day, "d")}</div>;
    }
    
    if (isSelected) {
      return <div className="text-white font-light">{format(day, "d")}</div>;
    }
    
    return format(day, "d");
  };

  // Function to disable today and future dates
  const disabledDay = (date) => {
    return isAfter(date, yesterday) || isSameDay(date, today);
  };

  // Add custom CSS for selected day styling
  useEffect(() => {
    // Add a custom CSS for selected days
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .rdrDateRangePickerWrapper .rdrDay.rdrInRange .rdrDayNumber span,
      .rdrDateRangePickerWrapper .rdrDay.rdrStartEdge .rdrDayNumber span,
      .rdrDateRangePickerWrapper .rdrDay.rdrEndEdge .rdrDayNumber span {
        color: white !important;
        font-weight: 300 !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Display message for 7-day limit
  const sevenDayLimitMessage = freezeOnlySevenDays ? (
    <div className="text-xs text-red-500">
      Select 7 days only
    </div>
  ) : null;

  return (
    <div className="font-poppins w-full max-w-4xl flex flex-col items-center md:flex-row gap-4 bg-white text-black">
      {/* Left sidebar with predefined ranges */}
      <div className="w-48 space-y-1">
        {Object.keys(predefinedRanges).concat("Custom").map((item) => (
          <Button
            variant="light"
            key={item}
            onClick={() => handleFilterClick(item)}
            className={`w-full py-2 rounded ${selectedFilter === item ? "bg-slate-600 text-white" : "hover:bg-gray-100"}`}
          >
            {item}
          </Button>
        ))}
      </div>

      {/* Calendar section */}
      <div className="flex-1 mt-2">
        {open && (
          <div className="bg-white rounded-lg">
            <DateRange
              onChange={handleDateChange}
              ranges={localRange}
              showSelectionPreview={showSelectionPreview}
              moveRangeOnFirstSelection={moveRangeOnFirstSelection}
              months={months}
              direction={direction}
              rangeColors={["#aaaaaa"]}
              showMonthAndYearPickers={false}
              locale={enGB}
              showDateDisplay={false}
              preventSnapRefocus={preventSnapRefocus}
              calendarFocus={calendarFocus}
              className="rounded-lg"
              date={currentDate}
              shownDate={currentDate}
              disabledDay={disabledDay}
              // Navigation components
              navigatorRenderer={(currentFocusedDate, changeShownDate) => (
                <div className="flex justify-between items-center px-4 py-1 pb-3">
                  <button
                    className="p-[0.3rem] rounded-full hover:bg-gray-200 bg-gray-100"
                    onClick={() => changeShownDate(subDays(currentFocusedDate, 30))}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="text-lg font-medium flex justify-between w-full">
                    <p className="w-[50%] flex items-center justify-center text-[14px]">
                      {format(subMonths(currentFocusedDate, 1), "MMMM yyyy")}
                    </p>
                    <p className="w-[50%] flex items-center justify-center text-[14px]">
                      {format(currentFocusedDate, "MMMM yyyy")}
                    </p>
                  </div>

                  <button
                    className="p-[0.3rem] rounded-full hover:bg-gray-200 bg-gray-100"
                    onClick={() => changeShownDate(addDays(currentFocusedDate, 30))}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
              // Handle rendering of days with proper styling
              dayContentRenderer={customDayContent}
            />
          </div>
        )}

        {/* Date display and action buttons */}
        <div className="flex flex-wrap gap-2 justify-between items-center -mt-3 pb-3">
          <div className="flex items-center">
            {/* Date display section if needed */}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center px-3 text-sm text-gray-700">
              {sevenDayLimitMessage && (
                <Tooltip
                  title={
                    <span className="text-[12px] font-poppins font-medium py-4">Last Seven Days</span>
                  }
                  placement="top"
                  color=""
                  arrow
                >
                  <div>
                    <Info className="w-4 h-4 text-red-500 mr-2 cursor-pointer" />
                  </div>
                </Tooltip>
              )}
              {sevenDayLimitMessage}
            </div>
            <Button
              variant="bordered"
              className="border border-gray-300 px-4 py-2 text-[13px] rounded-md"
              onClick={handleReset}
            >
              Reset Date
            </Button>
            <Button
              variant="solid"
              className="bg-slate-700 text-white px-4 py-2 text-[13px] rounded-md"
              onClick={handleApplyDate}
            >
              Apply Date
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;