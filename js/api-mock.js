/**
 * Mock API数据模块
 * 模拟后端接口返回的数据
 */
const MockAPI = {
    /**
     * 生成随机ID
     */
    generateId: function() {
        return Date.now() + Math.floor(Math.random() * 1000);
    },

    /**
     * 生成随机日期
     */
    randomDate: function(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    /**
     * 模拟异步请求延迟
     */
    delay: function(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 版本管理数据 - 系统版本类型(基础版和专业版)
     */
    editions: {
        data: [
            {
                id: 1,
                name: '基础版',
                nameEn: 'Basic Edition',
                code: 'basic',
                description: '适合中小型企业，包含基础的储能柜监控和管理功能',
                descriptionEn: 'Essential energy management solution for small to medium enterprises, featuring core monitoring functions, basic data reports, 5GB cloud storage, and standard technical support.',
                menuIds: [1, 2, 22, 3, 32, 34], // 系统管理目录、版本管理(仅编辑)、客户管理(仅编辑和查看)
                operationLog: {
                    retention: 30 // 基础版操作日志保留天数
                },
                dataCycle: {
                    retention: 30 // 实时数据、历史数据查询保留天数
                },
                notification: {
                    email: true,  // 邮件通知
                    sms: true     // 短信通知
                },
                customerCount: 0,
                status: 'active',
                createTime: '2024-01-01'
            },
            {
                id: 2,
                name: '专业版',
                nameEn: 'Professional Edition',
                code: 'professional',
                description: '适合大型企业，提供完整的储能柜管理解决方案',
                descriptionEn: 'Full-featured version for large enterprises, including advanced data analysis, custom report generation, unlimited cloud storage, priority technical support, multi-site unified management, and complete API integration.',
                menuIds: [1, 2, 21, 22, 23, 3, 31, 32, 33, 34, 41, 42, 43, 44], // 所有菜单和按钮
                operationLog: {
                    retention: 180 // 专业版操作日志保留天数
                },
                dataCycle: {
                    retention: -1 // 实时数据、历史数据查询保留天数(-1表示长期有效)
                },
                notification: {
                    email: true,  // 邮件通知
                    sms: true     // 短信通知
                },
                customerCount: 0,
                status: 'active',
                createTime: '2024-01-01'
            }
        ],

        getList: async function() {
            await MockAPI.delay();

            // 统计使用各版本的客户数量
            const editionsWithCount = this.data.map(edition => {
                const customerCount = MockAPI.customers.data.filter(c => c.edition === edition.code).length;
                return {
                    ...edition,
                    customerCount
                };
            });

            return {
                success: true,
                data: {
                    list: editionsWithCount
                }
            };
        },

        getById: async function(id) {
            await MockAPI.delay();
            const item = this.data.find(e => e.id === parseInt(id));
            if (item) {
                const customerCount = MockAPI.customers.data.filter(c => c.edition === item.code).length;
                return {
                    success: true,
                    data: {
                        ...item,
                        customerCount
                    },
                    message: '获取成功'
                };
            }
            return {
                success: false,
                message: '版本不存在'
            };
        },

        update: async function(id, data) {
            await MockAPI.delay();
            const index = this.data.findIndex(e => e.id === parseInt(id));
            if (index !== -1) {
                // 更新版本信息，但保持code不变
                this.data[index] = {
                    ...this.data[index],
                    ...data,
                    code: this.data[index].code // 保持版本代码不变
                };
                return {
                    success: true,
                    data: this.data[index],
                    message: '更新成功'
                };
            }
            return {
                success: false,
                message: '版本不存在'
            };
        }
    },

    /**
     * 客户管理数据
     */
    customers: {
        data: [
            { id: 1, customerName: '华能国际电力', customerNameEn: 'Huaneng Power International', account: 'huaneng001', password: 'admin', contactPerson: '张经理', contactPhone: '13800138001', siteCount: 3, deviceCount: 45, edition: 'professional', activateTime: '2024-01-16', expiryDate: '2026-01-15', status: 'active', createTime: '2024-01-15' },
            { id: 2, customerName: '比亚迪新能源', customerNameEn: 'BYD New Energy', account: 'byd002', password: 'admin', contactPerson: '李总', contactPhone: '13800138002', siteCount: 2, deviceCount: 38, edition: 'professional', activateTime: '2024-02-21', expiryDate: '2026-02-20', status: 'active', createTime: '2024-02-20' },
            { id: 3, customerName: '宁德时代', customerNameEn: 'CATL', account: 'catl003', password: 'admin', contactPerson: '王主任', contactPhone: '13800138003', siteCount: 4, deviceCount: 52, edition: 'professional', activateTime: '2024-03-11', expiryDate: '2025-12-25', status: 'active', createTime: '2024-03-10' },
            { id: 4, customerName: '国家电网', customerNameEn: 'State Grid Corporation', account: 'sgcc004', password: 'admin', contactPerson: '赵总监', contactPhone: '13800138004', siteCount: 8, deviceCount: 128, edition: 'professional', activateTime: '2024-01-09', expiryDate: '2026-06-08', status: 'active', createTime: '2024-01-08' },
            { id: 5, customerName: '阳光电源', customerNameEn: 'Sungrow Power Supply', account: 'sungrow005', password: 'admin', contactPerson: '刘工', contactPhone: '13800138005', siteCount: 2, deviceCount: 31, edition: 'basic', activateTime: '2024-04-16', expiryDate: '2026-04-15', status: 'active', createTime: '2024-04-15' },
            { id: 6, customerName: '隆基绿能', customerNameEn: 'LONGi Green Energy', account: 'longi006', password: 'admin', contactPerson: '陈经理', contactPhone: '13800138006', siteCount: 2, deviceCount: 27, edition: 'basic', activateTime: '2024-05-02', expiryDate: '2026-05-01', status: 'active', createTime: '2024-05-01' },
            { id: 7, customerName: '特斯拉中国', customerNameEn: 'Tesla China', account: 'tesla007', password: 'admin', contactPerson: 'Mike Wang', contactPhone: '13800138007', siteCount: 1, deviceCount: 19, edition: 'professional', activateTime: '2024-06-13', expiryDate: '2026-06-12', status: 'active', createTime: '2024-06-12' },
            { id: 8, customerName: '协鑫集成', customerNameEn: 'GCL System Integration', account: 'gclsi008', password: 'admin', contactPerson: '周总', contactPhone: '13800138008', siteCount: 3, deviceCount: 42, edition: 'professional', activateTime: '2024-03-26', expiryDate: '2026-03-25', status: 'active', createTime: '2024-03-25' },
            { id: 9, customerName: '蔚来汽车', customerNameEn: 'NIO Inc.', account: 'nio009', password: 'admin', contactPerson: '吴总监', contactPhone: '13800138009', siteCount: 1, deviceCount: 15, edition: 'basic', activateTime: '2024-07-09', expiryDate: '2025-12-28', status: 'active', createTime: '2024-07-08' },
            { id: 10, customerName: '中国华电', customerNameEn: 'China Huadian Corporation', account: 'chd010', password: 'admin', contactPerson: '郑主任', contactPhone: '13800138010', siteCount: 5, deviceCount: 76, edition: 'professional', activateTime: '2024-02-19', expiryDate: '2026-02-18', status: 'active', createTime: '2024-02-18' },
            { id: 11, customerName: '晶科能源', customerNameEn: 'JinkoSolar', account: 'jinko011', password: 'admin', contactPerson: '孙经理', contactPhone: '13800138011', siteCount: 2, deviceCount: 33, edition: 'basic', activateTime: '2024-04-23', expiryDate: '2026-04-22', status: 'active', createTime: '2024-04-22' },
            { id: 12, customerName: '小鹏汽车', customerNameEn: 'XPeng Motors', account: 'xpeng012', password: 'admin', contactPerson: '何总', contactPhone: '13800138012', siteCount: 1, deviceCount: 22, edition: 'basic', activateTime: '2024-05-31', expiryDate: '2025-12-30', status: 'active', createTime: '2024-05-30' },
            { id: 13, customerName: '天合光能', customerNameEn: 'Trina Solar', account: 'trina013', password: 'admin', contactPerson: '许工', contactPhone: '13800138013', siteCount: 2, deviceCount: 29, edition: 'basic', activateTime: '2024-06-16', expiryDate: '2026-06-15', status: 'active', createTime: '2024-06-15' },
            { id: 14, customerName: '南方电网', customerNameEn: 'China Southern Power Grid', account: 'csg014', password: 'admin', contactPerson: '胡主任', contactPhone: '13800138014', siteCount: 6, deviceCount: 95, edition: 'professional', activateTime: '2024-01-21', expiryDate: '2026-01-20', status: 'active', createTime: '2024-01-20' },
            { id: 15, customerName: '理想汽车', customerNameEn: 'Li Auto', account: 'lixiang015', password: 'admin', contactPerson: '杨总', contactPhone: '13800138015', siteCount: 1, deviceCount: 18, edition: 'basic', activateTime: '2024-07-26', expiryDate: '2025-12-20', status: 'active', createTime: '2024-07-25' },
            { id: 16, customerName: '正泰电器', customerNameEn: 'CHINT Electric', account: 'chint016', password: 'admin', contactPerson: '徐经理', contactPhone: '13800138016', siteCount: 2, deviceCount: 35, edition: 'basic', activateTime: '2024-03-19', expiryDate: '2026-03-18', status: 'active', createTime: '2024-03-18' },
            { id: 17, customerName: '亿纬锂能', customerNameEn: 'EVE Energy', account: 'eve017', password: 'admin', contactPerson: '黄总监', contactPhone: '13800138017', siteCount: 3, deviceCount: 41, edition: 'professional', activateTime: '2024-04-09', expiryDate: '2026-04-08', status: 'active', createTime: '2024-04-08' },
            { id: 18, customerName: '远景能源', customerNameEn: 'Envision Energy', account: 'envision018', password: 'admin', contactPerson: '沈工', contactPhone: '13800138018', siteCount: 2, deviceCount: 26, edition: 'basic', activateTime: '2024-05-13', expiryDate: '2026-05-12', status: 'active', createTime: '2024-05-12' },
            { id: 19, customerName: '中天科技', customerNameEn: 'ZTT Technology', account: 'zttic019', password: 'admin', contactPerson: '朱经理', contactPhone: '13800138019', siteCount: 1, deviceCount: 24, edition: 'basic', activateTime: '2024-11-01', expiryDate: '2026-01-10', status: 'active', createTime: '2024-11-01' },
            { id: 20, customerName: '科士达', customerNameEn: 'Kstar', account: 'kstar020', password: 'admin', contactPerson: '唐总', contactPhone: '13800138020', siteCount: 2, deviceCount: 31, edition: 'basic', activateTime: '2024-11-15', expiryDate: '2026-07-15', status: 'active', createTime: '2024-11-15' }
        ],

        getList: async function(params = {}) {
            await MockAPI.delay();
            const { page = 1, pageSize = 10, keyword = '', industry = '', sortField = '', sortOrder = '' } = params;

            let filteredData = this.data;
            if (keyword) {
                filteredData = filteredData.filter(item =>
                    item.customerName.includes(keyword) ||
                    item.contactPerson.includes(keyword) ||
                    item.contactPhone.includes(keyword)
                );
            }
            if (industry) {
                filteredData = filteredData.filter(item => item.industry === industry);
            }

            // 排序
            if (sortField && sortOrder) {
                filteredData.sort((a, b) => {
                    let aVal = a[sortField];
                    let bVal = b[sortField];

                    // 处理日期类型字段
                    if (sortField === 'expiryDate' || sortField === 'activateTime' || sortField === 'createTime') {
                        aVal = new Date(aVal).getTime();
                        bVal = new Date(bVal).getTime();
                    }

                    // 升序或降序
                    if (sortOrder === 'asc') {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });
            }

            const total = filteredData.length;
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const list = filteredData.slice(start, end);

            return {
                success: true,
                data: {
                    list,
                    total,
                    page,
                    pageSize
                }
            };
        },

        getById: async function(id) {
            await MockAPI.delay();
            const item = this.data.find(c => c.id === parseInt(id));
            return {
                success: !!item,
                data: item,
                message: item ? '获取成功' : '客户不存在'
            };
        },

        create: async function(data) {
            await MockAPI.delay();
            const newCustomer = {
                id: MockAPI.generateId(),
                ...data,
                deviceCount: 0,
                status: 'active',
                createTime: new Date().toISOString().split('T')[0]
            };
            this.data.unshift(newCustomer);
            return {
                success: true,
                data: newCustomer,
                message: '创建成功'
            };
        },

        update: async function(id, data) {
            await MockAPI.delay();
            const index = this.data.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...data };
                return {
                    success: true,
                    data: this.data[index],
                    message: '更新成功'
                };
            }
            return {
                success: false,
                message: '客户不存在'
            };
        },

        delete: async function(id) {
            await MockAPI.delay();
            const index = this.data.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                this.data.splice(index, 1);
                return {
                    success: true,
                    message: '删除成功'
                };
            }
            return {
                success: false,
                message: '客户不存在'
            };
        },

        /**
         * 获取客户统计数据
         */
        getStats: async function() {
            await MockAPI.delay();

            const totalCustomers = this.data.length;
            const basicCustomers = this.data.filter(c => c.edition === 'basic').length;
            const professionalCustomers = this.data.filter(c => c.edition === 'professional').length;

            // 计算使用中客户（状态为active的）
            const activeCustomers = this.data.filter(c => c.status === 'active').length;

            // 计算新增客户（今日创建的）
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const newCustomers = this.data.filter(c => {
                const createDate = new Date(c.createTime);
                const createDay = new Date(createDate.getFullYear(), createDate.getMonth(), createDate.getDate());
                return createDay.getTime() === today.getTime();
            }).length;

            // 计算快到期客户（30天内到期）
            const thirtyDaysLater = new Date();
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
            const expiringCustomers = this.data.filter(c => {
                const expiryDate = new Date(c.expiryDate);
                return expiryDate >= now && expiryDate <= thirtyDaysLater;
            }).length;

            // 计算增长率（模拟数据）
            const growthRate = 12.3;

            return {
                success: true,
                data: {
                    totalCustomers,
                    activeCustomers,
                    basicCustomers,
                    professionalCustomers,
                    newCustomers,
                    expiringCustomers,
                    growthRate
                }
            };
        },

        /**
         * 获取快到期客户详情列表
         */
        getExpiringCustomers: async function() {
            await MockAPI.delay();

            const now = new Date();
            const thirtyDaysLater = new Date();
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

            const expiringList = this.data
                .filter(c => {
                    const expiryDate = new Date(c.expiryDate);
                    return expiryDate >= now && expiryDate <= thirtyDaysLater;
                })
                .map(c => {
                    const expiryDate = new Date(c.expiryDate);
                    const remainingDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
                    return {
                        ...c,
                        remainingDays
                    };
                })
                .sort((a, b) => a.remainingDays - b.remainingDays); // 按剩余天数升序排序

            return {
                success: true,
                data: expiringList
            };
        }
    },

    /**
     * 计费模板数据
     */
    pricingTemplates: {
        data: [
            { id: 1, templateName: '北京市工商业电价模板', peakPrice: 1.2856, flatPrice: 0.7729, valleyPrice: 0.3946, effectiveDate: '2024-01-01', region: '北京', status: 'active' },
            { id: 2, templateName: '上海市工商业电价模板', peakPrice: 1.3245, flatPrice: 0.8012, valleyPrice: 0.4123, effectiveDate: '2024-01-01', region: '上海', status: 'active' },
            { id: 3, templateName: '广东省工商业电价模板', peakPrice: 1.2456, flatPrice: 0.7589, valleyPrice: 0.3856, effectiveDate: '2024-02-01', region: '广东', status: 'active' },
            { id: 4, templateName: '江苏省工商业电价模板', peakPrice: 1.2978, flatPrice: 0.7845, valleyPrice: 0.4012, effectiveDate: '2024-01-15', region: '江苏', status: 'active' },
            { id: 5, templateName: '浙江省工商业电价模板', peakPrice: 1.3156, flatPrice: 0.7923, valleyPrice: 0.4089, effectiveDate: '2024-03-01', region: '浙江', status: 'active' },
            { id: 6, templateName: '山东省工商业电价模板', peakPrice: 1.1845, flatPrice: 0.7234, valleyPrice: 0.3678, effectiveDate: '2024-01-01', region: '山东', status: 'active' },
            { id: 7, templateName: '福建省工商业电价模板', peakPrice: 1.2234, flatPrice: 0.7456, valleyPrice: 0.3789, effectiveDate: '2024-02-15', region: '福建', status: 'active' },
            { id: 8, templateName: '四川省工商业电价模板', peakPrice: 1.0923, flatPrice: 0.6789, valleyPrice: 0.3456, effectiveDate: '2024-01-01', region: '四川', status: 'active' }
        ],

        getList: async function(params = {}) {
            await MockAPI.delay();
            const { page = 1, pageSize = 10, keyword = '' } = params;

            let filteredData = this.data;
            if (keyword) {
                filteredData = filteredData.filter(item =>
                    item.templateName.includes(keyword) ||
                    item.region.includes(keyword)
                );
            }

            const total = filteredData.length;
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const list = filteredData.slice(start, end);

            return {
                success: true,
                data: {
                    list,
                    total,
                    page,
                    pageSize
                }
            };
        },

        getById: async function(id) {
            await MockAPI.delay();
            const item = this.data.find(p => p.id === parseInt(id));
            return {
                success: !!item,
                data: item,
                message: item ? '获取成功' : '模板不存在'
            };
        },

        create: async function(data) {
            await MockAPI.delay();
            const newTemplate = {
                id: MockAPI.generateId(),
                ...data,
                effectiveDate: new Date().toISOString().split('T')[0],
                status: 'active'
            };
            this.data.unshift(newTemplate);
            return {
                success: true,
                data: newTemplate,
                message: '创建成功'
            };
        },

        update: async function(id, data) {
            await MockAPI.delay();
            const index = this.data.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...data };
                return {
                    success: true,
                    data: this.data[index],
                    message: '更新成功'
                };
            }
            return {
                success: false,
                message: '模板不存在'
            };
        },

        delete: async function(id) {
            await MockAPI.delay();
            const index = this.data.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                this.data.splice(index, 1);
                return {
                    success: true,
                    message: '删除成功'
                };
            }
            return {
                success: false,
                message: '模板不存在'
            };
        }
    },

    /**
     * 菜单权限数据
     */
    menus: {
        data: [
            // 一级目录：系统管理
            { id: 1, name: '系统管理', nameEn: 'System Management', type: 'directory', path: null, icon: 'bi-gear-fill', parentId: null, sort: 1, status: 'active' },

            // 二级菜单：版本管理
            { id: 2, name: '版本管理', nameEn: 'Version Management', type: 'menu', path: '/version', icon: 'bi-tags', parentId: 1, sort: 1, status: 'active' },
            { id: 21, name: '新增版本', nameEn: 'Create Version', type: 'button', path: null, icon: 'bi-plus-circle', parentId: 2, sort: 1, status: 'active' },
            { id: 22, name: '编辑版本', nameEn: 'Edit Version', type: 'button', path: null, icon: 'bi-pencil', parentId: 2, sort: 2, status: 'active' },
            { id: 23, name: '删除版本', nameEn: 'Delete Version', type: 'button', path: null, icon: 'bi-trash', parentId: 2, sort: 3, status: 'active' },

            // 二级菜单：客户管理
            { id: 3, name: '客户管理', nameEn: 'Customer Management', type: 'menu', path: '/customer', icon: 'bi-people', parentId: 1, sort: 2, status: 'active' },
            { id: 31, name: '新增客户', nameEn: 'Create Customer', type: 'button', path: null, icon: 'bi-plus-circle', parentId: 3, sort: 1, status: 'active' },
            { id: 32, name: '编辑客户', nameEn: 'Edit Customer', type: 'button', path: null, icon: 'bi-pencil', parentId: 3, sort: 2, status: 'active' },
            { id: 33, name: '删除客户', nameEn: 'Delete Customer', type: 'button', path: null, icon: 'bi-trash', parentId: 3, sort: 3, status: 'active' },
            { id: 34, name: '查看详情', nameEn: 'View Details', type: 'button', path: null, icon: 'bi-eye', parentId: 3, sort: 4, status: 'active' },

            // 二级菜单：菜单配置
            { id: 41, name: '菜单配置', nameEn: 'Menu Configuration', type: 'menu', path: '/menu/config', icon: 'bi-list-check', parentId: 1, sort: 3, status: 'active' },
            { id: 42, name: '新增菜单', nameEn: 'Create Menu', type: 'button', path: null, icon: 'bi-plus-circle', parentId: 41, sort: 1, status: 'active' },
            { id: 43, name: '编辑菜单', nameEn: 'Edit Menu', type: 'button', path: null, icon: 'bi-pencil', parentId: 41, sort: 2, status: 'active' },
            { id: 44, name: '删除菜单', nameEn: 'Delete Menu', type: 'button', path: null, icon: 'bi-trash', parentId: 41, sort: 3, status: 'active' }
        ],

        getList: async function() {
            await MockAPI.delay();
            // 构建树形结构
            const buildTree = (items, parentId = null) => {
                return items
                    .filter(item => item.parentId === parentId)
                    .sort((a, b) => a.sort - b.sort)
                    .map(item => ({
                        ...item,
                        children: buildTree(items, item.id)
                    }));
            };

            return {
                success: true,
                data: {
                    list: this.data,
                    tree: buildTree(this.data)
                }
            };
        },

        getTree: async function() {
            await MockAPI.delay();
            const buildTree = (items, parentId = null) => {
                return items
                    .filter(item => item.parentId === parentId)
                    .sort((a, b) => a.sort - b.sort)
                    .map(item => ({
                        ...item,
                        children: buildTree(items, item.id)
                    }));
            };

            return {
                success: true,
                data: buildTree(this.data)
            };
        },

        getById: async function(id) {
            await MockAPI.delay();
            const item = this.data.find(m => m.id === parseInt(id));
            return {
                success: !!item,
                data: item,
                message: item ? '获取成功' : '菜单不存在'
            };
        },

        create: async function(data) {
            await MockAPI.delay();
            const newMenu = {
                id: MockAPI.generateId(),
                ...data,
                status: data.status || 'active'
            };
            this.data.push(newMenu);
            return {
                success: true,
                data: newMenu,
                message: '创建成功'
            };
        },

        update: async function(id, data) {
            await MockAPI.delay();
            const index = this.data.findIndex(m => m.id === parseInt(id));
            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...data };
                return {
                    success: true,
                    data: this.data[index],
                    message: '更新成功'
                };
            }
            return {
                success: false,
                message: '菜单不存在'
            };
        },

        delete: async function(id) {
            await MockAPI.delay();
            // 检查是否有子菜单
            const hasChildren = this.data.some(m => m.parentId === parseInt(id));
            if (hasChildren) {
                return {
                    success: false,
                    message: '该菜单下有子菜单，无法删除'
                };
            }

            const index = this.data.findIndex(m => m.id === parseInt(id));
            if (index !== -1) {
                this.data.splice(index, 1);
                return {
                    success: true,
                    message: '删除成功'
                };
            }
            return {
                success: false,
                message: '菜单不存在'
            };
        }
    },

    /**
     * 权限模板数据
     */
    permissionTemplates: {
        data: [
            {
                id: 1,
                name: '管理员权限模板',
                description: '拥有系统所有功能权限,包括用户管理、系统配置等',
                menuIds: [2, 3, 41],
                isDefault: true,
                createTime: '2024-01-01'
            },
            {
                id: 2,
                name: '普通用户权限模板',
                description: '仅包含基础查看和操作权限,不包含管理功能',
                menuIds: [2, 3],
                isDefault: false,
                createTime: '2024-01-15'
            },
            {
                id: 3,
                name: '客服权限模板',
                description: '客户管理相关权限,可查看和管理客户信息',
                menuIds: [3],
                isDefault: false,
                createTime: '2024-02-01'
            }
        ],

        getList: async function(params = {}) {
            await MockAPI.delay();
            const { page = 1, pageSize = 10 } = params;

            const total = this.data.length;
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const list = this.data.slice(start, end);

            return {
                success: true,
                data: {
                    list,
                    total,
                    page,
                    pageSize
                }
            };
        },

        getById: async function(id) {
            await MockAPI.delay();
            const item = this.data.find(t => t.id === parseInt(id));
            return {
                success: !!item,
                data: item,
                message: item ? '获取成功' : '权限模板不存在'
            };
        },

        create: async function(data) {
            await MockAPI.delay();
            const newTemplate = {
                id: MockAPI.generateId(),
                ...data,
                createTime: new Date().toISOString().split('T')[0]
            };
            this.data.unshift(newTemplate);
            return {
                success: true,
                data: newTemplate,
                message: '创建成功'
            };
        },

        update: async function(id, data) {
            await MockAPI.delay();
            const index = this.data.findIndex(t => t.id === parseInt(id));
            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...data };
                return {
                    success: true,
                    data: this.data[index],
                    message: '更新成功'
                };
            }
            return {
                success: false,
                message: '权限模板不存在'
            };
        },

        delete: async function(id) {
            await MockAPI.delay();
            const template = this.data.find(t => t.id === parseInt(id));

            // 不允许删除默认模板
            if (template && template.isDefault) {
                return {
                    success: false,
                    message: '默认模板不能删除'
                };
            }

            const index = this.data.findIndex(t => t.id === parseInt(id));
            if (index !== -1) {
                this.data.splice(index, 1);
                return {
                    success: true,
                    message: '删除成功'
                };
            }
            return {
                success: false,
                message: '权限模板不存在'
            };
        }
    },

    /**
     * 统计数据
     */
    statistics: {
        getDashboardStats: async function() {
            await MockAPI.delay();
            return {
                success: true,
                data: {
                    totalVersions: 25,
                    totalCustomers: 156,
                    totalDevices: 1245,
                    activeDevices: 1198,
                    versionTrend: [
                        { month: '7月', count: 2 },
                        { month: '8月', count: 3 },
                        { month: '9月', count: 3 },
                        { month: '10月', count: 2 },
                        { month: '11月', count: 2 },
                        { month: '12月', count: 1 }
                    ],
                    customerDistribution: [
                        { name: '电力能源', value: 45 },
                        { name: '新能源汽车', value: 38 },
                        { name: '光伏系统', value: 32 },
                        { name: '电池制造', value: 25 },
                        { name: '其他', value: 16 }
                    ],
                    deviceStatus: [
                        { name: '在线', value: 1198 },
                        { name: '离线', value: 47 }
                    ]
                }
            };
        }
    }
};

// 导出到全局
if (typeof window !== 'undefined') {
    window.MockAPI = MockAPI;
}
