import React, { useCallback, useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight, X, User } from "lucide-react";
import { useSidebarData } from "./useSidebarData";

const Sidebar = ({ isOpen, onClose, isRTL }) => {
  const {
    expandedMenus,
    isMobile,
    currentLanguage,
    location,
    menuItems,
    userInfo,
    t,
    toggleSubmenu,
    isPathActive,
    isSubmenuActive,
  } = useSidebarData();

  // Debug logging
  console.log("Sidebar isOpen:", isOpen, "isMobile:", isMobile);

  // State for user data from localStorage
  const [userData, setUserData] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user data from localStorage:", error);
      }
    };

    loadUserData();
  }, []);

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = useCallback(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [isMobile, onClose]);

  // Company logo/initial component based on user data
  const CompanyLogo = useMemo(() => {
    if (!userData) return null;

    const companyInitial =
      userData.BusinessName?.charAt(0)?.toUpperCase() ||
      userData.CompanyName?.charAt(0)?.toUpperCase() ||
      "C";

    return (
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
        {userData.LogoUrl ? (
          <img
            src={userData.LogoUrl}
            alt={userData.BusinessName || userData.CompanyName}
            className="w-6 h-6 rounded object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}
        <span
          className={`text-white font-bold text-sm ${
            userData.LogoUrl ? "hidden" : "flex"
          }`}
          style={{ display: userData.LogoUrl ? "none" : "flex" }}
        >
          {companyInitial}
        </span>
      </div>
    );
  }, [userData]);

  // Render regular menu item
  const renderRegularMenuItem = useCallback(
    (item, index) => (
      <NavLink
        key={index}
        to={item.path}
        onClick={handleLinkClick}
        className={({ isActive }) => {
          const isCurrentActive =
            isActive || isPathActive(item.path, location.pathname);
          return `flex items-center px-4 py-3 text-sm hover:border-r-2 hover:border-purple-300 transition-all duration-200 group relative ${
            isCurrentActive
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-r-4 border-purple-400 shadow-lg"
              : "text-gray-700 hover:text-black"
          } ${currentLanguage === "ar" ? "" : ""}`;
        }}
      >
        <item.icon
          className={`w-5 h-5 flex-shrink-0 ${
            currentLanguage === "ar" ? "ml-3" : "mr-3"
          } ${
            isPathActive(item.path, location.pathname)
              ? "text-white"
              : "group-hover:text-black"
          }`}
        />
        {isOpen && (
          <span
            className={`truncate ${
              isPathActive(item.path, location.pathname)
                ? "text-white"
                : "group-hover:text-black"
            }`}
          >
            {item.label}
          </span>
        )}

        {/* Tooltip for collapsed sidebar */}
        {!isOpen && !isMobile && (
          <div
            className={`absolute ${
              currentLanguage === "ar" ? "right-16" : "left-16"
            } top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none`}
          >
            {item.label}
            <div
              className={`absolute ${
                currentLanguage === "ar" ? "right-0" : "left-0 add-scroll"
              } top-1/2 transform -translate-y-1/2 ${
                currentLanguage === "ar" ? "translate-x-1" : "-translate-x-1"
              } w-2 h-2 bg-gray-900 rotate-45`}
            ></div>
          </div>
        )}
      </NavLink>
    ),
    [
      handleLinkClick,
      isPathActive,
      location.pathname,
      isOpen,
      isMobile,
      currentLanguage,
    ]
  );

  // Render submenu items for expanded sidebar
  const renderSubmenuItems = useCallback(
    (submenuItems) => (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-r-4 border-purple-200">
        {submenuItems.map((subItem, subIndex) => (
          <NavLink
            key={subIndex}
            to={subItem.path}
            onClick={handleLinkClick}
            className={({ isActive }) => {
              const isCurrentActive =
                isActive || isPathActive(subItem.path, location.pathname);
              return `flex items-center px-8 py-2 text-sm hover:border-r-2 my-2 hover:border-purple-300 transition-all duration-200 ${isCurrentActive
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-r-4 border-purple-400 shadow-lg"
                  : "text-gray-600 hover:text-black"
              } ${currentLanguage === "ar" ? "" : ""}`;
            }}
          >
            <subItem.icon
              className={`w-4 h-4 flex-shrink-0 ${
                currentLanguage === "ar" ? "ml-2" : "mr-2"
              }`}
            />
            <span className="truncate">{subItem.label}</span>
          </NavLink>
        ))}
      </div>
    ),
    [handleLinkClick, isPathActive, location.pathname, currentLanguage]
  );

  // Render collapsed submenu tooltip
  const renderCollapsedSubmenu = useCallback(
    (item) => (
      <div
        className={`absolute ${
          currentLanguage === "ar" ? "right-16" : "left-16"
        } top-0 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto min-w-48`}
      >
        <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <span className="text-sm font-medium text-gray-700">
            {item.label}
          </span>
        </div>
        {item.submenuItems.map((subItem, subIndex) => (
          <NavLink
            key={subIndex}
            to={subItem.path}
            onClick={handleLinkClick}
            className={({ isActive }) => {
              const isCurrentActive =
                isActive || isPathActive(subItem.path, location.pathname);
              return `flex items-center px-3 py-2 text-sm transition-all duration-200 ${
                isCurrentActive
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  : "text-gray-600 hover:text-black"
              } ${currentLanguage === "ar" ? "flex-row-reverse" : ""} ${
                subIndex === 0 ? "rounded-t-none" : ""
              } ${
                subIndex === item.submenuItems.length - 1 ? "rounded-b-lg" : ""
              }`;
            }}
          >
            <subItem.icon
              className={`w-4 h-4 flex-shrink-0 ${
                currentLanguage === "ar" ? "ml-2" : "mr-2"
              }`}
            />
            <span className="truncate">{subItem.label}</span>
          </NavLink>
        ))}
      </div>
    ),
    [handleLinkClick, isPathActive, location.pathname, currentLanguage]
  );

  // Render submenu item with dropdown
  const renderSubmenuItem = useCallback(
    (item, index) => {
      const isExpanded = expandedMenus[item.key];
      const hasActiveSubmenu = isSubmenuActive(
        item.submenuItems,
        location.pathname
      );

      return (
        <div key={index}>
          {/* Main menu item with submenu */}
          <div
            className={`flex items-center px-4 py-3 text-sm hover:border-r-2 hover:border-purple-300 transition-all duration-200 cursor-pointer group relative ${
              hasActiveSubmenu
                ? "bg-gradient-to-r from-purple-500 to-purple-600 border-r-4 border-purple-400 shadow-lg"
                : "text-gray-700"
            } ${currentLanguage === "ar" ? "" : ""}`}
            onClick={() => toggleSubmenu(item.key)}
          >
            <item.icon
              className={`w-5 h-5 flex-shrink-0 ${
                hasActiveSubmenu
                  ? "text-white"
                  : "text-gray-700 group-hover:text-black"
              } ${currentLanguage === "ar" ? "ml-3" : "mr-3"}`}
            />
            {isOpen && (
              <>
                <span
                  className={`truncate flex-1 ${
                    hasActiveSubmenu ? "text-white" : "group-hover:text-black"
                  }`}
                >
                  {item.label}
                </span>
                {isExpanded ? (
                  <ChevronDown
                    className={`w-4 h-4 ${
                      hasActiveSubmenu
                        ? "text-white"
                        : "text-gray-700 group-hover:text-black"
                    } ${currentLanguage === "ar" ? "mr-2" : "ml-2"}`}
                  />
                ) : (
                  <ChevronRight
                    className={`w-4 h-4 ${
                      hasActiveSubmenu
                        ? "text-white"
                        : "text-gray-700 group-hover:text-black"
                    } ${currentLanguage === "ar" ? "mr-2" : "ml-2"}`}
                  />
                )}
              </>
            )}

            {/* Tooltip for collapsed sidebar */}
            {!isOpen && !isMobile && (
              <div
                className={`absolute ${
                  currentLanguage === "ar" ? "right-16" : "left-16"
                } top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none`}
              >
                {item.label}
                <div
                  className={`absolute ${
                    currentLanguage === "ar" ? "right-0" : "left-0"
                  } top-1/2 transform -translate-y-1/2 ${
                    currentLanguage === "ar"
                      ? "translate-x-1"
                      : "-translate-x-1"
                  } w-2 h-2 bg-gray-900 rotate-45`}
                ></div>
              </div>
            )}

            {/* Submenu for collapsed sidebar */}
            {!isOpen && !isMobile && renderCollapsedSubmenu(item)}
          </div>

          {/* Submenu items for expanded sidebar */}
          {isOpen && isExpanded && renderSubmenuItems(item.submenuItems)}
        </div>
      );
    },
    [
      expandedMenus,
      isSubmenuActive,
      location.pathname,
      toggleSubmenu,
      isOpen,
      isMobile,
      currentLanguage,
      renderCollapsedSubmenu,
      renderSubmenuItems,
    ]
  );

  // Render menu item (decides between regular or submenu)
  const renderMenuItem = useCallback(
    (item, index) => {
      return item.submenu
        ? renderSubmenuItem(item, index)
        : renderRegularMenuItem(item, index);
    },
    [renderSubmenuItem, renderRegularMenuItem]
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - FIXED HEIGHT AND FLEX LAYOUT */}
      <div
        className={`fixed ${
          currentLanguage === "ar" ? "right-0" : "left-0"
        } top-0 h-full bg-white shadow-2xl border-r border-gray-200 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-60" : "w-16"
        } ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : currentLanguage === "ar"
              ? "translate-x-full"
              : "-translate-x-full"
            : "translate-x-0"
        } overflow-hidden flex flex-col`}
      >
        {/* Header - FIXED HEIGHT */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 flex-shrink-0">
          {isOpen ? (
            <div className="flex items-center">
              {CompanyLogo}
              <div className="min-w-0 flex-1">
                <h2 className="text-white font-bold text-lg truncate">
                  {
                    (
                      userData?.BusinessName ||
                      userData?.CompanyName ||
                      t?.defaultCompanyName ||
                      "Business"
                    ).split(" ")[0]
                  }
                </h2>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {userData?.BusinessName?.charAt(0)?.toUpperCase() ||
                    userData?.CompanyName?.charAt(0)?.toUpperCase() ||
                    "C"}
                </span>
              </div>
            </div>
          )}

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* User Info - FIXED HEIGHT */}
        {isOpen && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData?.F_Name && userData?.L_Name
                    ? `${userData.F_Name} ${userData.L_Name}`
                    : userData?.F_Name ||
                      userData?.Name ||
                      userInfo?.F_Name ||
                      userInfo?.Name ||
                      "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userData?.Email || userInfo?.email || "No email"}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-purple-600 font-medium">
                    {t?.accessLevel || "Access Level"}:{" "}
                    {userData?.Position || userData?.Role || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu - SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-2">
         
            <div className="space-y-1">
              {menuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          </nav>
        </div>

        {/* Footer - FIXED HEIGHT */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
          {isOpen ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                {t?.current || "Current"}{" "}
                {userData?.Role || userData?.Position || "User"}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">
                  {userData?.IsActive ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className={`w-2 h-2 ${
                  userData?.IsActive ? "bg-green-500" : "bg-gray-400"
                } rounded-full animate-pulse`}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
