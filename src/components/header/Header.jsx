import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronDown,
  Menu,
  Bell,
  Globe,
  User,
  Settings,
  LogOut,
  Building2,
  Mail,
  Phone,
  Calendar,
  X,
  Search,
  MessageSquare,
  UserCircle,
  Shield,
  Users,
  Briefcase,
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import { setLanguage } from "../../store/slices/languageSlice";
import { useNavigate } from "react-router-dom";

// Translation data for English and Arabic
const translations = {
  en: {
    search: "Search...",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    markAllRead: "Mark all as read",
    profile: "Profile",
    settings: "Settings",
    company: "Company",
    logout: "Logout",
    welcomeBack: "Welcome back",
    admin: "Admin",
    manager: "Manager",
    employee: "Employee",
    online: "Online",
    lastSeen: "Last seen",
    messages: "Messages",
    viewProfile: "View Profile",
    editProfile: "Edit Profile",
    accountSettings: "Account Settings",
    companySettings: "Company Settings",
    language: "Language",
    companyInfo: "Company Information",
    userRole: "User Role",
    memberSince: "Member since",
    totalEmployees: "Total Employees",
    subscriptionPlan: "Subscription Plan",
    switchAccount: "Switch Account",
    help: "Help & Support",
  },
  ar: {
    search: "بحث...",
    notifications: "الإشعارات",
    noNotifications: "لا توجد إشعارات جديدة",
    markAllRead: "تحديد الكل كمقروء",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    company: "الشركة",
    logout: "تسجيل الخروج",
    welcomeBack: "مرحبًا بعودتك",
    admin: "مدير",
    manager: "مدير قسم",
    employee: "موظف",
    online: "متصل",
    lastSeen: "آخر ظهور",
    messages: "الرسائل",
    viewProfile: "عرض الملف الشخصي",
    editProfile: "تعديل الملف الشخصي",
    accountSettings: "إعدادات الحساب",
    companySettings: "إعدادات الشركة",
    language: "اللغة",
    companyInfo: "معلومات الشركة",
    userRole: "دور المستخدم",
    memberSince: "عضو منذ",
    totalEmployees: "إجمالي الموظفين",
    subscriptionPlan: "خطة الاشتراك",
    switchAccount: "تبديل الحساب",
    help: "المساعدة والدعم",
  },
};

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    dir: "ltr",
  },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
];

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: "New order received",
    titleAr: "طلب جديد مستلم",
    message: "Order #12345 has been placed",
    messageAr: "تم وضع الطلب رقم #12345",
    time: "2 minutes ago",
    timeAr: "منذ دقيقتين",
    read: false,
    type: "order",
  },
  {
    id: 2,
    title: "Inventory alert",
    titleAr: "تنبيه المخزون",
    message: "Low stock for Product A",
    messageAr: "مخزون منخفض للمنتج أ",
    time: "1 hour ago",
    timeAr: "منذ ساعة",
    read: false,
    type: "inventory",
  },
  {
    id: 3,
    title: "System update",
    titleAr: "تحديث النظام",
    message: "System will be updated tonight",
    messageAr: "سيتم تحديث النظام الليلة",
    time: "3 hours ago",
    timeAr: "منذ 3 ساعات",
    read: true,
    type: "system",
  },
];

// Dropdown Component with RTL support
const Dropdown = ({
  children,
  isOpen,
  onClose,
  className = "",
  isRTL = false,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${
        isRTL ? "left-0" : "right-0"
      } mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
};

// Notifications Dropdown
const NotificationsDropdown = ({
  isOpen,
  onClose,
  notifications,
  t,
  isRTL,
  currentLanguage,
}) => {
  const [notificationList, setNotificationList] = useState(notifications);

  const markAllAsRead = () => {
    setNotificationList((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const markAsRead = (id) => {
    setNotificationList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notificationList.filter((n) => !n.read).length;

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} className="w-80" isRTL={isRTL}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{t.notifications}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 mt-1"
          >
            {t.markAllRead}
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notificationList.length > 0 ? (
          notificationList.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? "bg-blue-50" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div
                className={`flex items-start space-x-3 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    !notification.read ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {currentLanguage === "ar"
                      ? notification.titleAr
                      : notification.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {currentLanguage === "ar"
                      ? notification.messageAr
                      : notification.message}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {currentLanguage === "ar"
                      ? notification.timeAr
                      : notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>{t.noNotifications}</p>
          </div>
        )}
      </div>
    </Dropdown>
  );
};

// Language Dropdown
const LanguageDropdown = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  t,
  isRTL,
}) => {
  return (
    <Dropdown isOpen={isOpen} onClose={onClose} className="w-48" isRTL={isRTL}>
      <div className="p-2">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {t.language}
        </div>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              onLanguageChange(lang.code);
              onClose();
            }}
            className={`w-full flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-3 px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-md ${
              currentLanguage === lang.code
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700"
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.nativeName}</span>
            {currentLanguage === lang.code && (
              <div
                className={`${
                  isRTL ? "mr-auto" : "ml-auto"
                } w-2 h-2 bg-blue-500 rounded-full`}
              />
            )}
          </button>
        ))}
      </div>
    </Dropdown>
  );
};

// User Profile Dropdown
const UserProfileDropdown = ({
  isOpen,
  onClose,
  user,
  company,
  t,
  isRTL,
  onLogout,
}) => {
  const navigate = useNavigate();
  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "manager":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "employee":
        return <Briefcase className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleText = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return t.admin;
      case "manager":
        return t.manager;
      case "employee":
        return t.employee;
      default:
        return role;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} className="w-80" isRTL={isRTL}>
      {/* User Info Section */}
      <div className="p-4 border-b border-gray-100">
        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-3`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {user?.F_Name?.charAt(0)}
              {user?.L_Name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user?.F_Name} {user?.L_Name}
            </h3>
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-2 mt-1`}
            >
              {getRoleIcon(user?.Role)}
              <span className="text-sm text-gray-600">
                {getRoleText(user?.Role)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{user?.Email}</p>
          </div>
        </div>

        {/* Status and Company Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-2 text-xs text-gray-600`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t.online}</span>
          </div>
          <div className="mt-2">
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-2 text-xs text-gray-600`}
            >
              <Building2 className="w-3 h-3" />
              <span>{company?.Name}</span>
            </div>
            {user?.CreatedAt && (
              <div
                className={`flex items-center ${
                  isRTL ? "space-x-reverse" : ""
                } space-x-2 text-xs text-gray-600 mt-1`}
              >
                <Calendar className="w-3 h-3" />
                <span>
                  {t.memberSince} {formatDate(user.CreatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Stats */}
      {company && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            {t.companyInfo}
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">{t.totalEmployees}</span>
              <p className="font-medium text-gray-900">
                {company.TotalEmployees || 0}
              </p>
            </div>
            <div>
              <span className="text-gray-500">{t.subscriptionPlan}</span>
              <p className="font-medium text-gray-900">
                {company.SubscriptionPlan || "Basic"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="p-2">
        <button
          className={`w-full flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-${
            isRTL ? "right" : "left"
          }`}
        >
          <UserCircle className="w-4 h-4" />
          <span>{t.viewProfile}</span>
        </button>

        <button
          className={`w-full flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-${
            isRTL ? "right" : "left"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.accountSettings}</span>
        </button>

        <button
          className={`w-full flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-${
            isRTL ? "right" : "left"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.companySettings}</span>
        </button>

        <button
          className={`w-full flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-${
            isRTL ? "right" : "left"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.help}</span>
        </button>

        <hr className="my-2 border-gray-200" />

        <button
          onClick={onLogout}
          className={`w-full flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md text-${
            isRTL ? "right" : "left"
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </Dropdown>
  );
};

// Main Header Component
const Header = ({ toggleSidebar, sidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { language: currentLanguage } = useSelector((state) => state.language);

  // State for dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Language and RTL support
  const isRTL = currentLanguage === "ar";
  const t = translations[currentLanguage] || translations.en;

  // Mock company data (you can get this from Redux store if available)
  const company = {
    Name: "codesinc",
    TotalEmployees: 25,
    SubscriptionPlan: "Premium",
  };

  const handleLanguageChange = (langCode) => {
    dispatch(setLanguage(langCode));
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfile(false);
    navigate("/");
  };

  const unreadNotificationCount = mockNotifications.filter(
    (n) => !n.read
  ).length;

  return (
    <header
      className={`fixed top-0 ${isRTL ? "left-0" : "right-0"} ${
        isRTL ? "right-0" : "left-0"
      } bg-white border-b border-gray-200 z-40 transition-all duration-300 ${
        sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : isRTL ? "mr-16" : "ml-16"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between px-8 py-1">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg mr-4"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-4`}
        >
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              )}
            </button>
            <NotificationsDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={mockNotifications}
              t={t}
              isRTL={isRTL}
              currentLanguage={currentLanguage}
            />
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguage(!showLanguage)}
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-2 p-2 hover:bg-gray-100 rounded-lg`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">
                {languages
                  .find((lang) => lang.code === currentLanguage)
                  ?.code.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <LanguageDropdown
              isOpen={showLanguage}
              onClose={() => setShowLanguage(false)}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              t={t}
              isRTL={isRTL}
            />
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-2 p-2 hover:bg-gray-100 rounded-lg`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.F_Name?.charAt(0)}
                  {user?.L_Name?.charAt(0)}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-sm font-medium text-gray-900">
                  {user?.F_Name} {user?.L_Name}
                </span>
                <div className="text-xs text-gray-500">
                  {t[user?.Role?.toLowerCase()] || user?.Role}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 hidden lg:block" />
            </button>
            <UserProfileDropdown
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
              user={user}
              company={company}
              t={t}
              isRTL={isRTL}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
