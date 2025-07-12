// dummytranslation.js
export const translations = {
  en: {
    smtpSettings: {
      title: "SMTP Settings",
      emailServerConfig: "Email Server Configuration",
      emailServerConfigDesc: "Configure your SMTP server settings to enable email notifications and communications.",
      
      // Form Labels
      smtpHost: "SMTP Host",
      smtpPort: "SMTP Port", 
      username: "Username (Email Address)",
      password: "Password",
      encryptionMethod: "Encryption Method",
      
      // Placeholders
      smtpHostPlaceholder: "e.g., smtp.gmail.com",
      smtpPortPlaceholder: "e.g., 587, 465, 25",
      usernamePlaceholder: "your-email@example.com",
      passwordPlaceholder: "Enter your email password or app password",
      encryptionPlaceholder: "Select encryption method",
      
      // Encryption Options
      encryptionTLS: "TLS",
      encryptionSSL: "SSL", 
      encryptionNone: "None",
      
      // Security Recommendations
      securityRecommendations: "Security Recommendations",
      securityTip1: "• Use TLS encryption for secure email transmission",
      securityTip2: "• For Gmail, use App Passwords instead of your regular password",
      securityTip3: "• Port 587 is recommended for most SMTP servers",
      
      // Buttons
      resetForm: "Reset Form",
      testConnection: "Test Connection",
      testing: "Testing...",
      saveSettings: "Save Settings",
      
      // Messages
      fillRequiredFields: "Please fill in all required fields correctly before testing",
      smtpConnectionSuccess: "SMTP connection successful! Email configuration is working properly.",
      smtpConnectionFailed: "SMTP connection failed. Please check your settings and try again.",
      settingsUpdated: "SMTP settings updated successfully!",
      fixErrors: "Please fix the errors below",
      
      // Validation Messages
      smtpHostRequired: "SMTP Host is required",
      smtpPortRequired: "SMTP Port is required",
      portMustBeNumber: "Port must be a valid number",
      usernameRequired: "Username is required",
      validEmailRequired: "Please enter a valid email address",
      passwordRequired: "Password is required",
      encryptionRequired: "Encryption method is required"
    }
  },
  ar: {
    smtpSettings: {
      title: "إعدادات SMTP",
      emailServerConfig: "تكوين خادم البريد الإلكتروني",
      emailServerConfigDesc: "قم بتكوين إعدادات خادم SMTP لتمكين إشعارات البريد الإلكتروني والاتصالات.",
      
      // Form Labels
      smtpHost: "مضيف SMTP",
      smtpPort: "منفذ SMTP",
      username: "اسم المستخدم (عنوان البريد الإلكتروني)",
      password: "كلمة المرور",
      encryptionMethod: "طريقة التشفير",
      
      // Placeholders
      smtpHostPlaceholder: "مثال: smtp.gmail.com",
      smtpPortPlaceholder: "مثال: 587، 465، 25",
      usernamePlaceholder: "your-email@example.com",
      passwordPlaceholder: "أدخل كلمة مرور البريد الإلكتروني أو كلمة مرور التطبيق",
      encryptionPlaceholder: "حدد طريقة التشفير",
      
      // Encryption Options
      encryptionTLS: "TLS",
      encryptionSSL: "SSL",
      encryptionNone: "بدون",
      
      // Security Recommendations
      securityRecommendations: "توصيات الأمان",
      securityTip1: "• استخدم تشفير TLS لنقل البريد الإلكتروني الآمن",
      securityTip2: "• بالنسبة لـ Gmail، استخدم كلمات مرور التطبيق بدلاً من كلمة المرور العادية",
      securityTip3: "• يُنصح بالمنفذ 587 لمعظم خوادم SMTP",
      
      // Buttons
      resetForm: "إعادة تعيين النموذج",
      testConnection: "اختبار الاتصال",
      testing: "جاري الاختبار...",
      saveSettings: "حفظ الإعدادات",
      
      // Messages
      fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة بشكل صحيح قبل الاختبار",
      smtpConnectionSuccess: "نجح اتصال SMTP! تكوين البريد الإلكتروني يعمل بشكل صحيح.",
      smtpConnectionFailed: "فشل اتصال SMTP. يرجى التحقق من إعداداتك والمحاولة مرة أخرى.",
      settingsUpdated: "تم تحديث إعدادات SMTP بنجاح!",
      fixErrors: "يرجى إصلاح الأخطاء أدناه",
      
      // Validation Messages
      smtpHostRequired: "مضيف SMTP مطلوب",
      smtpPortRequired: "منفذ SMTP مطلوب",
      portMustBeNumber: "يجب أن يكون المنفذ رقماً صحيحاً",
      usernameRequired: "اسم المستخدم مطلوب",
      validEmailRequired: "يرجى إدخال عنوان بريد إلكتروني صحيح",
      passwordRequired: "كلمة المرور مطلوبة",
      encryptionRequired: "طريقة التشفير مطلوبة"
    }
  }
};