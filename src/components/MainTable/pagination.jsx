// TablePagination.jsx
import React from "react";
import { Button } from "@heroui/react";

const TablePagination = ({
  currentPage = 1,
  pageSize = 20,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange
}) => {
  const validTotalRecords = totalRecords || 0;
  const pages = Math.max(1, Math.ceil(validTotalRecords / pageSize));

  return (
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
  );
};

export default TablePagination;