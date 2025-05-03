import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from "lucide-react";
import { Checkbox } from '@heroui/react';
import { Button } from '@heroui/button';

const Dropdown = ({
  setSelectedCategories,
  CategoryOptions,
  selectedCategories,
  SelectedDatas = () => { },
  customCategoryClass,
  itemName = 'Category',
  titleSet = false,
  showCount = false,
  position = 'right-0',
  isOpen,
  setIsOpen,
  closeOnApply = true,
  paddings = 'px-4 py-2',
  isSingleSelect = false,
  bgPrimary = '',
  metrics,
  selectedData,
  maxSelections, // Limit selections
}) => {
  const dropdownRef = useRef(null);
  const [localSelectedCategories, setLocalSelectedCategories] = useState([]);

  useEffect(() => {
    setLocalSelectedCategories(selectedCategories || []);
  }, [selectedCategories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectionChange = (selectedUid) => {
    if (isSingleSelect) {
      const newSelection = [selectedUid];
      setLocalSelectedCategories(newSelection);
      setSelectedCategories(newSelection);
      SelectedDatas(newSelection);
      setIsOpen(null);
    } else {
      setLocalSelectedCategories((prevSelected) => {
        // If already selected, remove it
        if (prevSelected.includes(selectedUid)) {
          return prevSelected.filter((uid) => uid !== selectedUid);
        } 
        // If not selected but at max limit, don't add
        else if (maxSelections && prevSelected.length >= maxSelections) {
          return prevSelected; // Don't change selections
        } 
        // Otherwise add the selection
        else {
          return [...prevSelected, selectedUid];
        }
      });
    }
  };
  
  const selectAll = () => {
    if (maxSelections) {
      // Only select up to maxSelections
      setLocalSelectedCategories(CategoryOptions.slice(0, maxSelections).map(category => category.uid));
    } else {
      setLocalSelectedCategories(CategoryOptions.map(category => category.uid));
    }
  };

  const unselectAll = () => {
    setLocalSelectedCategories([]);
  };

  const applySelection = () => {
    setSelectedCategories(localSelectedCategories);
    SelectedDatas(localSelectedCategories);
    if (closeOnApply) {
      setIsOpen(null);
    }
  };

  const getSelectedCategoryName = () => {
    if (localSelectedCategories.length === 0) return itemName;

    const selectedCategory = CategoryOptions.find(
      cat => cat.uid === localSelectedCategories[0]
    );

    return selectedCategory
      ? (titleSet ? selectedCategory.title : selectedCategory.name)
      : itemName;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        className={`h-[2.2rem] w-full font-medium border rounded-lg border-gray-300 bg-gray-700 text-white ${paddings} flex items-center justify-between ${bgPrimary} ${metrics ? 'text-[13px] px-4' : 'text-xs sm:text-[13px] px-2 sm:px-3'}`}
        onClick={() => setIsOpen(isOpen ? null : itemName)}
        type="button"
      >
        <span className="truncate">
          {isSingleSelect ? (
            getSelectedCategoryName()
          ) : showCount ? (
            localSelectedCategories.length > 0
              ? `${itemName}`
              : itemName
          ) : (
            itemName
          )}
        </span>
        <span className="ml-1 flex-shrink-0">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </Button>

      {isOpen && (
        <div className={`z-50 mt-2 absolute p-2 ${position} bg-white border rounded-lg shadow-lg`}>
          {maxSelections && (
            <div className="px-2 py-1 text-[12px] text-gray-500 border-b mb-1 flex gap-1">
              <p>Select up to 2 items</p>
              <p className='text-red-600 font-bold'>*</p>
            </div>
          )}
          <div className={`${customCategoryClass} h-full overflow-y-auto overflow-x-hidden`}>
            {CategoryOptions.map((category) => {
              const isSelected = localSelectedCategories.includes(category.uid);
              const isDisabled = !isSelected && maxSelections && localSelectedCategories.length >= maxSelections;
              
              return (
                <div
                  key={category.uid}
                  className={`flex justify-between items-center px-2 py-1 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'} rounded`}
                  onClick={() => !isDisabled && handleSelectionChange(category.uid)}
                >
                  <label className={`flex items-center gap-2 w-full ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    {isSingleSelect ? (
                      // Radio button style for single select
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    ) : (
                      // Checkbox for multi-select
                      <Checkbox
                        id={`category-${category.uid}`}
                        isSelected={isSelected}
                        onChange={() => !isDisabled && handleSelectionChange(category.uid)}
                        disabled={isDisabled}
                      />
                    )}
                    <span className='text-sm font-medium'>
                      {titleSet ? category.title : category.name}
                    </span>
                  </label>
                </div>
              );
            })}

            {!isSingleSelect && (
              <div className="pt-2 mt-2 flex justify-between gap-2">
                <Button 
                  className="text-xs font-medium h-[2rem] text-gray-600 hover:bg-gray-100 border-none rounded-md"
                      variant='none'
                  onClick={selectAll} 
                  type="button"
                >
                  Select All
                </Button>
                <Button 
                  className="text-xs font-medium h-[2rem] text-gray-600 hover:bg-gray-100 border-none rounded-md"
                  variant='none' 
                  onClick={unselectAll} 
                  type="button"
                >
                  Clear
                </Button>
                <Button
                  className="text-xs font-medium h-[2rem] text-white bg-blue-600 border rounded-md"
                  onClick={applySelection}
                  type="button"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;