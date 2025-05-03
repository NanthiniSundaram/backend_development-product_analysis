import React from 'react';
import { Tooltip } from '@mui/material';

// PlatformItem component that handles individual platform buttons
const PlatformItem = ({
    platform,
    isSelected,
    onSelect
}) => {
    // Get first letter of platform for the button display
    const letter = platform.charAt(0);

    // Determine color based on platform name
    let color = "gray";
    if (platform === "Zepto") color = "purple";
    else if (platform === "Blinkit") color = "yellow";
    else if (platform === "Swiggy") color = "orange";

    // Generate gradient colors based on the determined color
    let gradientColors = "";
    let gradientTexts = "";
    switch (color) {
        case "purple":
            gradientColors = "bg-gradient-to-br from-purple-500 via-purple-700 to-purple-900 ";
            gradientTexts = "flex items-center justify-center bg-gradient-to-r from-pink-300 via-pink-500 to-pink-400 bg-clip-text text-transparent font-bold italic";
            break;
        case "yellow":
            gradientColors = "bg-gradient-to-br from-yellow-300 to-yellow-500";
            gradientTexts = "flex items-center justify-center text-green-700 ";
            break;
        case "orange":
            gradientColors = "bg-gradient-to-br from-orange-400 to-orange-700";
            gradientTexts = "flex items-center justify-center text-white";
            break;
        default:
            gradientColors = "bg-gray-500";
            gradientTexts = "flex items-center justify-center text-white";
    }

    return (
        <div className="">
            <Tooltip
                title={<span className="text-[12px] font-poppins font-medium py-4">{platform}</span>}
                placement="top"
                arrow
            >
                <button
                    className={`${gradientColors} px-4 h-[2.2rem] rounded-lg flex items-center justify-center text-white font-medium text-md shadow-md ${isSelected ? "border-1 border-white ring-2 ring-white" : ""
                        }`}
                    onClick={() => onSelect(platform)}
                >
                    <span className={`${gradientTexts} `}>{platform != 'Blinkit' ? platform : <div>
                        <span className="text-black font-bold">Blink</span>
                        <span className="text-[#1e8e56] font-bold">it</span></div>}</span>
                </button>
            </Tooltip>
        </div>
    );
};

// Main PlatformSelector component that takes props from parent
const PlatformSelector = ({
    setSelect,
    selectedPlatform,
    platforms = ['Blinkit', 'Zepto', 'Swiggy']
}) => {
    return (
        <div className="h-full flex items-center justify-center rounded-lg">
            <div className="flex items-center justify-center gap-[0.7rem]">
                {platforms.map((platform) => (
                    <PlatformItem
                        key={platform}
                        platform={platform}
                        isSelected={selectedPlatform === platform}
                        onSelect={setSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default PlatformSelector;