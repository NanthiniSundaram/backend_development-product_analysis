// TableHeader.jsx - Updated with toggle button
import React from "react";
import { Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from "@heroui/react";
import { ChevronDownIcon, PlusIcon, Download, Filter, AlertCircle, Layers } from "lucide-react";
import { Tooltip } from "@mui/material";
import { MdOutlineTableRows } from "react-icons/md";
import { HiAdjustmentsVertical } from "react-icons/hi2";
import SearchIcon from '../../assets/svg/Search.svg';

const TableHeader = ({
  Title = '',
  isSearch = true,
  // SearchValue = '',
  SearchPlaceholder = 'Search a Product',
  onChange,
  onClear,
  searchItem,
  isStatusDropdown = true,
  statusComponent,
  isCategoryDropdown = true,
  dropDowncomponent,
  isWeekDropDown = false,
  WeekOptions = [],
  statusFilter,
  setStatusFilter,
  isDateRange = false,
  dateRangeComponent = 'Date Range',
  isFilter = false,
  isDownload = false,
  downloadExcelSheet,
  isMetricsShow = false,
  handleMetrics,
  isPopupShow = false,
  handlePopup,
  ToggleShow = false,
  TabComponent,
  AddButton = true,
  CustomSearchWidth = '',
  onlySearch = false,
  // New props for nested table functionality
  isNestedTable = false,
  showAllNested = false,
  toggleAllNested = null,
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
        {Title !== '' && (
          <div className="flex items-center font-medium text-md">{Title}</div>
        )}
        <div className={`${Title !== '' ? 'gap-2 justify-end' : 'gap-3 justify-between w-full'} flex flex-col sm:flex-row items-start sm:items-center`}>
          {isSearch && (
            <Input
              isClearable
              className={`${Title !== '' ? '' : 'sm:max-w-[26%]'} w-full font-medium ${CustomSearchWidth}`}
              placeholder={SearchPlaceholder}
              startContent={<img src={SearchIcon} className="w-5" />}
              endContent={''}
              // value={SearchValue} 
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
              {/* Nested data toggle button */}
              {isNestedTable && (
                <Tooltip
                  title={
                    <span className="text-[12px] font-poppins font-medium py-4">
                      {showAllNested ? "Hide All Cities" : "Show All Cities"}
                    </span>
                  }
                  placement="top"
                  color=""
                  arrow
                >
                  <button
                    variant="bordered"
                    size="icon"
                    onClick={toggleAllNested}
                    className={`flex items-center justify-center border h-9 px-4 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors ${showAllNested ? 'bg-blue-50 border-blue-300' : ''}`}
                  >
                    <Layers className="h-4 mr-2" />
                    <span className="text-xs font-medium">
                      {showAllNested ? "Hide All Cities" : "Show All Cities"}
                    </span>
                  </button>
                </Tooltip>
              )}

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
};

export default TableHeader;