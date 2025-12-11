/**
 * 多语言国际化工具类
 * 支持中文和英文切换
 */
const i18n = {
    // 当前语言
    currentLanguage: 'zh-CN',

    // 语言包
    messages: {},

    /**
     * 初始化i18n
     */
    init: async function() {
        // 从LocalStorage获取保存的语言设置
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            this.currentLanguage = savedLang;
        } else {
            // 首次访问，明确设置为中文并保存
            this.currentLanguage = 'zh-CN';
            localStorage.setItem('language', 'zh-CN');
        }

        // 加载语言包
        await this.loadMessages();

        // 应用翻译
        this.applyTranslations();
    },

    /**
     * 加载语言包
     */
    loadMessages: async function() {
        try {
            // 加载中文语言包
            const zhCN = {
                common: {
                    systemName: '储能柜管理系统',
                    confirm: '确定',
                    cancel: '取消',
                    save: '保存',
                    delete: '删除',
                    edit: '编辑',
                    view: '查看',
                    search: '搜索',
                    reset: '重置',
                    add: '新增',
                    export: '导出',
                    import: '导入',
                    success: '操作成功',
                    error: '操作失败',
                    loading: '加载中...',
                    noData: '暂无数据',
                    total: '共',
                    items: '条',
                    actions: '操作',
                    status: '服务状态',
                    createTime: '创建时间',
                    updateTime: '更新时间',
                    remark: '备注'
                },
                login: {
                    title: '储能柜管理系统 - 登录',
                    greeting: '你好',
                    welcome: '欢迎进入储能柜管理后台',
                    subtitle: 'Welcome to the Energy Storage Cabinet Management System',
                    signIn: '用户登录',
                    welcomeBack: '欢迎回来，请输入您的凭证',
                    username: '13766477309',
                    password: '********',
                    rememberMe: '记住我',
                    loginButton: '登录',
                    loggingIn: '登录中...',
                    success: '登录成功！',
                    demoTip: '演示账号：admin / 123456',
                    error: {
                        emptyFields: '请输入用户名和密码',
                        invalidCredentials: '用户名或密码错误'
                    }
                },
                menu: {
                    dashboard: '控制台',
                    version: '版本管理',
                    versionList: '版本列表',
                    createVersion: '新增版本',
                    upgradeManagement: '升级管理',
                    customer: '客户管理',
                    customerList: '客户列表',
                    createCustomer: '新增客户',
                    menuManagement: '菜单权限管理',
                    menuConfig: '菜单配置',
                    permissionTemplate: '权限模板',
                    pricing: '电价计费模板',
                    pricingList: '模板列表',
                    createPricing: '新增模板',
                    system: '系统设置',
                    profile: '个人信息',
                    changePassword: '修改密码',
                    logout: '退出登录'
                },
                dashboard: {
                    title: '控制台',
                    welcome: '欢迎回来',
                    overview: '数据概览',
                    totalVersions: '版本总数',
                    totalCustomers: '客户总数',
                    totalDevices: '设备总数',
                    activeDevices: '在线设备',
                    versionTrend: '版本发布趋势',
                    customerDistribution: '客户分布',
                    deviceStatus: '设备状态分析',
                    recentActivities: '最近活动'
                },
                version: {
                    list: '版本列表',
                    versionNumber: '版本号',
                    versionName: '版本名称',
                    releaseDate: '发布日期',
                    description: '版本说明',
                    fileSize: '文件大小',
                    downloadCount: '下载次数',
                    createNew: '新增版本',
                    edit: '编辑版本',
                    delete: '删除版本',
                    detail: '版本详情',
                    upgrade: '升级管理',
                    confirmDelete: '确定要删除该版本吗？',
                    basicEdition: '基础版',
                    professionalEdition: '专业版',
                    basicEditionEn: 'BASIC EDITION',
                    professionalEditionEn: 'PROFESSIONAL EDITION',
                    userCount: '用户数量',
                    editConfig: '编辑配置',
                    basicDescription: '适合中小型企业的基础能源管理解决方案，提供核心监控功能、基础数据报表、5GB 云端存储空间以及标准技术支持服务。',
                    proDescription: '面向大型企业的全功能版本，包含高级数据分析、自定义报表生成、无限云端存储、优先技术支持、多站点统一管理以及完整的 API 集成接口。',
                    // 编辑表单
                    editionNameLabel: '版本名称',
                    editionCodeLabel: '版本代码',
                    editionCodeReadonly: '版本代码不可修改',
                    editionIconLabel: '版本图标',
                    uploadIcon: '上传图标',
                    clearIcon: '清除',
                    iconUploadTip: '建议上传PNG格式,尺寸200x200像素,文件大小不超过500KB。此图标将显示在用户侧的版本标识中。',
                    editionDescriptionLabel: '版本描述',
                    basicInfo: '基础信息',
                    systemFeatures: '系统功能',
                    availableMenus: '可用菜单',
                    menuSelectionTip: '选择该版本用户可以访问的菜单功能，点击箭头可展开/收起子菜单',
                    operationLogRetention: '操作日志保留天数',
                    customDays: '自定义天数',
                    permanent: '长期有效',
                    days: '天',
                    operationLogTip: '设置系统操作日志的保留时间',
                    dataQueryRetention: '实时数据、历史数据查询天数',
                    dataQueryTip: '实时数据和历史数据的查询保留时间',
                    otherSettings: '其他配置',
                    notificationMethod: '消息通知方式',
                    emailNotify: '邮件通知',
                    smsNotify: '短信通知',
                    notificationTip: '选择系统消息的通知方式',
                    menuTypeDirectory: '目录',
                    menuTypeButton: '按钮',
                    menuTypeMenu: '菜单',
                    // 验证提示
                    pleaseEnterName: '请填写版本名称',
                    pleaseSelectMenu: '请至少选择一个可用菜单',
                    saveSuccess: '保存成功',
                    saveFailed: '保存失败，请重试'
                },
                customer: {
                    management: '客户管理',
                    list: '客户列表',
                    customerName: '客户名称',
                    contactPerson: '联系人',
                    contactPhone: '联系电话',
                    email: '邮箱',
                    address: '地址',
                    industry: '所属行业',
                    deviceCount: '设备数量',
                    edition: '版本',
                    expiryDate: '到期时间',
                    totalCustomers: '客户总数',
                    activeCustomers: '使用中客户',
                    newCustomers: '新增客户',
                    basicEdition: '基础版客户',
                    basicEditionShort: '基础版',
                    professionalEdition: '专业版客户',
                    professionalEditionShort: '专业版',
                    expiringCustomers: '快到期客户',
                    todayNew: '今日新增',
                    expiringIn30Days: '30天内到期',
                    searchPlaceholder: '搜索客户名称',
                    allEditions: '所有版本',
                    allStatus: '所有状态',
                    exportData: '导出数据',
                    siteCount: '电站数量',
                    accountStatus: '账号状态',
                    serviceStatus: '服务状态',
                    createNew: '新增客户',
                    edit: '编辑客户',
                    delete: '删除客户',
                    detail: '客户详情',
                    confirmDelete: '确定要删除该客户吗？',
                    // 表单字段
                    account: '账号',
                    password: '密码',
                    selectEdition: '请选择',
                    expiryDateType: '到期时间类型',
                    oneMonth: '1个月',
                    threeMonths: '3个月',
                    sixMonths: '6个月',
                    customDate: '具体日期',
                    permanentValid: '永久有效',
                    specificExpiryDate: '具体到期日期',
                    calculatedExpiryDate: '到期时间',
                    phonePlaceholder: '请输入11位手机号',
                    close: '关闭',
                    // 详情字段
                    accountInfo: '账户信息',
                    contactInfo: '联系方式',
                    resourceStats: '资源统计',
                    timeInfo: '时间信息',
                    servicePeriod: '服务期限',
                    sites: '站点数量',
                    devices: '设备数量',
                    createTime: '创建时间',
                    // 删除确认
                    confirmDeleteMessage: '确定要删除该客户吗？此操作不可恢复！',
                    deleteWarning: '此操作不可恢复！',
                    status: {
                        notStarted: '未服务',
                        expired: '已过期',
                        disabled: '未启用',
                        active: '服务中'
                    },
                    accountStatusValue: {
                        enabled: '启用',
                        disabled: '停用'
                    }
                },
                pricing: {
                    list: '计费模板列表',
                    templateName: '模板名称',
                    peakPrice: '峰电价',
                    flatPrice: '平电价',
                    valleyPrice: '谷电价',
                    effectiveDate: '生效日期',
                    createNew: '新增模板',
                    edit: '编辑模板',
                    delete: '删除模板',
                    detail: '模板详情',
                    confirmDelete: '确定要删除该模板吗？'
                },
                menuConfig: {
                    menuName: '菜单名称',
                    type: '类型',
                    path: '路径',
                    icon: '图标',
                    sort: '排序',
                    status: '状态',
                    searchPlaceholder: '搜索菜单名称',
                    allTypes: '所有类型',
                    typeMenu: '菜单',
                    typeDirectory: '目录',
                    typeButton: '按钮',
                    allStatus: '所有状态',
                    statusActive: '已启用',
                    statusInactive: '已禁用',
                    query: '查询',
                    reset: '重置',
                    createMenu: '新增菜单',
                    editMenu: '编辑菜单',
                    expandAll: '展开全部',
                    collapseAll: '收起全部',
                    addSubMenu: '新增子菜单',
                    confirmDelete: '确定要删除该菜单吗？如果有子菜单将无法删除。',
                    // 表单字段
                    basicInfo: '基本信息',
                    menuNamePlaceholder: '请输入菜单名称',
                    menuTypeLabel: '菜单类型',
                    menuOption: '📄 菜单',
                    directoryOption: '📁 目录',
                    buttonOption: '🔘 按钮',
                    typeDescDirectory: '目录：用于组织菜单结构，不可点击',
                    typeDescMenu: '菜单：可点击跳转的菜单项',
                    typeDescButton: '按钮：页面内的操作按钮',
                    parentMenu: '上级菜单',
                    noParent: '🏠 无 (顶级菜单)',
                    pathLabel: '路径',
                    pathPlaceholder: '/path/to/page',
                    pathTip: '菜单类型需要配置路由路径',
                    iconSettings: '图标设置',
                    iconClassName: '图标类名',
                    iconPlaceholder: 'bi-house',
                    quickSelect: '快速选择',
                    otherSettings: '其他设置',
                    sortLabel: '排序',
                    sortTip: '数字越小越靠前'
                }
            };

            // 加载英文语言包
            const enUS = {
                common: {
                    systemName: 'Energy Storage Management System',
                    confirm: 'Confirm',
                    cancel: 'Cancel',
                    save: 'Save',
                    delete: 'Delete',
                    edit: 'Edit',
                    view: 'View',
                    search: 'Search',
                    reset: 'Reset',
                    add: 'Add',
                    export: 'Export',
                    import: 'Import',
                    success: 'Operation successful',
                    error: 'Operation failed',
                    loading: 'Loading...',
                    noData: 'No data',
                    total: 'Total',
                    items: 'items',
                    actions: 'Actions',
                    status: 'Service Status',
                    createTime: 'Create Time',
                    updateTime: 'Update Time',
                    remark: 'Remark'
                },
                login: {
                    title: 'Energy Storage System - Login',
                    greeting: 'Hello',
                    welcome: 'Welcome to the Energy Storage Cabinet Management System',
                    subtitle: 'Smart Management, Efficient Operation, Safe and Reliable',
                    signIn: 'User Login',
                    welcomeBack: 'Welcome back, please enter your credentials',
                    username: '13766477309',
                    password: '********',
                    rememberMe: 'Remember me',
                    loginButton: 'Login',
                    loggingIn: 'Logging in...',
                    success: 'Login successful!',
                    demoTip: 'Demo Account: admin / 123456',
                    error: {
                        emptyFields: 'Please enter username and password',
                        invalidCredentials: 'Invalid username or password'
                    }
                },
                menu: {
                    dashboard: 'Dashboard',
                    version: 'Version Management',
                    versionList: 'Version List',
                    createVersion: 'Create Version',
                    upgradeManagement: 'Upgrade Management',
                    customer: 'Customer Management',
                    customerList: 'Customer List',
                    createCustomer: 'Create Customer',
                    menuManagement: 'Menu Permission',
                    menuConfig: 'Menu Config',
                    permissionTemplate: 'Permission Template',
                    pricing: 'Pricing Template',
                    pricingList: 'Template List',
                    createPricing: 'Create Template',
                    system: 'System Settings',
                    profile: 'Profile',
                    changePassword: 'Change Password',
                    logout: 'Logout'
                },
                dashboard: {
                    title: 'Dashboard',
                    welcome: 'Welcome back',
                    overview: 'Overview',
                    totalVersions: 'Total Versions',
                    totalCustomers: 'Total Customers',
                    totalDevices: 'Total Devices',
                    activeDevices: 'Active Devices',
                    versionTrend: 'Version Release Trend',
                    customerDistribution: 'Customer Distribution',
                    deviceStatus: 'Device Status Analysis',
                    recentActivities: 'Recent Activities'
                },
                version: {
                    list: 'Version List',
                    versionNumber: 'Version Number',
                    versionName: 'Version Name',
                    releaseDate: 'Release Date',
                    description: 'Description',
                    fileSize: 'File Size',
                    downloadCount: 'Downloads',
                    createNew: 'Create Version',
                    edit: 'Edit Version',
                    delete: 'Delete Version',
                    detail: 'Version Detail',
                    upgrade: 'Upgrade Management',
                    confirmDelete: 'Are you sure to delete this version?',
                    basicEdition: 'Basic Edition',
                    professionalEdition: 'Professional Edition',
                    basicEditionEn: 'BASIC EDITION',
                    professionalEditionEn: 'PROFESSIONAL EDITION',
                    userCount: 'User Count',
                    editConfig: 'Edit Configuration',
                    basicDescription: 'Essential energy management solution for small to medium enterprises, featuring core monitoring functions, basic data reports, 5GB cloud storage, and standard technical support.',
                    proDescription: 'Full-featured version for large enterprises, including advanced data analysis, custom report generation, unlimited cloud storage, priority technical support, multi-site unified management, and complete API integration.',
                    // Edit Form
                    editionNameLabel: 'Edition Name',
                    editionCodeLabel: 'Edition Code',
                    editionCodeReadonly: 'Edition code cannot be modified',
                    editionIconLabel: 'Edition Icon',
                    uploadIcon: 'Upload Icon',
                    clearIcon: 'Clear',
                    iconUploadTip: 'Recommended PNG format, 200x200 pixels, file size no more than 500KB. This icon will be displayed in the user-side version identifier.',
                    editionDescriptionLabel: 'Edition Description',
                    basicInfo: 'Basic Info',
                    systemFeatures: 'System Features',
                    availableMenus: 'Available Menus',
                    menuSelectionTip: 'Select menu functions that users of this edition can access, click arrows to expand/collapse submenus',
                    operationLogRetention: 'Operation Log Retention Days',
                    customDays: 'Custom Days',
                    permanent: 'Permanent',
                    days: 'Days',
                    operationLogTip: 'Set retention time for system operation logs',
                    dataQueryRetention: 'Real-time Data & Historical Data Query Days',
                    dataQueryTip: 'Query retention time for real-time and historical data',
                    otherSettings: 'Other Settings',
                    notificationMethod: 'Notification Method',
                    emailNotify: 'Email Notification',
                    smsNotify: 'SMS Notification',
                    notificationTip: 'Select system message notification methods',
                    menuTypeDirectory: 'Directory',
                    menuTypeButton: 'Button',
                    menuTypeMenu: 'Menu',
                    // Validation Messages
                    pleaseEnterName: 'Please enter edition name',
                    pleaseSelectMenu: 'Please select at least one menu',
                    saveSuccess: 'Save successful',
                    saveFailed: 'Save failed, please try again'
                },
                customer: {
                    management: 'Customer Management',
                    list: 'Customer List',
                    customerName: 'Customer Name',
                    contactPerson: 'Contact Person',
                    contactPhone: 'Contact Phone',
                    email: 'Email',
                    address: 'Address',
                    industry: 'Industry',
                    deviceCount: 'Device Count',
                    edition: 'Edition',
                    expiryDate: 'Expiry Date',
                    totalCustomers: 'Total Customers',
                    activeCustomers: 'Active Customers',
                    newCustomers: 'New Customers',
                    basicEdition: 'Basic Edition Customers',
                    basicEditionShort: 'Basic',
                    professionalEdition: 'Professional Edition Customers',
                    professionalEditionShort: 'Professional',
                    expiringCustomers: 'Expiring Customers',
                    todayNew: 'Today\'s New',
                    expiringIn30Days: 'Expiring in 30 days',
                    searchPlaceholder: 'Search Customer Name',
                    allEditions: 'All Editions',
                    allStatus: 'All Status',
                    exportData: 'Export Data',
                    siteCount: 'Site Count',
                    accountStatus: 'Account Status',
                    serviceStatus: 'Service Status',
                    createNew: 'Create Customer',
                    edit: 'Edit Customer',
                    delete: 'Delete Customer',
                    detail: 'Customer Detail',
                    confirmDelete: 'Are you sure to delete this customer?',
                    // Form fields
                    account: 'Account',
                    password: 'Password',
                    selectEdition: 'Please select',
                    expiryDateType: 'Expiry Date Type',
                    oneMonth: '1 Month',
                    threeMonths: '3 Months',
                    sixMonths: '6 Months',
                    customDate: 'Specific Date',
                    permanentValid: 'Permanent',
                    specificExpiryDate: 'Specific Expiry Date',
                    calculatedExpiryDate: 'Expiry Date',
                    phonePlaceholder: 'Enter 11-digit mobile number',
                    close: 'Close',
                    // Detail fields
                    accountInfo: 'Account Information',
                    contactInfo: 'Contact Information',
                    resourceStats: 'Resource Statistics',
                    timeInfo: 'Time Information',
                    servicePeriod: 'Service Period',
                    sites: 'Site Count',
                    devices: 'Device Count',
                    createTime: 'Create Time',
                    // Delete confirmation
                    confirmDeleteMessage: 'Are you sure to delete this customer? This operation cannot be undone!',
                    deleteWarning: 'This operation cannot be undone!',
                    status: {
                        notStarted: 'Not Started',
                        expired: 'Expired',
                        disabled: 'Disabled',
                        active: 'Active'
                    },
                    accountStatusValue: {
                        enabled: 'Enabled',
                        disabled: 'Disabled'
                    }
                },
                pricing: {
                    list: 'Pricing Template List',
                    templateName: 'Template Name',
                    peakPrice: 'Peak Price',
                    flatPrice: 'Flat Price',
                    valleyPrice: 'Valley Price',
                    effectiveDate: 'Effective Date',
                    createNew: 'Create Template',
                    edit: 'Edit Template',
                    delete: 'Delete Template',
                    detail: 'Template Detail',
                    confirmDelete: 'Are you sure to delete this template?'
                },
                menuConfig: {
                    menuName: 'Menu Name',
                    type: 'Type',
                    path: 'Path',
                    icon: 'Icon',
                    sort: 'Sort',
                    status: 'Status',
                    searchPlaceholder: 'Search menu name',
                    allTypes: 'All Types',
                    typeMenu: 'Menu',
                    typeDirectory: 'Directory',
                    typeButton: 'Button',
                    allStatus: 'All Status',
                    statusActive: 'Active',
                    statusInactive: 'Inactive',
                    query: 'Query',
                    reset: 'Reset',
                    createMenu: 'Create Menu',
                    editMenu: 'Edit Menu',
                    expandAll: 'Expand All',
                    collapseAll: 'Collapse All',
                    addSubMenu: 'Add Submenu',
                    confirmDelete: 'Are you sure to delete this menu? Cannot delete if it has submenus.',
                    // Form Fields
                    basicInfo: 'Basic Info',
                    menuNamePlaceholder: 'Enter menu name',
                    menuTypeLabel: 'Menu Type',
                    menuOption: '📄 Menu',
                    directoryOption: '📁 Directory',
                    buttonOption: '🔘 Button',
                    typeDescDirectory: 'Directory: For organizing menu structure, not clickable',
                    typeDescMenu: 'Menu: Clickable menu item',
                    typeDescButton: 'Button: Operation button within page',
                    parentMenu: 'Parent Menu',
                    noParent: '🏠 None (Top Level)',
                    pathLabel: 'Path',
                    pathPlaceholder: '/path/to/page',
                    pathTip: 'Menu type requires route path configuration',
                    iconSettings: 'Icon Settings',
                    iconClassName: 'Icon Class',
                    iconPlaceholder: 'bi-house',
                    quickSelect: 'Quick Select',
                    otherSettings: 'Other Settings',
                    sortLabel: 'Sort Order',
                    sortTip: 'Smaller number appears first'
                }
            };

            this.messages = {
                'zh-CN': zhCN,
                'en-US': enUS
            };
        } catch (error) {
            console.error('Failed to load language files:', error);
        }
    },

    /**
     * 获取翻译文本
     * @param {string} key - 翻译键，支持点号分隔的路径，如 'menu.dashboard'
     * @param {object} params - 参数对象，用于替换文本中的变量
     * @returns {string} 翻译后的文本
     */
    t: function(key, params = {}) {
        const keys = key.split('.');
        let message = this.messages[this.currentLanguage];

        for (const k of keys) {
            if (message && message[k]) {
                message = message[k];
            } else {
                return key; // 如果找不到翻译，返回键本身
            }
        }

        // 替换参数
        let result = message;
        for (const [param, value] of Object.entries(params)) {
            result = result.replace(new RegExp(`{${param}}`, 'g'), value);
        }

        return result;
    },

    /**
     * 设置语言
     * @param {string} lang - 语言代码，如 'zh-CN' 或 'en-US'
     */
    setLanguage: function(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.applyTranslations();
    },

    /**
     * 获取当前语言
     * @returns {string} 当前语言代码
     */
    getCurrentLanguage: function() {
        return this.currentLanguage;
    },

    /**
     * 应用翻译到页面
     */
    applyTranslations: function() {
        // 更新所有带有 data-i18n 属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新页面标题
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            document.title = this.t(key);
        }

        // 更新HTML lang属性
        document.documentElement.lang = this.currentLanguage;
    }
};

// 自动初始化（如果在浏览器环境中）
if (typeof window !== 'undefined') {
    window.i18n = i18n;
}
