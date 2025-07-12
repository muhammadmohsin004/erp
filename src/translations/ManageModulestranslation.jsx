// dummytranslation.js
export const translations = {
  en: {
    // Header
    manageModules: "Manage Modules",
    manageModulesSubheading: "View, add, edit, and manage system modules",
    
    // Search and Actions
    searchPlaceholder: "Search modules by name or description...",
    addNewModule: "Add New Module",
    
    // Table Headers
    moduleName: "Module Name",
    description: "Description",
    status: "Status",
    created: "Created",
    actions: "Actions",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    
    // Modal Titles
    editModule: "Edit Module",
    addModule: "Add New Module",
    confirmDeletion: "Confirm Deletion",
    
    // Form Labels
    moduleNameLabel: "Module Name",
    moduleNamePlaceholder: "Enter module name",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Enter module description",
    statusLabel: "Status",
    statusPlaceholder: "Select status",
    
    // Buttons
    updateModule: "Update Module",
    addModuleBtn: "Add Module",
    cancel: "Cancel",
    deleteModule: "Delete Module",
    
    // Messages
    moduleStatusUpdated: "Module status updated successfully!",
    moduleUpdated: "Module updated successfully!",
    moduleAdded: "Module added successfully!",
    moduleDeleted: "Module deleted successfully!",
    
    // Empty State
    noModulesFound: "No modules found. Try a different search or add a new module.",
    
    // Delete Confirmation
    deleteConfirmation: "Are you sure you want to delete the module",
    deleteWarning: "? This action cannot be undone.",
    
    // Sample Module Data
    userManagement: "User Management",
    userManagementDesc: "Manage system users and permissions",
    contentManagement: "Content Management",
    contentManagementDesc: "Create and manage website content",
    analyticsDashboard: "Analytics Dashboard",
    analyticsDashboardDesc: "View system analytics and reports",
    billingSystem: "Billing System",
    billingSystemDesc: "Manage subscriptions and payments",
    notificationCenter: "Notification Center",
    notificationCenterDesc: "Configure and send notifications",
  },
  
  ar: {
    // Header
    manageModules: "إدارة الوحدات",
    manageModulesSubheading: "عرض وإضافة وتحرير وإدارة وحدات النظام",
    
    // Search and Actions
    searchPlaceholder: "البحث في الوحدات بالاسم أو الوصف...",
    addNewModule: "إضافة وحدة جديدة",
    
    // Table Headers
    moduleName: "اسم الوحدة",
    description: "الوصف",
    status: "الحالة",
    created: "تاريخ الإنشاء",
    actions: "الإجراءات",
    
    // Status
    active: "نشط",
    inactive: "غير نشط",
    
    // Modal Titles
    editModule: "تحرير الوحدة",
    addModule: "إضافة وحدة جديدة",
    confirmDeletion: "تأكيد الحذف",
    
    // Form Labels
    moduleNameLabel: "اسم الوحدة",
    moduleNamePlaceholder: "أدخل اسم الوحدة",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "أدخل وصف الوحدة",
    statusLabel: "الحالة",
    statusPlaceholder: "اختر الحالة",
    
    // Buttons
    updateModule: "تحديث الوحدة",
    addModuleBtn: "إضافة وحدة",
    cancel: "إلغاء",
    deleteModule: "حذف الوحدة",
    
    // Messages
    moduleStatusUpdated: "تم تحديث حالة الوحدة بنجاح!",
    moduleUpdated: "تم تحديث الوحدة بنجاح!",
    moduleAdded: "تم إضافة الوحدة بنجاح!",
    moduleDeleted: "تم حذف الوحدة بنجاح!",
    
    // Empty State
    noModulesFound: "لم يتم العثور على وحدات. جرب بحثًا مختلفًا أو أضف وحدة جديدة.",
    
    // Delete Confirmation
    deleteConfirmation: "هل أنت متأكد من أنك تريد حذف الوحدة",
    deleteWarning: "؟ لا يمكن التراجع عن هذا الإجراء.",
    
    // Sample Module Data
    userManagement: "إدارة المستخدمين",
    userManagementDesc: "إدارة مستخدمي النظام والصلاحيات",
    contentManagement: "إدارة المحتوى",
    contentManagementDesc: "إنشاء وإدارة محتوى الموقع",
    analyticsDashboard: "لوحة التحليلات",
    analyticsDashboardDesc: "عرض تحليلات النظام والتقارير",
    billingSystem: "نظام الفواتير",
    billingSystemDesc: "إدارة الاشتراكات والمدفوعات",
    notificationCenter: "مركز الإشعارات",
    notificationCenterDesc: "تكوين وإرسال الإشعارات",
  }
};

// Helper function to get translation
export const getTranslation = (key, language) => {
  return translations[language]?.[key] || translations.en[key] || key;
};