import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Package,
  Boxes,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@mui/material";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSide, setSelectedSide] = useState('Products');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [open, setOpen] = useState(false);

  // Set selected menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;

    // Find the selected menu item based on the current path
    menuItems.forEach(section => {
      section.items.forEach(item => {
        if (item.path === currentPath) {
          setSelectedSide(item.name);
        }
        if (item.hasSubmenu) {
          item.submenu.forEach(subItem => {
            if (subItem.path === currentPath) {
              // Set submenu item as selected instead of parent menu
              setSelectedSide(subItem.name);
              setExpandedMenus(prev => ({ ...prev, [item.name.toLowerCase()]: true }));
            }
          });
        }
      });
    });
  }, [location.pathname]);

  const menuItems = [
    {
      // title: "MENU",
      items: [
        {
          name: "Product",
          icon: <Package size={18} />,
          path: "/home/product-analysis",
          hasSubmenu: false,
        },
        {
          name: "Stock Availability",
          icon: <Boxes size={18} />,
          path: "/home/stock-availability",
          hasSubmenu: false,
        },
      ],
    },
  ];

  const username = localStorage.getItem('name');
  const client_name = localStorage.getItem('client_name') || "Client";
  const client_id = localStorage.getItem('client_id') || "ID";

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSubmenu = (menuKey, event) => {
    if (event) event.stopPropagation();
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const handleMenuItemClick = (item) => {
    if (item.hasSubmenu) {
      toggleSubmenu(item.name.toLowerCase());
      // Don't change selectedSide when clicking on parent menu with submenu
      // Only expand/collapse the submenu
    } else {
      handleNavigation(item.path);
      setSelectedSide(item.name);
    }
  };

  // Modified to handle icon clicks differently based on sidebar state
  const handleItemIconClick = (item, e) => {
    e.stopPropagation(); // Prevent parent click handlers

    if (isOpen) {
      // In collapsed mode, expand the sidebar when clicking on icons
      SidebarView(); // Toggle sidebar to expand it

      // If item has submenu, expand it
      if (item.hasSubmenu) {
        setExpandedMenus(prev => ({
          ...prev,
          [item.name.toLowerCase()]: true
        }));
      } else {
        // For non-submenu items, navigate directly
        handleNavigation(item.path);
        setSelectedSide(item.name);
      }
    } else {
      // In expanded mode, handle normally like the full item click
      handleMenuItemClick(item);
    }
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "240px", transition: { duration: 0.3, ease: "easeInOut" } },
    collapsed: { width: "5rem", transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const itemVariants = {
    hover: { backgroundColor: "rgba(55, 65, 81, 0.8)", scale: 1.02, transition: { duration: 0.2 } },
    initial: { backgroundColor: "transparent", scale: 1, transition: { duration: 0.2 } }
  };

  const activeItemVariants = {
    active: { backgroundColor: "rgba(55, 65, 81, 0.9)", borderLeft: "3px solid #3b82f6", transition: { duration: 0.2 } },
    initial: { backgroundColor: "transparent", borderLeft: "3px solid transparent", transition: { duration: 0.2 } }
  };

  const submenuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3 }
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    }
  };

  const iconVariants = {
    rotate: { rotate: 180, transition: { duration: 0.3 } },
    initial: { rotate: 0, transition: { duration: 0.3 } }
  };

  // New fade-in animation for menu items
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
      opacity: 1,
      transition: {
        delay: custom * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <motion.div
      className="h-full bg-gray-900 text-white flex flex-col justify-between overflow-hidden relative"
      variants={sidebarVariants}
      initial={false}
      animate={isOpen ? "collapsed" : "expanded"}
    >
      {/* Header Section */}
      <div className="w-full">
        <div className="w-full pb-4 flex flex-col items-center">
          <div className={`pt-[1.2rem] absolute  ${isOpen ? 'justify-end right-1' : '-right-3 justify-end pr-4'} flex w-full`}>
            <motion.button
              onClick={() => setIsOpen(!isOpen) }
              className="p-1 rounded-full  bg-gray-800 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <FaAngleRight size={12} /> : <FaAngleLeft size={12} />}
            </motion.button>
          </div>

          <div className="flex items-center justify-center mt-8">
            <motion.img
              src="/translogo.png"
              alt="Logo"
              className={` ${isOpen ? 'mt-3' : ''} w-[3rem] h-[3rem] object-contain `}
              whileHover={{ scale: 1.05 }}
            />

            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  className="flex items-center gap-2 ml-4 "
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* <span className="h-6 w-px bg-gray-600 mx-2"></span> */}
                  <span className="text-xl font-bold">EQ-REV</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menu Section */}
        <div className="overflow-y-auto scrollbar-hide px-2">
          {menuItems.map((section, index) => (
            <div key={index} className="mb-0">
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    className="text-gray-400 text-xs px-4 uppercase tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {section.title}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="gap-2 flex flex-col mt-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <motion.div
                      onClick={() => handleMenuItemClick(item)}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 relative overflow-hidden cursor-pointer`}
                      variants={itemVariants}
                      animate={hoveredItem === item.name ? "hover" : "initial"}
                      whileTap={{ scale: 0.98 }}
                      custom={itemIndex}
                    >
                      {/* Active indicator */}
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-full h-full"
                        variants={activeItemVariants}
                        initial="initial"
                        animate={selectedSide === item.name ? "active" : "initial"}
                      />

                      <div className={`flex items-center z-10 ${isOpen ? 'w-full justify-center' : ''}`}>
                        {!isOpen ? (
                          <motion.span
                            className={`flex items-center justify-center ${selectedSide === item.name ? 'text-blue-400' : 'text-gray-300'}`}
                            whileHover={{ scale: 1.1 }}
                            onClick={(e) => handleItemIconClick(item, e)}
                          >
                            {item.icon}
                          </motion.span>)
                          : (
                            <Tooltip
                              title={
                                <span className="text-[12px] font-poppins font-medium py-4">{item.name}</span>
                              }
                              placement="top"
                              color=""
                              arrow
                            >
                              <motion.span
                                className={`flex items-center justify-center ${selectedSide === item.name ? 'text-blue-400' : 'text-gray-300'}`}
                                whileHover={{ scale: 1.1 }}
                                onClick={(e) => handleItemIconClick(item, e)}
                              >
                                {item.icon}
                              </motion.span>
                            </Tooltip>)
                        }
                        <AnimatePresence>
                          {!isOpen && (
                            <motion.span
                              className={`ml-3 text-[15px] ${selectedSide === item.name ? 'font-medium' : ''}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <AnimatePresence>
                        {!isOpen && item.hasSubmenu && (
                          <motion.div
                            className="p-1 rounded-full hover:bg-gray-700 z-10"
                            variants={iconVariants}
                            initial="initial"
                            animate={expandedMenus[item.name.toLowerCase()] ? "rotate" : "initial"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Submenu Items */}
                    <AnimatePresence>
                      {((!isOpen && expandedMenus[item.name.toLowerCase()]) ||
                        (isOpen && expandedMenus[item.name.toLowerCase()] && item.name === selectedSide)) && (
                          <motion.div
                            className={`overflow-hidden ${isOpen ? 'absolute left-20 bg-gray-800 rounded-lg shadow-lg z-50 min-w-48 p-2' : 'ml-4'}`}
                            variants={submenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                          >
                            {item.submenu.map((subItem, subIndex) => (
                              <motion.div
                                key={subIndex}
                                onClick={() => {
                                  handleNavigation(subItem.path);
                                  setSelectedSide(subItem.name);
                                }}
                                onMouseEnter={() => setHoveredItem(subItem.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`w-full flex items-center px-4 py-2 text-gray-400 rounded-lg transition-colors text-sm relative mt-1 cursor-pointer`}
                                variants={itemVariants}
                                animate={hoveredItem === subItem.name ? "hover" : "initial"}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                              >
                                <motion.div
                                  className="absolute left-0 top-0 bottom-0 w-full h-full"
                                  variants={activeItemVariants}
                                  initial="initial"
                                  animate={selectedSide === subItem.name ? "active" : "initial"}
                                />
                                <span className={`flex items-center justify-center z-10 ${selectedSide === subItem.name ? 'text-blue-400' : ''}`}>
                                  {subItem.icon}
                                </span>
                                <span className={`ml-3 text-[14px] z-10 ${selectedSide === subItem.name ? 'text-gray-200 font-medium' : ''}`}>
                                  {subItem.name}
                                </span>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {section.title === "MENU" && (
                <motion.div
                  className="w-full flex items-center justify-center mt-6 mb-2"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <hr className="w-[90%] border-gray-700" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
      </motion.div>
  );
};

export default Sidebar;