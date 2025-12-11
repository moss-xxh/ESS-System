/**
 * Hash路由管理
 * 实现单页应用的路由功能
 */
const Router = {
    // 路由配置
    routes: {},

    // 当前路由
    currentRoute: '',

    // 初始化路由
    init: function() {
        // 注册路由
        this.registerRoutes();

        // 监听hash变化
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // 初始加载
        this.handleRouteChange();
    },

    /**
     * 注册所有路由
     */
    registerRoutes: function() {
        this.routes = {
            '/version': {
                title: 'menu.version',
                handler: this.loadVersion
            },
            '/customer': {
                title: 'customer.management',
                handler: this.loadCustomer
            },
            '/menu/config': {
                title: 'menu.menuConfig',
                handler: this.loadMenuConfig
            },
            '/system/password': {
                title: 'menu.changePassword',
                handler: this.loadChangePassword
            }
        };
    },

    /**
     * 处理路由变化
     */
    handleRouteChange: function() {
        const hash = window.location.hash.slice(1) || '/customer';
        this.currentRoute = hash;

        // 更新菜单高亮
        this.updateMenuActive(hash);

        // 查找路由配置
        const route = this.routes[hash];
        if (route) {
            // 更新页面标题
            document.title = i18n.t(route.title) + ' - ' + i18n.t('common.systemName');

            // 显示加载动画
            this.showLoading();

            // 执行路由处理函数
            setTimeout(() => {
                route.handler.call(this);
                this.hideLoading();
            }, 200);
        } else {
            // 404 - 默认跳转到客户管理
            window.location.hash = '/customer';
        }
    },

    /**
     * 更新菜单激活状态
     */
    updateMenuActive: function(path) {
        // 移除所有激活状态
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // 添加当前路由的激活状态
        const activeLink = document.querySelector(`.sidebar-nav a[href="#${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');

            // 如果是子菜单，展开父菜单
            const parentCollapse = activeLink.closest('.collapse');
            if (parentCollapse) {
                parentCollapse.classList.add('show');
            }
        }
    },

    /**
     * 显示加载动画
     */
    showLoading: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    },

    /**
     * 隐藏加载动画
     */
    hideLoading: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    },

    /**
     * 渲染页面内容
     */
    renderContent: function(html) {
        const contentArea = document.getElementById('pageContent');
        if (contentArea) {
            contentArea.innerHTML = html;
            contentArea.classList.add('fade-in');

            // 重新应用国际化
            i18n.applyTranslations();
        }
    },

    /**
     * 控制台页面
     */
    loadDashboard: async function() {
        const stats = await MockAPI.statistics.getDashboardStats();

        const html = `
            <div class="page-header">
                <h1 data-i18n="dashboard.title">控制台</h1>
            </div>

            <!-- 统计卡片 -->
            <div class="row mb-4">
                <div class="col-xl-3 col-md-6 mb-3">
                    <div class="stat-card primary">
                        <div class="stat-icon">
                            <i class="bi bi-tags"></i>
                        </div>
                        <div class="stat-value">${stats.data.totalVersions}</div>
                        <div class="stat-label" data-i18n="dashboard.totalVersions">版本总数</div>
                        <div class="stat-trend up">
                            <i class="bi bi-arrow-up"></i> 8.5%
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 mb-3">
                    <div class="stat-card success">
                        <div class="stat-icon">
                            <i class="bi bi-people"></i>
                        </div>
                        <div class="stat-value">${stats.data.totalCustomers}</div>
                        <div class="stat-label" data-i18n="dashboard.totalCustomers">客户总数</div>
                        <div class="stat-trend up">
                            <i class="bi bi-arrow-up"></i> 12.3%
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 mb-3">
                    <div class="stat-card warning">
                        <div class="stat-icon">
                            <i class="bi bi-hdd-rack"></i>
                        </div>
                        <div class="stat-value">${stats.data.totalDevices}</div>
                        <div class="stat-label" data-i18n="dashboard.totalDevices">设备总数</div>
                        <div class="stat-trend up">
                            <i class="bi bi-arrow-up"></i> 5.7%
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 mb-3">
                    <div class="stat-card danger">
                        <div class="stat-icon">
                            <i class="bi bi-broadcast"></i>
                        </div>
                        <div class="stat-value">${stats.data.activeDevices}</div>
                        <div class="stat-label" data-i18n="dashboard.activeDevices">在线设备</div>
                        <div class="stat-trend down">
                            <i class="bi bi-arrow-down"></i> 2.1%
                        </div>
                    </div>
                </div>
            </div>

            <!-- 图表区域 -->
            <div class="row">
                <div class="col-xl-8 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <i class="bi bi-bar-chart me-2"></i>
                            <span data-i18n="dashboard.versionTrend">版本发布趋势</span>
                        </div>
                        <div class="card-body">
                            <div id="versionChart" class="chart-container" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <i class="bi bi-pie-chart me-2"></i>
                            <span data-i18n="dashboard.deviceStatus">设备状态分析</span>
                        </div>
                        <div class="card-body">
                            <div id="deviceChart" class="chart-container" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="bi bi-pie-chart me-2"></i>
                            <span data-i18n="dashboard.customerDistribution">客户分布</span>
                        </div>
                        <div class="card-body">
                            <div id="customerChart" class="chart-container" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderContent(html);

        // 初始化图表
        this.initCharts(stats.data);
    },

    /**
     * 初始化图表
     */
    initCharts: function(data) {
        // 版本发布趋势图
        const versionChart = echarts.init(document.getElementById('versionChart'));
        versionChart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: data.versionTrend.map(item => item.month)
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.versionTrend.map(item => item.count),
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: 'rgba(24, 144, 255, 0.1)'
                },
                itemStyle: {
                    color: '#1890ff'
                }
            }]
        });

        // 设备状态饼图
        const deviceChart = echarts.init(document.getElementById('deviceChart'));
        deviceChart.setOption({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [{
                type: 'pie',
                radius: '70%',
                data: data.deviceStatus,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });

        // 客户分布柱状图
        const customerChart = echarts.init(document.getElementById('customerChart'));
        customerChart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: data.customerDistribution.map(item => item.name)
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.customerDistribution.map(item => item.value),
                type: 'bar',
                itemStyle: {
                    color: '#52c41a'
                }
            }]
        });

        // 响应式调整
        window.addEventListener('resize', () => {
            versionChart.resize();
            deviceChart.resize();
            customerChart.resize();
        });
    },

    /**
     * 版本列表页面
     */
    loadVersionList: async function() {
        const result = await MockAPI.versions.getList({ page: 1, pageSize: 10 });

        const html = `
            <div class="page-header">
                <h1 data-i18n="version.list">版本列表</h1>
                <div>
                    <a href="#/version/create" class="btn btn-primary">
                        <i class="bi bi-plus-circle me-1"></i>
                        <span data-i18n="version.createNew">新增版本</span>
                    </a>
                </div>
            </div>

            <!-- 搜索栏 -->
            <div class="search-bar">
                <div class="row">
                    <div class="col-md-4">
                        <input type="text" class="form-control" placeholder="搜索版本号或名称" id="versionSearch" data-i18n="common.search">
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100" onclick="Router.searchVersions()">
                            <i class="bi bi-search me-1"></i>
                            <span data-i18n="common.search">搜索</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 表格 -->
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th data-i18n="version.versionNumber">版本号</th>
                                    <th data-i18n="version.versionName">版本名称</th>
                                    <th data-i18n="version.releaseDate">发布日期</th>
                                    <th data-i18n="version.fileSize">文件大小</th>
                                    <th data-i18n="version.downloadCount">下载次数</th>
                                    <th data-i18n="common.status">状态</th>
                                    <th data-i18n="common.actions">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${result.data.list.map(item => `
                                    <tr>
                                        <td data-label="ID">${item.id}</td>
                                        <td data-label="版本号">${item.versionNumber}</td>
                                        <td data-label="版本名称">${item.versionName}</td>
                                        <td data-label="发布日期">${item.releaseDate}</td>
                                        <td data-label="文件大小">${item.fileSize}</td>
                                        <td data-label="下载次数">${item.downloadCount}</td>
                                        <td data-label="状态">
                                            <span class="badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                                                ${item.status === 'active' ? '激活' : '归档'}
                                            </span>
                                        </td>
                                        <td data-label="操作">
                                            <div class="action-buttons">
                                                <button class="btn btn-sm btn-primary" onclick="Router.viewVersion(${item.id})">
                                                    <i class="bi bi-eye"></i> <span data-i18n="common.view">查看</span>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="Router.deleteVersion(${item.id})">
                                                    <i class="bi bi-trash"></i> <span data-i18n="common.delete">删除</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- 分页 -->
                    <nav>
                        <ul class="pagination">
                            <li class="page-item disabled"><a class="page-link" href="#">上一页</a></li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">下一页</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        `;

        this.renderContent(html);
    },

    /**
     * 版本创建页面
     */
    loadVersionCreate: function() {
        const html = `
            <div class="page-header">
                <h1 data-i18n="version.createNew">新增版本</h1>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="versionForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="version.versionNumber">版本号 <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" required placeholder="例如: v2.5.0">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="version.versionName">版本名称 <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" required placeholder="例如: 储能柜系统V2.5">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" data-i18n="version.description">版本说明</label>
                            <textarea class="form-control" rows="4" placeholder="请输入版本更新说明"></textarea>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="version.fileSize">文件大小</label>
                                <input type="text" class="form-control" placeholder="例如: 128 MB">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">上传文件</label>
                                <input type="file" class="form-control">
                            </div>
                        </div>
                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle me-1"></i>
                                <span data-i18n="common.save">保存</span>
                            </button>
                            <a href="#/version/list" class="btn btn-secondary ms-2">
                                <i class="bi bi-x-circle me-1"></i>
                                <span data-i18n="common.cancel">取消</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.renderContent(html);

        // 绑定表单提交
        document.getElementById('versionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('版本创建成功！');
            window.location.hash = '/version/list';
        });
    },

    /**
     * 版本升级管理页面
     */
    loadVersionUpgrade: function() {
        const html = `
            <div class="page-header">
                <h1 data-i18n="version.upgrade">升级管理</h1>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="empty-state">
                        <i class="bi bi-cloud-upload"></i>
                        <p>升级管理功能开发中...</p>
                    </div>
                </div>
            </div>
        `;

        this.renderContent(html);
    },

    /**
     * 版本管理页面 - 显示基础版和专业版
     */
    loadVersion: async function() {
        const result = await MockAPI.editions.getList();

        // SVG 图标
        const checkIcon = `<svg class="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm5.707 7.707l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l5.293-5.293a1 1 0 011.414 1.414z"/></svg>`;
        const userIcon = `<svg class="stats-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

        // 定义版本描述
        const editionInfo = {
            1: {
                nameEn: i18n.t('version.basicEditionEn'),
                popular: false,
                description: i18n.t('version.basicDescription')
            },
            2: {
                nameEn: i18n.t('version.professionalEditionEn'),
                popular: true,
                description: i18n.t('version.proDescription')
            }
        };

        const html = `
            <!-- Apple 风格定价区域 -->
            <section class="pricing-section">
                <div class="container-fluid">
                    <!-- 版本卡片 -->
                    <div class="row g-4 justify-content-center">
                        ${result.data.list.map(edition => {
                            const info = editionInfo[edition.id];
                            const isPro = edition.id === 2;

                            return `
                                <div class="col-12 col-lg-6">
                                    <div class="plan-card ${isPro ? 'plan-card-featured' : ''}">
                                        ${info.popular ? '<div class="badge-popular">PRO</div>' : ''}

                                        <div class="card-content">
                                            <!-- 版本名称 -->
                                            <div class="plan-name">${i18n.getCurrentLanguage() === 'en-US' ? edition.nameEn : edition.name}</div>
                                            <div class="plan-name-en">${info.nameEn}</div>

                                            <!-- 用户统计 -->
                                            <div class="stats-section">
                                                <div class="stat-label">${i18n.t('version.userCount')}</div>
                                                <div class="stat-number">${edition.customerCount}</div>
                                            </div>

                                            <!-- 版本描述 -->
                                            <div class="edition-description">
                                                ${info.description}
                                            </div>

                                            <!-- 编辑按钮 -->
                                            <button class="btn-edit"
                                                    onclick="Router.editEdition(${edition.id})">
                                                ${i18n.t('version.editConfig')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        this.renderContent(html);
    },

    /**
     * 编辑版本
     */
    editEdition: async function(id) {
        const result = await MockAPI.editions.getById(id);
        const menusResult = await MockAPI.menus.getList();

        if (!result.success) {
            alert(result.message);
            return;
        }

        const edition = result.data;
        const allMenus = menusResult.data.list;

        // 构建菜单树结构
        const buildMenuTree = (menus, parentId = null) => {
            return menus
                .filter(menu => menu.parentId === parentId)
                .map(menu => {
                    const children = menus.filter(m => m.parentId === menu.id);
                    const hasChildren = children.length > 0;
                    const isChecked = edition.menuIds.includes(menu.id);

                    // 菜单类型徽章
                    const typeBadge = menu.type === 'directory' ?
                        `<span class="menu-type-badge badge-directory">${i18n.t('version.menuTypeDirectory')}</span>` :
                        menu.type === 'button' ?
                        `<span class="menu-type-badge badge-button">${i18n.t('version.menuTypeButton')}</span>` :
                        `<span class="menu-type-badge badge-menu">${i18n.t('version.menuTypeMenu')}</span>`;

                    return `
                        <li class="menu-tree-item">
                            <div class="menu-tree-node">
                                ${hasChildren ?
                                    '<span class="tree-toggle" onclick="Router.toggleMenuTree(this)"><i class="bi bi-chevron-right"></i></span>' :
                                    '<span class="tree-toggle-placeholder"></span>'}
                                <input type="checkbox"
                                    class="menu-tree-checkbox"
                                    value="${menu.id}"
                                    id="menu_${menu.id}"
                                    data-parent="${menu.parentId || ''}"
                                    ${isChecked ? 'checked' : ''}
                                    onchange="Router.handleMenuCheckChange(this)">
                                <i class="${menu.icon} menu-tree-icon"></i>
                                <span class="menu-tree-label">${menu.name}</span>
                                ${typeBadge}
                            </div>
                            ${hasChildren ? `
                                <ul class="menu-tree-children collapsed">
                                    ${buildMenuTree(menus, menu.id)}
                                </ul>
                            ` : ''}
                        </li>
                    `;
                }).join('');
        };

        const menusHtml = `<ul class="menu-tree">${buildMenuTree(allMenus)}</ul>`;

        // 标签页1：基础信息
        const basicContent = `
            <form id="editionForm">
                <div class="form-group mb-3">
                    <label class="form-label">${i18n.t('version.editionNameLabel')} <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="editionName" value="${edition.name}" required>
                </div>

                <div class="form-group mb-3">
                    <label class="form-label">${i18n.t('version.editionCodeLabel')}</label>
                    <input type="text" class="form-control" value="${edition.code}" disabled>
                    <small class="form-text text-muted">${i18n.t('version.editionCodeReadonly')}</small>
                </div>

                <div class="form-group mb-3">
                    <label class="form-label">${i18n.t('version.editionIconLabel')}</label>
                    <div style="display: flex; align-items: flex-start; gap: 16px;">
                        <!-- 图标预览 -->
                        <div id="editionIconPreview" style="width: 80px; height: 80px; border-radius: 12px; border: 2px dashed rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.02); flex-shrink: 0; overflow: hidden;">
                            ${edition.icon ? `<img src="${edition.icon}" style="width: 100%; height: 100%; object-fit: contain;">` : '<i class="bi bi-image" style="font-size: 32px; color: var(--text-secondary);"></i>'}
                        </div>

                        <!-- 上传控制区 -->
                        <div style="flex: 1;">
                            <input type="file" id="editionIconUpload" accept="image/*" style="display: none;" onchange="Router.handleEditionIconUpload(event, ${edition.id})">
                            <input type="hidden" id="editionIcon" value="${edition.icon || ''}">

                            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                                <button type="button" onclick="document.getElementById('editionIconUpload').click()" class="btn btn-sm" style="border-radius: 8px; background: rgba(0, 122, 255, 0.1); color: #007AFF; border: none; padding: 8px 16px; font-size: 14px;">
                                    <i class="bi bi-upload me-1"></i>${i18n.t('version.uploadIcon')}
                                </button>
                                <button type="button" onclick="Router.clearEditionIcon()" class="btn btn-sm" style="border-radius: 8px; background: rgba(255, 59, 48, 0.1); color: #FF3B30; border: none; padding: 8px 16px; font-size: 14px;">
                                    <i class="bi bi-trash me-1"></i>${i18n.t('version.clearIcon')}
                                </button>
                            </div>

                            <small class="form-text text-muted">
                                <i class="bi bi-info-circle me-1"></i>
                                ${i18n.t('version.iconUploadTip')}
                            </small>
                        </div>
                    </div>
                </div>

                <div class="form-group mb-3">
                    <label class="form-label">${i18n.t('version.editionDescriptionLabel')}</label>
                    <textarea class="form-control" id="editionDescription" rows="3">${edition.description}</textarea>
                </div>
            </form>
        `;

        // 标签页2：系统功能
        const featureContent = `
            <div class="form-group mb-3">
                <label class="form-label">${i18n.t('version.availableMenus')} <span class="text-danger">*</span></label>
                <div class="border rounded p-3" style="max-height: 400px; overflow-y: auto;">
                    ${menusHtml}
                </div>
                <small class="form-text text-muted">
                    <i class="bi bi-info-circle me-1"></i>
                    ${i18n.t('version.menuSelectionTip')}
                </small>
            </div>
        `;

        // 标签页3：数据存储
        const isBasic = edition.id === 1;
        const storageContent = `
            <div class="form-group mb-4" id="operationLogRetentionGroup">
                <label class="form-label fw-semibold">${i18n.t('version.operationLogRetention')}</label>
                <div class="d-flex gap-3 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="radio"
                            name="operationLogRetentionType" id="operationLogRetentionTypeCustom"
                            value="custom" checked
                            onchange="Router.toggleRetentionInput('operationLogRetention', false)">
                        <label class="form-check-label" for="operationLogRetentionTypeCustom">
                            ${i18n.t('version.customDays')}
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio"
                            name="operationLogRetentionType" id="operationLogRetentionTypePermanent"
                            value="permanent"
                            onchange="Router.toggleRetentionInput('operationLogRetention', true)">
                        <label class="form-check-label" for="operationLogRetentionTypePermanent">
                            ${i18n.t('version.permanent')}
                        </label>
                    </div>
                </div>
                <div class="input-group" id="operationLogRetentionInputGroup">
                    <input type="number" class="form-control" id="operationLogRetention"
                        value="${edition.operationLog?.retention || 30}" min="1" max="365">
                    <span class="input-group-text">${i18n.t('version.days')}</span>
                </div>
                <small class="form-text text-muted">${i18n.t('version.operationLogTip')}</small>
            </div>

            <hr class="my-4">

            <div class="form-group mb-4" id="dataCycleGroup">
                <label class="form-label fw-semibold">${i18n.t('version.dataQueryRetention')}</label>
                <div class="d-flex gap-3 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="radio"
                            name="dataCycleType" id="dataCycleTypeCustom"
                            value="custom" ${(edition.dataCycle?.retention || -1) === -1 ? '' : 'checked'}
                            onchange="Router.toggleRetentionInput('dataCycle', false)">
                        <label class="form-check-label" for="dataCycleTypeCustom">
                            ${i18n.t('version.customDays')}
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio"
                            name="dataCycleType" id="dataCycleTypePermanent"
                            value="permanent" ${(edition.dataCycle?.retention || -1) === -1 ? 'checked' : ''}
                            onchange="Router.toggleRetentionInput('dataCycle', true)">
                        <label class="form-check-label" for="dataCycleTypePermanent">
                            ${i18n.t('version.permanent')}
                        </label>
                    </div>
                </div>
                <div class="input-group" id="dataCycleInputGroup" style="display: ${(edition.dataCycle?.retention || -1) === -1 ? 'none' : 'flex'};">
                    <input type="number" class="form-control" id="dataCycle"
                        value="${(edition.dataCycle?.retention || -1) === -1 ? 30 : edition.dataCycle.retention}" min="1" max="365">
                    <span class="input-group-text">${i18n.t('version.days')}</span>
                </div>
                <small class="form-text text-muted">${i18n.t('version.dataQueryTip')}</small>
            </div>

            <hr class="my-4">

            <h6 class="mb-3">${i18n.t('version.otherSettings')}</h6>

            <div class="form-group mb-3">
                <label class="form-label fw-semibold">${i18n.t('version.notificationMethod')}</label>
                <div class="d-flex gap-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="notifyEmail"
                            ${edition.notification?.email !== false ? 'checked' : ''}>
                        <label class="form-check-label" for="notifyEmail">
                            <i class="bi bi-envelope me-1"></i>${i18n.t('version.emailNotify')}
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="notifySms"
                            ${edition.notification?.sms !== false ? 'checked' : ''}>
                        <label class="form-check-label" for="notifySms">
                            <i class="bi bi-chat-dots me-1"></i>${i18n.t('version.smsNotify')}
                        </label>
                    </div>
                </div>
                <small class="form-text text-muted">${i18n.t('version.notificationTip')}</small>
            </div>
        `;

        // 填充模态框内容
        document.getElementById('basicContent').innerHTML = basicContent;
        document.getElementById('featureContent').innerHTML = featureContent;
        document.getElementById('storageContent').innerHTML = storageContent;

        // 绑定保存按钮
        document.getElementById('saveEditionBtn').onclick = () => this.saveEdition(id);

        // 显示模态框
        const modal = new bootstrap.Modal(document.getElementById('editionModal'));
        modal.show();
    },

    /**
     * 保存版本
     */
    saveEdition: async function(id) {
        const name = document.getElementById('editionName').value.trim();
        const description = document.getElementById('editionDescription').value.trim();
        const icon = document.getElementById('editionIcon').value;

        // 收集选中的菜单
        const menuCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="menu_"]:checked');
        const menuIds = Array.from(menuCheckboxes).map(cb => parseInt(cb.value));

        // 辅助函数:获取保留天数值(-1表示长期有效)
        const getRetentionValue = (fieldId) => {
            const isPermanent = document.getElementById(`${fieldId}TypePermanent`)?.checked;
            if (isPermanent) return -1;
            const value = parseInt(document.getElementById(fieldId)?.value || 30);
            return value;
        };

        // 收集其他设置
        const operationLogRetention = getRetentionValue('operationLog');
        const dataCycleRetention = getRetentionValue('dataCycle');
        const notifyEmail = document.getElementById('notifyEmail')?.checked || false;
        const notifySms = document.getElementById('notifySms')?.checked || false;

        // 验证
        if (!name) {
            alert(i18n.t('version.pleaseEnterName'));
            return;
        }

        if (menuIds.length === 0) {
            alert(i18n.t('version.pleaseSelectMenu'));
            return;
        }

        this.showLoading();

        try {
            const result = await MockAPI.editions.update(id, {
                name,
                description,
                icon,
                menuIds,
                operationLog: {
                    retention: operationLogRetention
                },
                dataCycle: {
                    retention: dataCycleRetention
                },
                notification: {
                    email: notifyEmail,
                    sms: notifySms
                }
            });














            if (result.success) {
                alert(i18n.t('version.saveSuccess'));
                // 关闭模态框
                const modal = bootstrap.Modal.getInstance(document.getElementById('editionModal'));
                if (modal) {
                    modal.hide();
                }
                this.loadVersion(); // 刷新页面
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('保存失败:', error);
            alert(i18n.t('version.saveFailed'));
        } finally {
            this.hideLoading();
        }
    },

    /**
     * 客户管理页面(包含汇总数据和列表)
     */
    loadCustomer: async function(sortConfig = null, statusFilter = null) {
        const stats = await MockAPI.customers.getStats();

        // 构建API请求参数
        const apiParams = { page: 1, pageSize: 10 };
        if (sortConfig && sortConfig.field && sortConfig.order) {
            apiParams.sortField = sortConfig.field;
            apiParams.sortOrder = sortConfig.order;
        }

        const result = await MockAPI.customers.getList(apiParams);

        // 状态筛选处理
        if (statusFilter) {
            const now = new Date();
            result.data.list = result.data.list.filter(customer => {
                const activateDate = new Date(customer.activateTime);
                const expiryDate = new Date(customer.expiryDate);

                if (statusFilter === 'inactive') {
                    // 未服务
                    return customer.status === 'inactive';
                } else if (statusFilter === 'expired') {
                    // 已过期（且账户状态为active）
                    return customer.status !== 'inactive' && now > expiryDate;
                } else if (statusFilter === 'active') {
                    // 服务中
                    return customer.status === 'active' && now >= activateDate && now <= expiryDate;
                }
                return true;
            });
        }

        // 排序处理
        if (sortConfig && sortConfig.field) {
            result.data.list.sort((a, b) => {
                let valueA, valueB;

                if (sortConfig.field === 'expiryDate') {
                    valueA = new Date(a.expiryDate);
                    valueB = new Date(b.expiryDate);
                } else if (sortConfig.field === 'siteCount') {
                    valueA = a.siteCount;
                    valueB = b.siteCount;
                } else if (sortConfig.field === 'deviceCount') {
                    valueA = a.deviceCount;
                    valueB = b.deviceCount;
                }

                if (sortConfig.order === 'asc') {
                    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
                } else {
                    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
                }
            });
        }

        // 缓存当前客户数据，用于导出功能
        this._currentCustomerData = result.data.list;

        const html = `
            <!-- 汇总数据卡片 - 苹果风格 -->
            <div class="row g-4 mb-5">
                <!-- 左侧大卡片：客户总数 -->
                <div class="col-lg-6 col-md-12">
                    <div class="plan-card" style="cursor: default; height: 100%;">
                        <div class="card-content" style="padding: 24px; display: flex; flex-direction: column; height: 100%;">
                            <!-- 图标区域 -->
                            <div class="d-flex align-items-center mb-3">
                                <div style="width: 52px; height: 52px; background: rgba(0, 122, 255, 0.08); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-people" style="font-size: 24px; color: var(--apple-blue);"></i>
                                </div>
                            </div>

                            <!-- 数据统计区域 -->
                            <div class="d-flex gap-4 align-items-center mb-3">
                                <!-- 客户总数 -->
                                <div style="flex: 1;">
                                    <div class="stat-number mb-0" style="line-height: 1.1; font-size: 40px; font-weight: 700; letter-spacing: -0.5px;">${stats.data.totalCustomers}</div>
                                    <div class="stat-label" style="font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-top: 8px;">${i18n.t('customer.totalCustomers')}</div>
                                </div>

                                <!-- 竖向分隔线 -->
                                <div style="width: 1px; height: 60px; background: rgba(0, 0, 0, 0.1);"></div>

                                <!-- 使用中客户 -->
                                <div style="flex: 1;">
                                    <div class="stat-number mb-0" style="line-height: 1.1; font-size: 40px; font-weight: 700; letter-spacing: -0.5px;">${stats.data.activeCustomers}</div>
                                    <div class="stat-label" style="font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-top: 8px;">${i18n.t('customer.activeCustomers')}</div>
                                </div>
                            </div>

                            <!-- 版本分布区域 -->
                            <div style="flex-grow: 1; margin-top: 24px;">
                                <!-- 版本列表 -->
                                <div class="d-flex justify-content-between align-items-center gap-4 mb-3">
                                    <!-- 基础版 -->
                                    <div class="d-flex align-items-center gap-2">
                                        <span style="font-size: 14px; color: var(--text-primary);">${i18n.t('customer.basicEditionShort')}</span>
                                        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${stats.data.basicCustomers}</span>
                                        <span style="font-size: 14px; font-weight: 400; color: var(--text-secondary);">${((stats.data.basicCustomers/stats.data.totalCustomers)*100).toFixed(1)}%</span>
                                    </div>

                                    <!-- 专业版 -->
                                    <div class="d-flex align-items-center gap-2">
                                        <span style="font-size: 14px; color: var(--text-primary);">${i18n.t('customer.professionalEditionShort')}</span>
                                        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${stats.data.professionalCustomers}</span>
                                        <span style="font-size: 14px; font-weight: 400; color: var(--text-secondary);">${((stats.data.professionalCustomers/stats.data.totalCustomers)*100).toFixed(1)}%</span>
                                    </div>
                                </div>

                                <!-- 进度条 -->
                                <div class="progress" style="height: 8px; background: rgba(0, 0, 0, 0.05); border-radius: 4px; overflow: hidden; margin-top: 16px;">
                                    <div class="progress-bar" style="background: #FF9500; width: ${((stats.data.professionalCustomers/stats.data.totalCustomers)*100).toFixed(1)}%; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                                    <div class="progress-bar" style="background: #007AFF; width: ${((stats.data.basicCustomers/stats.data.totalCustomers)*100).toFixed(1)}%; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧小卡片组 -->
                <div class="col-lg-6 col-md-12">
                    <div class="row g-4">
                        <!-- 新增客户卡片 -->
                        <div class="col-12">
                            <div class="plan-card" style="cursor: pointer; transition: all 0.3s; height: 100%;"
                                 onclick="Router.showNewCustomerPreview()"
                                 onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'"
                                 onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.03)'">
                                <div class="card-content" style="padding: 24px; display: flex; align-items: center; gap: 16px; height: 100%;">
                                    <div style="width: 52px; height: 52px; background: rgba(0, 122, 255, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <i class="bi bi-person-plus-fill" style="font-size: 24px; color: #007AFF;"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <div class="stat-number mb-0" style="line-height: 1; font-size: 36px; font-weight: 600;">${stats.data.totalCustomers}</div>
                                        <div class="stat-label mb-0" style="font-size: 14px; font-weight: 500; margin-top: 6px; color: var(--text-primary);">${i18n.t('customer.createNew')}</div>
                                        <div style="font-size: 12px; color: var(--text-secondary); font-weight: 400; margin-top: 4px;">${i18n.t('customer.todayNew')}</div>
                                    </div>
                                    <i class="bi bi-chevron-right" style="font-size: 20px; color: var(--text-secondary);"></i>
                                </div>
                            </div>
                        </div>

                        <!-- 快到期客户卡片 -->
                        <div class="col-12">
                            <div class="plan-card" style="cursor: pointer; transition: all 0.3s; height: 100%;"
                                 onclick="Router.showExpiringCustomers()"
                                 onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'"
                                 onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.03)'">
                                <div class="card-content" style="padding: 24px; display: flex; align-items: center; gap: 16px; height: 100%;">
                                    <div style="width: 52px; height: 52px; background: rgba(255, 59, 48, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <i class="bi bi-clock-history" style="font-size: 24px; color: #FF3B30;"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <div class="stat-number mb-0" style="line-height: 1; font-size: 36px; font-weight: 600;">${stats.data.expiringCustomers}</div>
                                        <div class="stat-label mb-0" style="font-size: 14px; font-weight: 500; margin-top: 6px; color: var(--text-primary);">${i18n.t('customer.expiringCustomers')}</div>
                                        <div style="font-size: 12px; color: var(--text-secondary); font-weight: 400; margin-top: 4px;">${i18n.t('customer.expiringIn30Days')}</div>
                                    </div>
                                    <i class="bi bi-chevron-right" style="font-size: 20px; color: var(--text-secondary);"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 工具栏 -->
            <div class="mb-4">
                <!-- 第一行：搜索和筛选 -->
                <div class="d-flex flex-wrap gap-2 mb-3">
                    <input type="text" class="form-control" placeholder="${i18n.t('customer.searchPlaceholder')}" id="customerSearch" style="max-width: 280px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1);">
                    <select class="form-select" id="versionFilter" style="max-width: 160px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1);">
                        <option value="">${i18n.t('customer.allEditions')}</option>
                        <option value="basic">${i18n.t('customer.basicEditionShort')}</option>
                        <option value="professional">${i18n.t('customer.professionalEditionShort')}</option>
                    </select>
                    <select class="form-select" id="statusFilter" style="max-width: 160px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1);">
                        <option value="">${i18n.t('customer.allStatus')}</option>
                        <option value="active">${i18n.t('customer.status.active')}</option>
                        <option value="expired">${i18n.t('customer.status.expired')}</option>
                        <option value="inactive">${i18n.t('customer.status.notStarted')}</option>
                    </select>
                    <button class="btn btn-edit-primary ms-auto" style="border-radius: 10px; padding: 10px 20px;">
                        <i class="bi bi-search me-1"></i>${i18n.t('common.search')}
                    </button>
                    <button class="btn" style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 20px;">
                        <i class="bi bi-arrow-clockwise me-1"></i>${i18n.t('common.reset')}
                    </button>
                </div>

                <!-- 第二行:操作按钮 -->
                <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-edit-primary" onclick="Router.addCustomer()" style="border-radius: 10px; padding: 10px 20px;">
                        <i class="bi bi-plus-circle me-1"></i>
                        <span>${i18n.t('customer.createNew')}</span>
                    </button>
                    <button class="btn" onclick="Router.exportCustomers()"
                            style="border-radius: 10px; padding: 10px 20px; background: white; border: 1.5px solid rgba(0, 0, 0, 0.1); color: var(--text-primary);">
                        <i class="bi bi-download me-1"></i>
                        <span>${i18n.t('customer.exportData')}</span>
                    </button>
                </div>
            </div>

            <!-- 客户列表表格 -->
            <div class="plan-card">
                <div class="card-content" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="table table-hover" style="margin-bottom: 0; white-space: nowrap;">
                            <thead style="background: var(--bg-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06);">
                                <tr>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 160px;">${i18n.t('customer.customerName')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 90px;">${i18n.t('customer.edition')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 90px;">${i18n.t('customer.serviceStatus')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 110px; user-select: none; cursor: default;" id="siteCountHeader">
                                        ${i18n.t('customer.siteCount')}
                                        <span class="sort-arrows" style="display: inline-flex; flex-direction: column; margin-left: 6px; vertical-align: middle; gap: 1px;">
                                            <i class="bi bi-caret-up-fill sort-up" data-field="siteCount" data-order="asc" style="font-size: 11px; line-height: 0.5; cursor: pointer; color: #B0B0B0; transition: color 0.2s;"></i>
                                            <i class="bi bi-caret-down-fill sort-down" data-field="siteCount" data-order="desc" style="font-size: 11px; line-height: 0.5; cursor: pointer; color: #B0B0B0; transition: color 0.2s;"></i>
                                        </span>
                                    </th>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 110px; user-select: none; cursor: default;" id="deviceCountHeader">
                                        ${i18n.t('customer.deviceCount')}
                                        <span class="sort-arrows" style="display: inline-flex; flex-direction: column; margin-left: 6px; vertical-align: middle; gap: 1px;">
                                            <i class="bi bi-caret-up-fill sort-up" data-field="deviceCount" data-order="asc" style="font-size: 11px; line-height: 0.5; cursor: pointer; color: #B0B0B0; transition: color 0.2s;"></i>
                                            <i class="bi bi-caret-down-fill sort-down" data-field="deviceCount" data-order="desc" style="font-size: 11px; line-height: 0.5; cursor: pointer; color: #B0B0B0; transition: color 0.2s;"></i>
                                        </span>
                                    </th>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 130px; user-select: none; cursor: default;" id="expiryDateHeader">
                                        ${i18n.t('customer.expiryDate')}
                                        <span class="sort-arrows" style="display: inline-flex; flex-direction: column; margin-left: 6px; vertical-align: middle; gap: 1px;">
                                            <i class="bi bi-caret-up-fill sort-up" data-field="expiryDate" data-order="asc" style="font-size: 11px; line-height: 0.5; cursor: pointer; color: #B0B0B0; transition: color 0.2s;"></i>
                                            <i class="bi bi-caret-down-fill sort-down" data-field="expiryDate" data-order="desc" style="font-size: 11px; line-height: 0.5; cursor: pointer; color: #B0B0B0; transition: color 0.2s;"></i>
                                        </span>
                                    </th>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 100px; text-align: center;">${i18n.t('customer.accountStatus')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 500; font-size: 13px; padding: 16px 20px; min-width: 120px;">${i18n.t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${result.data.list.map(item => {
                                    const now = new Date();
                                    const activateDate = new Date(item.activateTime);
                                    const expiryDate = new Date(item.expiryDate);
                                    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
                                    const isExpiring = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                                    const isExpired = daysUntilExpiry <= 0;

                                    // 计算智能状态
                                    let serviceStatus = '';
                                    let statusColor = '';
                                    let statusBg = '';

                                    if (item.status === 'inactive') {
                                        serviceStatus = i18n.t('customer.status.notStarted');
                                        statusColor = '#8E8E93';
                                        statusBg = 'rgba(142, 142, 147, 0.1)';
                                    } else if (isExpired) {
                                        serviceStatus = i18n.t('customer.status.expired');
                                        statusColor = '#FF3B30';
                                        statusBg = 'rgba(255, 59, 48, 0.1)';
                                    } else if (now < activateDate) {
                                        serviceStatus = i18n.t('customer.status.disabled');
                                        statusColor = '#FFCC00';
                                        statusBg = 'rgba(255, 204, 0, 0.1)';
                                    } else {
                                        serviceStatus = i18n.t('customer.status.active');
                                        statusColor = '#34C759';
                                        statusBg = 'rgba(52, 199, 89, 0.1)';
                                    }

                                    // 根据当前语言选择客户名称
                                    const displayName = i18n.getCurrentLanguage() === 'en-US'
                                        ? (item.customerNameEn || item.customerName)
                                        : item.customerName;

                                    return `
                                    <tr style="border-bottom: 1px solid rgba(0, 0, 0, 0.04);">
                                        <td data-label="${i18n.t('customer.customerName')}" style="padding: 16px 20px; color: var(--text-primary); font-size: 15px; font-weight: 500;">${displayName}</td>
                                        <td data-label="${i18n.t('customer.edition')}" style="padding: 16px 20px;">
                                            <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; white-space: nowrap; ${item.edition === 'professional' ? 'background: rgba(255, 149, 0, 0.1); color: #FF9500;' : 'background: rgba(0, 122, 255, 0.1); color: #007AFF;'}">
                                                ${item.edition === 'professional' ? i18n.t('customer.professionalEditionShort') : i18n.t('customer.basicEditionShort')}
                                            </span>
                                        </td>
                                        <td data-label="${i18n.t('customer.serviceStatus')}" style="padding: 16px 20px;">
                                            <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; white-space: nowrap; background: ${statusBg}; color: ${statusColor};">
                                                ${serviceStatus}
                                            </span>
                                        </td>
                                        <td data-label="${i18n.t('customer.siteCount')}" style="padding: 16px 20px; color: var(--text-primary); font-size: 15px; text-align: center;">${item.siteCount}</td>
                                        <td data-label="${i18n.t('customer.deviceCount')}" style="padding: 16px 20px; color: var(--text-primary); font-size: 15px; text-align: center;">${item.deviceCount}</td>
                                        <td data-label="${i18n.t('customer.expiryDate')}" style="padding: 16px 20px;">
                                            <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; white-space: nowrap; ${isExpired ? 'background: rgba(255, 59, 48, 0.1); color: #FF3B30;' : isExpiring ? 'background: rgba(255, 204, 0, 0.1); color: #FFCC00;' : 'background: rgba(52, 199, 89, 0.1); color: #34C759;'}">
                                                ${item.expiryDate}
                                            </span>
                                        </td>
                                        <td data-label="${i18n.t('customer.accountStatus')}" style="padding: 16px 20px; text-align: center;">
                                            <div class="form-check form-switch" style="display: inline-block; padding-left: 0; margin: 0;">
                                                <input class="form-check-input" type="checkbox" ${item.status === 'active' ? 'checked' : ''} onchange="Router.toggleCustomerStatus(${item.id}, this.checked)" style="cursor: pointer; margin: 0; width: 40px; height: 20px;">
                                            </div>
                                        </td>
                                        <td data-label="${i18n.t('common.actions')}" style="padding: 16px 20px;">
                                            <div class="d-flex gap-3 align-items-center">
                                                <i class="bi bi-eye" onclick="Router.viewCustomer(${item.id})" title="查看详情"
                                                   style="font-size: 18px; color: #8E8E93; cursor: pointer; transition: color 0.2s;"
                                                   onmouseenter="this.style.color='#1D1D1F'"
                                                   onmouseleave="this.style.color='#8E8E93'"></i>
                                                <i class="bi bi-trash" onclick="Router.deleteCustomer(${item.id})" title="删除"
                                                   style="font-size: 18px; color: #FF3B30; cursor: pointer; transition: color 0.2s;"
                                                   onmouseenter="this.style.color='#D70015'"
                                                   onmouseleave="this.style.color='#FF3B30'"></i>
                                            </div>
                                        </td>
                                    </tr>
                                `}).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- 分页 -->
                    <nav style="padding: 20px;">
                        <ul class="pagination justify-content-center" style="margin: 0;">
                            <li class="page-item disabled">
                                <a class="page-link" href="#" style="border-radius: 8px; border: 1.5px solid rgba(0, 0, 0, 0.1); color: var(--text-secondary); margin: 0 4px;">上一页</a>
                            </li>
                            <li class="page-item active">
                                <a class="page-link" href="#" style="border-radius: 8px; background: var(--apple-blue); border-color: var(--apple-blue); margin: 0 4px;">1</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#" style="border-radius: 8px; border: 1.5px solid rgba(0, 0, 0, 0.1); color: var(--text-primary); margin: 0 4px;">2</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#" style="border-radius: 8px; border: 1.5px solid rgba(0, 0, 0, 0.1); color: var(--text-primary); margin: 0 4px;">3</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#" style="border-radius: 8px; border: 1.5px solid rgba(0, 0, 0, 0.1); color: var(--text-primary); margin: 0 4px;">下一页</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        `;

        this.renderContent(html);

        // 排序状态管理（在外层作用域，避免重复初始化）
        if (!this._sortState) {
            this._sortState = {
                expiryDate: null,
                siteCount: null,
                deviceCount: null
            };
        }

        // 如果有传入的排序配置，更新状态
        if (sortConfig && sortConfig.field) {
            this._sortState[sortConfig.field] = sortConfig.order;
        }

        const sortState = this._sortState;

        // 更新排序箭头样式
        const updateSortArrows = () => {
            // 获取所有排序箭头
            const allSortArrows = document.querySelectorAll('.sort-up, .sort-down');

            // 重置所有箭头为灰色
            allSortArrows.forEach(arrow => {
                arrow.style.color = '#D1D1D6';
            });

            // 高亮当前激活的排序箭头
            Object.keys(sortState).forEach(field => {
                if (sortState[field]) {
                    const order = sortState[field];
                    const activeArrow = document.querySelector(`.sort-${order === 'asc' ? 'up' : 'down'}[data-field="${field}"]`);
                    if (activeArrow) {
                        activeArrow.style.color = '#007AFF';
                    }
                }
            });
        };

        // 排序处理函数
        const handleSort = (field, order) => {
            // 如果点击的是当前已激活的排序，则取消排序
            if (this._sortState[field] === order) {
                // 取消当前排序
                this._sortState[field] = null;

                // 获取当前状态筛选值
                const statusFilterEl = document.getElementById('statusFilter');
                const currentStatusFilter = statusFilterEl ? (statusFilterEl.value || null) : null;

                // 重新加载数据（无排序）
                this.loadCustomer(null, currentStatusFilter);
            } else {
                // 设置当前列的排序
                this._sortState[field] = order;

                // 重置其他列的排序状态
                Object.keys(this._sortState).forEach(key => {
                    if (key !== field) {
                        this._sortState[key] = null;
                    }
                });

                // 获取当前状态筛选值
                const statusFilterEl = document.getElementById('statusFilter');
                const currentStatusFilter = statusFilterEl ? (statusFilterEl.value || null) : null;

                // 重新加载数据（保持状态筛选）
                this.loadCustomer({ field, order }, currentStatusFilter);
            }
        };

        // 绑定所有排序箭头的点击事件
        const sortArrows = document.querySelectorAll('.sort-up, .sort-down');
        sortArrows.forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const field = arrow.getAttribute('data-field');
                const order = arrow.getAttribute('data-order');
                handleSort(field, order);
            });

            // 添加hover效果
            arrow.addEventListener('mouseenter', () => {
                if (arrow.style.color !== 'rgb(0, 122, 255)') {
                    arrow.style.color = '#8E8E93';
                }
            });
            arrow.addEventListener('mouseleave', () => {
                if (arrow.style.color !== 'rgb(0, 122, 255)') {
                    arrow.style.color = '#D1D1D6';
                }
            });
        });

        // 初始化箭头状态
        updateSortArrows();

        // 绑定状态筛选器
        const statusFilterEl = document.getElementById('statusFilter');
        if (statusFilterEl) {
            statusFilterEl.addEventListener('change', (e) => {
                const filterValue = e.target.value || null;
                // 重置排序状态
                Object.keys(sortState).forEach(key => sortState[key] = null);
                this.loadCustomer(null, filterValue);
            });
        }
    },

    /**
     * 客户列表页面
     */
    loadCustomerList: async function() {
        const result = await MockAPI.customers.getList({ page: 1, pageSize: 10 });

        const html = `
            <div class="page-header">
                <h1 data-i18n="customer.list">客户列表</h1>
                <div>
                    <a href="#/customer/create" class="btn btn-primary">
                        <i class="bi bi-plus-circle me-1"></i>
                        <span data-i18n="customer.createNew">新增客户</span>
                    </a>
                </div>
            </div>

            <!-- 搜索栏 -->
            <div class="search-bar">
                <div class="row">
                    <div class="col-md-4">
                        <input type="text" class="form-control" placeholder="搜索客户名称" data-i18n="common.search">
                    </div>
                    <div class="col-md-3">
                        <select class="form-select">
                            <option value="">所有行业</option>
                            <option value="电力能源">电力能源</option>
                            <option value="新能源汽车">新能源汽车</option>
                            <option value="光伏系统">光伏系统</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100">
                            <i class="bi bi-search me-1"></i>
                            <span data-i18n="common.search">搜索</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 表格 -->
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th data-i18n="customer.customerName">客户名称</th>
                                    <th data-i18n="customer.contactPerson">联系人</th>
                                    <th data-i18n="customer.contactPhone">联系电话</th>
                                    <th data-i18n="customer.industry">所属行业</th>
                                    <th data-i18n="customer.deviceCount">设备数量</th>
                                    <th data-i18n="common.actions">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${result.data.list.map(item => `
                                    <tr>
                                        <td data-label="ID">${item.id}</td>
                                        <td data-label="客户名称">${item.customerName}</td>
                                        <td data-label="联系人">${item.contactPerson}</td>
                                        <td data-label="联系电话">${item.contactPhone}</td>
                                        <td data-label="所属行业">
                                            <span class="tag tag-primary">${item.industry}</span>
                                        </td>
                                        <td data-label="设备数量">${item.deviceCount}</td>
                                        <td data-label="操作">
                                            <div class="action-buttons">
                                                <button class="btn btn-sm btn-primary">
                                                    <i class="bi bi-eye"></i> <span data-i18n="common.view">查看</span>
                                                </button>
                                                <button class="btn btn-sm btn-warning">
                                                    <i class="bi bi-pencil"></i> <span data-i18n="common.edit">编辑</span>
                                                </button>
                                                <button class="btn btn-sm btn-danger">
                                                    <i class="bi bi-trash"></i> <span data-i18n="common.delete">删除</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.renderContent(html);
    },

    /**
     * 客户创建页面
     */
    loadCustomerCreate: function() {
        const html = `
            <div class="page-header">
                <h1 data-i18n="customer.createNew">新增客户</h1>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="customerForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="customer.customerName">客户名称 <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="customer.industry">所属行业 <span class="text-danger">*</span></label>
                                <select class="form-select" required>
                                    <option value="">请选择</option>
                                    <option value="电力能源">电力能源</option>
                                    <option value="新能源汽车">新能源汽车</option>
                                    <option value="光伏系统">光伏系统</option>
                                    <option value="电池制造">电池制造</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="customer.contactPerson">联系人</label>
                                <input type="text" class="form-control">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="customer.contactPhone">联系电话</label>
                                <input type="tel" class="form-control">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="customer.email">邮箱</label>
                                <input type="email" class="form-control">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="customer.address">地址</label>
                                <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle me-1"></i>
                                <span data-i18n="common.save">保存</span>
                            </button>
                            <a href="#/customer/list" class="btn btn-secondary ms-2">
                                <i class="bi bi-x-circle me-1"></i>
                                <span data-i18n="common.cancel">取消</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.renderContent(html);

        document.getElementById('customerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('客户创建成功！');
            window.location.hash = '/customer/list';
        });
    },

    /**
     * 菜单配置页面
     */
    loadMenuConfig: async function() {
        const result = await MockAPI.menus.getList();

        // 递归渲染树形表格行
        const renderTreeRows = (items, level = 0) => {
            return items.map(item => {
                const hasChildren = item.children && item.children.length > 0;
                const indent = level * 32; // 每级缩进32px

                const typeMap = {
                    'menu': { text: i18n.t('menuConfig.typeMenu'), style: 'background: rgba(0, 122, 255, 0.1); color: #007AFF;' },
                    'directory': { text: i18n.t('menuConfig.typeDirectory'), style: 'background: rgba(255, 149, 0, 0.1); color: #FF9500;' },
                    'button': { text: i18n.t('menuConfig.typeButton'), style: 'background: rgba(52, 199, 89, 0.1); color: #34C759;' }
                };
                const typeInfo = typeMap[item.type || 'menu'];

                // 根据当前语言显示菜单名称
                const displayName = i18n.getCurrentLanguage() === 'en-US' ? (item.nameEn || item.name) : item.name;

                let row = `
                    <tr data-id="${item.id}" data-parent-id="${item.parentId || ''}" data-type="${item.type}" data-status="${item.status}" style="border-bottom: 1px solid rgba(0, 0, 0, 0.04);">
                        <td style="padding: 16px 20px; padding-left: ${indent + 20}px; color: var(--text-primary); font-size: 14px;">
                            ${hasChildren ? `<i class="bi bi-chevron-down me-2 cursor-pointer" onclick="Router.toggleMenuRow(${item.id})" style="transition: transform 0.3s; color: var(--text-secondary); font-size: 14px;"></i>` : '<span style="display: inline-block; width: 22px;"></span>'}
                            ${item.icon ? `<i class="${item.icon} me-2" style="color: var(--apple-blue); font-size: 16px;"></i>` : ''}
                            <span style="font-weight: 500;">${displayName}</span>
                        </td>
                        <td style="padding: 16px 20px;">
                            <span style="display: inline-block; padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; ${typeInfo.style}">${typeInfo.text}</span>
                        </td>
                        <td style="padding: 16px 20px; color: var(--text-secondary); font-size: 13px; font-family: 'SF Mono', Monaco, 'Courier New', monospace;">${item.path || '-'}</td>
                        <td style="padding: 16px 20px; color: var(--text-secondary); font-size: 13px; font-family: 'SF Mono', Monaco, 'Courier New', monospace;">${item.icon || '-'}</td>
                        <td style="padding: 16px 20px; text-align: center;">
                            <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(0, 0, 0, 0.04); font-size: 13px; font-weight: 600; color: var(--text-primary);">${item.sort}</span>
                        </td>
                        <td style="padding: 16px 20px; text-align: center;">
                            <div class="form-check form-switch" style="display: inline-block; padding-left: 0; margin: 0;">
                                <input class="form-check-input" type="checkbox" ${item.status === 'active' ? 'checked' : ''} onchange="Router.toggleMenuStatus(${item.id}, this.checked)" style="cursor: pointer; margin: 0; width: 40px; height: 20px;">
                            </div>
                        </td>
                        <td style="padding: 16px 20px;">
                            <div class="d-flex gap-3 align-items-center">
                                <i class="bi bi-plus-circle" onclick="Router.addSubMenu(${item.id})" title="${i18n.t('menuConfig.addSubMenu')}"
                                   style="font-size: 18px; color: #34C759; cursor: pointer; transition: color 0.2s;"
                                   onmouseenter="this.style.color='#28A745'"
                                   onmouseleave="this.style.color='#34C759'"></i>
                                <i class="bi bi-pencil" onclick="Router.editMenu(${item.id})" title="${i18n.t('common.edit')}"
                                   style="font-size: 18px; color: #8E8E93; cursor: pointer; transition: color 0.2s;"
                                   onmouseenter="this.style.color='#1D1D1F'"
                                   onmouseleave="this.style.color='#8E8E93'"></i>
                                <i class="bi bi-trash" onclick="Router.deleteMenu(${item.id})" title="${i18n.t('common.delete')}"
                                   style="font-size: 18px; color: #FF3B30; cursor: pointer; transition: color 0.2s;"
                                   onmouseenter="this.style.color='#D70015'"
                                   onmouseleave="this.style.color='#FF3B30'"></i>
                            </div>
                        </td>
                    </tr>
                `;

                // 递归渲染子菜单
                if (hasChildren) {
                    row += renderTreeRows(item.children, level + 1);
                }

                return row;
            }).join('');
        };

        const html = `
            <!-- 工具栏 -->
            <div class="mb-4">
                <!-- 第一行：筛选 -->
                <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
                    <input type="text" class="form-control" id="menuSearch" placeholder="${i18n.t('menuConfig.searchPlaceholder')}" style="max-width: 280px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1);">
                    <select class="form-select" id="menuTypeFilter" style="max-width: 140px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1);">
                        <option value="">${i18n.t('menuConfig.allTypes')}</option>
                        <option value="menu">${i18n.t('menuConfig.typeMenu')}</option>
                        <option value="directory">${i18n.t('menuConfig.typeDirectory')}</option>
                        <option value="button">${i18n.t('menuConfig.typeButton')}</option>
                    </select>
                    <select class="form-select" id="menuStatusFilter" style="max-width: 140px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1);">
                        <option value="">${i18n.t('menuConfig.allStatus')}</option>
                        <option value="active">${i18n.t('menuConfig.statusActive')}</option>
                        <option value="inactive">${i18n.t('menuConfig.statusInactive')}</option>
                    </select>
                    <div style="margin-left: auto; display: flex; gap: 8px;">
                        <button class="btn btn-edit-primary" onclick="Router.filterMenuTable()" style="border-radius: 10px; padding: 10px 20px;">
                            <i class="bi bi-search me-1"></i>${i18n.t('menuConfig.query')}
                        </button>
                        <button class="btn" onclick="Router.resetMenuFilter()" style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 20px;">
                            <i class="bi bi-arrow-clockwise me-1"></i>${i18n.t('menuConfig.reset')}
                        </button>
                    </div>
                </div>

                <!-- 第二行：操作按钮 -->
                <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-edit-primary" onclick="Router.addMenu()" style="border-radius: 10px; padding: 10px 20px;">
                        <i class="bi bi-plus-circle me-1"></i>${i18n.t('menuConfig.createMenu')}
                    </button>
                    <button class="btn" onclick="Router.expandAllMenus()" style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 20px;">
                        <i class="bi bi-arrows-expand"></i> ${i18n.t('menuConfig.expandAll')}
                    </button>
                    <button class="btn" onclick="Router.collapseAllMenus()" style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 20px;">
                        <i class="bi bi-arrows-collapse"></i> ${i18n.t('menuConfig.collapseAll')}
                    </button>
                </div>
            </div>

            <!-- 菜单树表格 -->
            <div class="plan-card">
                <div class="card-content" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="table table-hover" id="menuTable" style="margin-bottom: 0;">
                            <thead style="background: var(--bg-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06);">
                                <tr>
                                    <th style="color: var(--text-secondary); font-weight: 600; font-size: 12px; padding: 16px 20px; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t('menuConfig.menuName')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 600; font-size: 12px; padding: 16px 20px; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t('menuConfig.type')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 600; font-size: 12px; padding: 16px 20px; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t('menuConfig.path')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 600; font-size: 12px; padding: 16px 20px; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t('menuConfig.icon')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 600; font-size: 12px; padding: 16px 20px; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t('menuConfig.sort')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 600; font-size: 12px; padding: 16px 20px; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t('menuConfig.status')}</th>
                                    <th style="color: var(--text-secondary); font-weight: 600; font-size: 12px; padding: 16px 20px; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody id="menuTableBody">
                                ${renderTreeRows(result.data.tree)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.renderContent(html);
    },

    /**
     * 切换菜单行展开/收起
     */
    toggleMenuRow: function(id) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const icon = row.querySelector('.bi-chevron-down');

        // 查找所有子行
        const childRows = document.querySelectorAll(`tr[data-parent-id="${id}"]`);
        const isExpanded = icon.style.transform === 'rotate(0deg)' || !icon.style.transform;

        if (isExpanded) {
            // 收起
            icon.style.transform = 'rotate(-90deg)';
            childRows.forEach(childRow => {
                childRow.style.display = 'none';
                // 同时收起子行的子行
                const childId = childRow.getAttribute('data-id');
                const childIcon = childRow.querySelector('.bi-chevron-down');
                if (childIcon) {
                    childIcon.style.transform = 'rotate(-90deg)';
                }
            });
        } else {
            // 展开(只展开直接子行)
            icon.style.transform = 'rotate(0deg)';
            childRows.forEach(childRow => {
                childRow.style.display = '';
            });
        }
    },

    /**
     * 新增顶级菜单
     */
    addMenu: function() {
        this.showMenuForm(null, null);
    },

    /**
     * 新增子菜单
     */
    addSubMenu: function(parentId) {
        this.showMenuForm(null, parentId);
    },

    /**
     * 编辑菜单
     */
    editMenu: async function(id) {
        const result = await MockAPI.menus.getById(id);
        if (result.success) {
            this.showMenuForm(result.data, null);
        } else {
            alert(result.message);
        }
    },

    /**
     * 删除菜单
     */
    deleteMenu: async function(id) {
        const confirmed = await App.confirm(i18n.t('menuConfig.confirmDelete'), {
            danger: true,
            title: i18n.t('common.delete'),
            confirmText: i18n.t('common.delete')
        });

        if (!confirmed) {
            return;
        }

        const result = await MockAPI.menus.delete(id);
        if (result.success) {
            alert('删除成功！');
            window.location.reload();
        } else {
            alert(result.message);
        }
    },

    /**
     * 显示菜单表单
     */
    showMenuForm: async function(menu, parentId) {
        const isEdit = !!menu;
        const menuData = menu || {
            name: '',
            type: 'menu',
            parentId: parentId,
            path: '',
            icon: '',
            sort: 1,
            status: 'active'
        };

        // 获取所有菜单用于父菜单选择
        const allMenus = await MockAPI.menus.getList();

        // 构建父菜单选项(排除当前菜单及其子菜单)
        const buildParentOptions = (items, excludeId, level = 0) => {
            return items.filter(item => item.id !== excludeId).map(item => {
                const indent = '&nbsp;'.repeat(level * 4);
                let option = `<option value="${item.id}" ${menuData.parentId === item.id ? 'selected' : ''}>${indent}${item.name}</option>`;
                if (item.children && item.children.length > 0) {
                    option += buildParentOptions(item.children, excludeId, level + 1);
                }
                return option;
            }).join('');
        };

        // 常用图标列表
        const commonIcons = [
            'bi-speedometer2', 'bi-tags', 'bi-people', 'bi-list-check', 'bi-currency-dollar',
            'bi-gear', 'bi-house', 'bi-file-text', 'bi-box', 'bi-graph-up',
            'bi-calendar', 'bi-clipboard', 'bi-bell', 'bi-envelope', 'bi-chat',
            'bi-shield', 'bi-award', 'bi-heart', 'bi-star', 'bi-bookmark',
            'bi-folder', 'bi-file-earmark', 'bi-image', 'bi-grid', 'bi-list-ul'
        ];

        const content = `
            <form id="menuForm" onsubmit="Router.saveMenu(event, ${isEdit ? menuData.id : 'null'})" style="padding: 24px;">
                <!-- 基本信息 -->
                <div style="margin-bottom: 32px;">
                    <h6 style="font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">基本信息</h6>

                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                            菜单名称 <span style="color: #FF3B30;">*</span>
                        </label>
                        <input type="text"
                               class="form-control"
                               name="name"
                               value="${menuData.name}"
                               required
                               placeholder="请输入菜单名称"
                               style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                    </div>

                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                            菜单类型 <span style="color: #FF3B30;">*</span>
                        </label>
                        <select class="form-select"
                                name="type"
                                id="menuType"
                                onchange="Router.handleMenuTypeChange()"
                                required
                                style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                            <option value="menu" ${menuData.type === 'menu' ? 'selected' : ''}>📄 菜单</option>
                            <option value="directory" ${menuData.type === 'directory' ? 'selected' : ''}>📁 目录</option>
                            <option value="button" ${menuData.type === 'button' ? 'selected' : ''}>🔘 按钮</option>
                        </select>
                        <div style="margin-top: 8px; padding: 12px; background: rgba(0, 122, 255, 0.05); border-left: 3px solid #007AFF; border-radius: 6px;">
                            <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                                <div style="margin-bottom: 4px;"><strong>目录：</strong>用于组织菜单结构，不可点击</div>
                                <div style="margin-bottom: 4px;"><strong>菜单：</strong>可点击跳转的菜单项</div>
                                <div><strong>按钮：</strong>页面内的操作按钮</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                            上级菜单
                        </label>
                        <select class="form-select"
                                name="parentId"
                                ${parentId ? 'disabled' : ''}
                                style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                            <option value="">🏠 无 (顶级菜单)</option>
                            ${buildParentOptions(allMenus.data.tree, isEdit ? menuData.id : null)}
                        </select>
                        ${parentId ? `<input type="hidden" name="parentId" value="${parentId}">` : ''}
                    </div>

                    <div class="form-group" id="pathField" style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                            路径 <span style="color: #FF3B30;" id="pathRequired">*</span>
                        </label>
                        <input type="text"
                               class="form-control"
                               name="path"
                               value="${menuData.path}"
                               id="pathInput"
                               placeholder="/path/to/page"
                               style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; font-family: 'SF Mono', Monaco, 'Courier New', monospace; transition: all 0.2s;">
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">
                            <i class="bi bi-info-circle me-1"></i>菜单类型需要配置路由路径
                        </div>
                    </div>
                </div>

                <!-- 图标选择 -->
                <div style="margin-bottom: 32px;">
                    <h6 style="font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">图标设置</h6>

                    <div class="form-group">
                        <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                            图标类名
                        </label>
                        <input type="text"
                               class="form-control"
                               name="icon"
                               id="iconInput"
                               value="${menuData.icon}"
                               placeholder="bi-house"
                               style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; font-family: 'SF Mono', Monaco, 'Courier New', monospace; transition: all 0.2s; margin-bottom: 12px;">

                        <div style="font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 10px;">
                            <i class="bi bi-palette me-1"></i>快速选择
                        </div>
                        <div style="background: #fafafa; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 10px; padding: 16px; max-height: 240px; overflow-y: auto;">
                            <div class="row g-2">
                                ${commonIcons.map(icon => `
                                    <div class="col-2 text-center">
                                        <div class="icon-selector"
                                             onclick="Router.selectIcon('${icon}')"
                                             style="padding: 12px 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; background: white;"
                                             onmouseenter="this.style.background='rgba(0, 122, 255, 0.05)'; this.style.transform='translateY(-2px)'"
                                             onmouseleave="this.style.background='white'; this.style.transform='translateY(0)'">
                                            <i class="${icon}" style="font-size: 22px; color: var(--text-primary);"></i>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 其他设置 -->
                <div style="margin-bottom: 20px;">
                    <h6 style="font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">其他设置</h6>

                    <div class="row g-3">
                        <div class="col-6">
                            <div class="form-group">
                                <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                    排序 <span style="color: #FF3B30;">*</span>
                                </label>
                                <input type="number"
                                       class="form-control"
                                       name="sort"
                                       value="${menuData.sort}"
                                       min="1"
                                       required
                                       style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">
                                    <i class="bi bi-arrow-down-up me-1"></i>数字越小越靠前
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                    状态
                                </label>
                                <div style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(0, 0, 0, 0.02); border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.06);">
                                    <span style="font-size: 14px; color: ${menuData.status === 'active' ? '#34C759' : '#8E8E93'}; flex: 1;" id="statusLabel">${menuData.status === 'active' ? '已启用' : '已禁用'}</span>
                                    <div class="form-check form-switch" style="margin: 0; padding: 0;">
                                        <input class="form-check-input"
                                               type="checkbox"
                                               name="status"
                                               id="statusSwitch"
                                               ${menuData.status === 'active' ? 'checked' : ''}
                                               onchange="Router.toggleMenuStatus()"
                                               style="cursor: pointer; width: 48px; height: 26px; margin: 0;">
                                    </div>
                                </div>
                                <input type="hidden" name="statusValue" id="statusValue" value="${menuData.status}">
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button type="button" class="btn" onclick="Router.closeDrawer()" style="border-radius: 10px; padding: 10px 20px; background: rgba(0, 0, 0, 0.04); border: none; color: var(--text-primary);">
                <i class="bi bi-x-lg me-1"></i>取消
            </button>
            <button type="button" class="btn btn-edit-primary" onclick="document.getElementById('menuForm').requestSubmit()" style="border-radius: 10px; padding: 10px 20px;">
                <i class="bi bi-check-lg me-1"></i>保存
            </button>
        `;

        this.openDrawer(isEdit ? '编辑菜单' : '新增菜单', content, footer);

        // 初始化表单状态
        setTimeout(() => {
            this.handleMenuTypeChange();
        }, 100);
    },

    /**
     * 处理菜单类型变化
     */
    handleMenuTypeChange: function() {
        const type = document.getElementById('menuType').value;
        const pathInput = document.getElementById('pathInput');
        const pathRequired = document.getElementById('pathRequired');

        if (type === 'menu') {
            // 菜单类型需要路径
            pathInput.required = true;
            pathRequired.style.display = 'inline';
        } else {
            // 目录和按钮不需要路径
            pathInput.required = false;
            pathRequired.style.display = 'none';
        }
    },

    /**
     * 选择图标
     */
    selectIcon: function(icon) {
        document.getElementById('iconInput').value = icon;

        // 高亮选中的图标
        document.querySelectorAll('.icon-selector').forEach(el => {
            el.style.background = 'white';
            el.style.border = '2px solid transparent';
            el.style.boxShadow = 'none';
        });
        event.currentTarget.style.background = 'rgba(0, 122, 255, 0.1)';
        event.currentTarget.style.border = '2px solid #007AFF';
        event.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 122, 255, 0.2)';
    },

    /**
     * 切换菜单状态
     */
    toggleMenuStatus: function() {
        const statusSwitch = document.getElementById('statusSwitch');
        const statusLabel = document.getElementById('statusLabel');
        const statusValue = document.getElementById('statusValue');

        if (statusSwitch.checked) {
            statusLabel.textContent = '已启用';
            statusLabel.style.color = '#34C759';
            statusValue.value = 'active';
        } else {
            statusLabel.textContent = '已禁用';
            statusLabel.style.color = '#8E8E93';
            statusValue.value = 'inactive';
        }
    },

    /**
     * 筛选菜单表格
     */
    filterMenuTable: function() {
        const searchValue = document.getElementById('menuSearch').value.toLowerCase();
        const typeFilter = document.getElementById('menuTypeFilter').value;
        const statusFilter = document.getElementById('menuStatusFilter').value;

        const rows = document.querySelectorAll('#menuTableBody tr');

        rows.forEach(row => {
            const name = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
            const type = row.getAttribute('data-type');
            const status = row.getAttribute('data-status');

            // 检查是否匹配筛选条件
            const matchSearch = !searchValue || name.includes(searchValue);
            const matchType = !typeFilter || type === typeFilter;
            const matchStatus = !statusFilter || status === statusFilter;

            // 显示或隐藏行
            if (matchSearch && matchType && matchStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },

    /**
     * 重置菜单筛选
     */
    resetMenuFilter: function() {
        // 清空筛选条件
        document.getElementById('menuSearch').value = '';
        document.getElementById('menuTypeFilter').value = '';
        document.getElementById('menuStatusFilter').value = '';

        // 显示所有行
        const rows = document.querySelectorAll('#menuTableBody tr');
        rows.forEach(row => {
            row.style.display = '';
        });
    },

    /**
     * 展开全部菜单
     */
    expandAllMenus: function() {
        const allRows = document.querySelectorAll('#menuTableBody tr');
        const icons = document.querySelectorAll('#menuTableBody .bi-chevron-down');

        // 显示所有行
        allRows.forEach(row => {
            row.style.display = '';
        });

        // 旋转所有箭头为展开状态
        icons.forEach(icon => {
            icon.style.transform = 'rotate(0deg)';
        });
    },

    /**
     * 收起全部菜单
     */
    collapseAllMenus: function() {
        const allRows = document.querySelectorAll('#menuTableBody tr');
        const icons = document.querySelectorAll('#menuTableBody .bi-chevron-down');

        // 隐藏所有有父节点的行
        allRows.forEach(row => {
            const parentId = row.getAttribute('data-parent-id');
            if (parentId) {
                row.style.display = 'none';
            }
        });

        // 旋转所有箭头为收起状态
        icons.forEach(icon => {
            icon.style.transform = 'rotate(-90deg)';
        });
    },

    /**
     * 切换菜单状态
     */
    toggleMenuStatus: async function(id, isActive) {
        const status = isActive ? 'active' : 'inactive';
        const result = await MockAPI.menus.update(id, { status });

        if (result.success) {
            // 更新成功，更新行的状态属性
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.setAttribute('data-status', status);
            }
        } else {
            alert('状态更新失败：' + result.message);
            // 恢复开关状态
            event.target.checked = !isActive;
        }
    },

    /**
     * 处理版本图标上传
     */
    handleEditionIconUpload: function(event, editionId) {
        const file = event.target.files[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件');
            return;
        }

        // 验证文件大小（限制500KB）
        if (file.size > 500 * 1024) {
            alert('图片大小不能超过500KB');
            return;
        }

        // 读取文件并转为base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            document.getElementById('editionIcon').value = base64;

            // 更新预览
            const preview = document.getElementById('editionIconPreview');
            if (preview) {
                preview.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: contain;">`;
            }
        };
        reader.readAsDataURL(file);
    },

    /**
     * 清除版本图标
     */
    clearEditionIcon: function() {
        document.getElementById('editionIcon').value = '';

        // 更新预览
        const preview = document.getElementById('editionIconPreview');
        if (preview) {
            preview.innerHTML = '<i class="bi bi-image" style="font-size: 32px; color: var(--text-secondary);"></i>';
        }

        // 清除文件选择
        const fileInput = document.getElementById('editionIconUpload');
        if (fileInput) {
            fileInput.value = '';
        }
    },

    /**
     * 保存菜单
     */
    saveMenu: async function(event, id) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 转换数据类型
        data.sort = parseInt(data.sort);
        data.parentId = data.parentId ? parseInt(data.parentId) : null;

        // 使用statusValue替换status（因为status是checkbox，statusValue是实际值）
        data.status = data.statusValue || data.status;
        delete data.statusValue;

        let result;
        if (id) {
            // 更新
            result = await MockAPI.menus.update(id, data);
        } else {
            // 创建
            result = await MockAPI.menus.create(data);
        }

        if (result.success) {
            alert(id ? '更新成功！' : '创建成功！');
            this.closeDrawer();
            window.location.reload();
        } else {
            alert('操作失败: ' + result.message);
        }
    },

    /**
     * 权限模板页面
     */
    loadPermissionTemplate: async function() {
        const result = await MockAPI.permissionTemplates.getList();

        const html = `
            <div class="page-header">
                <h1 data-i18n="menu.permissionTemplate">权限模板</h1>
            </div>

            <!-- 操作按钮区 -->
            <div class="mb-3">
                <button class="btn btn-primary" onclick="Router.addPermissionTemplate()">
                    <i class="bi bi-plus-circle me-1"></i>
                    新增权限模板
                </button>
            </div>

            <!-- 权限模板列表 -->
            <div class="row">
                ${result.data.list.map(template => `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">${template.name}</h5>
                                <span class="badge ${template.isDefault ? 'bg-primary' : 'bg-secondary'}">
                                    ${template.isDefault ? '默认模板' : '自定义'}
                                </span>
                            </div>
                            <div class="card-body">
                                <p class="text-muted mb-3">${template.description}</p>
                                <div class="mb-3">
                                    <small class="text-muted">包含菜单权限:</small>
                                    <div class="mt-2">
                                        ${template.menuIds.slice(0, 5).map(id => {
                                            const menu = MockAPI.menus.data.find(m => m.id === id);
                                            return menu ? `<span class="badge bg-light text-dark me-1 mb-1">${menu.name}</span>` : '';
                                        }).join('')}
                                        ${template.menuIds.length > 5 ? `<span class="badge bg-light text-dark">+${template.menuIds.length - 5} 更多</span>` : ''}
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">创建时间: ${template.createTime}</small>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-primary flex-fill" onclick="Router.viewPermissionTemplate(${template.id})">
                                        <i class="bi bi-eye"></i> 查看
                                    </button>
                                    <button class="btn btn-sm btn-warning" onclick="Router.editPermissionTemplate(${template.id})">
                                        <i class="bi bi-pencil"></i> 编辑
                                    </button>
                                    ${!template.isDefault ? `
                                        <button class="btn btn-sm btn-danger" onclick="Router.deletePermissionTemplate(${template.id})">
                                            <i class="bi bi-trash"></i> 删除
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${result.data.list.length === 0 ? `
                <div class="card">
                    <div class="card-body">
                        <div class="empty-state">
                            <i class="bi bi-shield-check"></i>
                            <p>暂无权限模板，点击上方按钮新增</p>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        this.renderContent(html);
    },

    /**
     * 新增权限模板
     */
    addPermissionTemplate: function() {
        this.showPermissionTemplateForm(null);
    },

    /**
     * 查看权限模板
     */
    viewPermissionTemplate: async function(id) {
        const result = await MockAPI.permissionTemplates.getById(id);
        if (!result.success) {
            alert(result.message);
            return;
        }

        const template = result.data;
        const allMenus = await MockAPI.menus.getList();

        // 构建菜单树形结构显示
        const renderMenuTree = (items, level = 0) => {
            return items.map(item => {
                const hasPermission = template.menuIds.includes(item.id);
                const indent = level * 20;

                let html = `
                    <div style="padding-left: ${indent}px; margin: 8px 0;">
                        <i class="${item.icon || 'bi-circle'} me-2"></i>
                        <span class="${hasPermission ? 'text-primary fw-bold' : 'text-muted'}">${item.name}</span>
                        ${hasPermission ? '<i class="bi bi-check-circle text-success ms-2"></i>' : ''}
                    </div>
                `;

                if (item.children && item.children.length > 0) {
                    html += renderMenuTree(item.children, level + 1);
                }

                return html;
            }).join('');
        };

        const content = `
            <div class="permission-detail">
                <div class="form-group">
                    <label class="form-label">模板名称</label>
                    <div class="form-control-plaintext"><strong>${template.name}</strong></div>
                </div>

                <div class="form-group">
                    <label class="form-label">模板说明</label>
                    <div class="form-control-plaintext">${template.description}</div>
                </div>

                <div class="form-group">
                    <label class="form-label">模板类型</label>
                    <div class="form-control-plaintext">
                        <span class="badge ${template.isDefault ? 'bg-primary' : 'bg-secondary'}">
                            ${template.isDefault ? '系统默认模板' : '自定义模板'}
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">包含的菜单权限 (${template.menuIds.length}项)</label>
                    <div class="border rounded p-3" style="max-height: 400px; overflow-y: auto; background: #fafafa;">
                        ${renderMenuTree(allMenus.data.tree)}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">创建时间</label>
                    <div class="form-control-plaintext">${template.createTime}</div>
                </div>
            </div>

            <div class="drawer-footer">
                <button class="btn btn-secondary" onclick="Router.closeDrawer()">
                    <i class="bi bi-x-circle me-1"></i>关闭
                </button>
                <button class="btn btn-primary" onclick="Router.closeDrawer(); Router.editPermissionTemplate(${id});">
                    <i class="bi bi-pencil me-1"></i>编辑
                </button>
            </div>
        `;

        this.openDrawer('权限模板详情', content);
    },

    /**
     * 编辑权限模板
     */
    editPermissionTemplate: async function(id) {
        const result = await MockAPI.permissionTemplates.getById(id);
        if (result.success) {
            this.showPermissionTemplateForm(result.data);
        } else {
            alert(result.message);
        }
    },

    /**
     * 删除权限模板
     */
    deletePermissionTemplate: async function(id) {
        if (!confirm('确定要删除该权限模板吗？此操作不可恢复！')) {
            return;
        }

        const result = await MockAPI.permissionTemplates.delete(id);
        if (result.success) {
            alert('删除成功！');
            window.location.reload();
        } else {
            alert(result.message);
        }
    },

    /**
     * 显示权限模板表单
     */
    showPermissionTemplateForm: async function(template) {
        const isEdit = !!template;
        const templateData = template || {
            name: '',
            description: '',
            menuIds: [],
            isDefault: false
        };

        const allMenus = await MockAPI.menus.getList();

        // 递归渲染菜单树形复选框
        const renderMenuCheckboxTree = (items, level = 0) => {
            return items.map(item => {
                const indent = level * 20;
                const isChecked = templateData.menuIds.includes(item.id);
                const hasChildren = item.children && item.children.length > 0;

                let html = `
                    <div style="padding-left: ${indent}px; margin: 8px 0;">
                        <div class="form-check">
                            <input class="form-check-input menu-checkbox" type="checkbox"
                                   value="${item.id}" id="menu_${item.id}"
                                   ${isChecked ? 'checked' : ''}
                                   data-parent-id="${item.parentId || ''}"
                                   onchange="Router.handleMenuCheckboxChange(${item.id})">
                            <label class="form-check-label" for="menu_${item.id}">
                                <i class="${item.icon || 'bi-circle'} me-2"></i>
                                ${item.name}
                            </label>
                        </div>
                    </div>
                `;

                if (hasChildren) {
                    html += renderMenuCheckboxTree(item.children, level + 1);
                }

                return html;
            }).join('');
        };

        const content = `
            <form id="permissionTemplateForm" onsubmit="Router.savePermissionTemplate(event, ${isEdit ? templateData.id : 'null'})">
                <div class="form-group">
                    <label class="form-label">模板名称 <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" name="name" value="${templateData.name}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">模板说明</label>
                    <textarea class="form-control" name="description" rows="3">${templateData.description}</textarea>
                </div>

                ${!templateData.isDefault ? `
                    <div class="form-group">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="isDefault" id="isDefault" ${templateData.isDefault ? 'checked' : ''}>
                            <label class="form-check-label" for="isDefault">设为默认模板</label>
                        </div>
                        <div class="form-text">默认模板会自动应用于新创建的客户</div>
                    </div>
                ` : ''}

                <div class="form-group">
                    <label class="form-label">选择菜单权限 <span class="text-danger">*</span></label>
                    <div class="mb-2">
                        <button type="button" class="btn btn-sm btn-outline-primary me-2" onclick="Router.selectAllMenus(true)">
                            <i class="bi bi-check-square"></i> 全选
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="Router.selectAllMenus(false)">
                            <i class="bi bi-square"></i> 取消全选
                        </button>
                    </div>
                    <div class="border rounded p-3" style="max-height: 400px; overflow-y: auto; background: #fafafa;">
                        ${renderMenuCheckboxTree(allMenus.data.tree)}
                    </div>
                    <div class="form-text mt-2">已选择 <span id="selectedCount">${templateData.menuIds.length}</span> 项菜单权限</div>
                </div>
            </form>

            <div class="drawer-footer">
                <button type="button" class="btn btn-secondary" onclick="Router.closeDrawer()">
                    <i class="bi bi-x-circle me-1"></i>取消
                </button>
                <button type="button" class="btn btn-primary" onclick="document.getElementById('permissionTemplateForm').requestSubmit()">
                    <i class="bi bi-check-circle me-1"></i>保存
                </button>
            </div>
        `;

        this.openDrawer(isEdit ? '编辑权限模板' : '新增权限模板', content);

        // 初始化选中数量显示
        setTimeout(() => {
            this.updateSelectedCount();
        }, 100);
    },

    /**
     * 处理菜单复选框变化
     */
    handleMenuCheckboxChange: function(menuId) {
        // 更新选中数量显示
        this.updateSelectedCount();
    },

    /**
     * 全选/取消全选菜单
     */
    selectAllMenus: function(selectAll) {
        const checkboxes = document.querySelectorAll('.menu-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll;
        });
        this.updateSelectedCount();
    },

    /**
     * 更新选中数量
     */
    updateSelectedCount: function() {
        const checkboxes = document.querySelectorAll('.menu-checkbox:checked');
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = checkboxes.length;
        }
    },

    /**
     * 保存权限模板
     */
    savePermissionTemplate: async function(event, id) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        // 获取选中的菜单ID
        const menuIds = Array.from(document.querySelectorAll('.menu-checkbox:checked'))
            .map(cb => parseInt(cb.value));

        if (menuIds.length === 0) {
            alert('请至少选择一个菜单权限！');
            return;
        }

        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            menuIds: menuIds,
            isDefault: formData.get('isDefault') === 'on'
        };

        let result;
        if (id) {
            result = await MockAPI.permissionTemplates.update(id, data);
        } else {
            result = await MockAPI.permissionTemplates.create(data);
        }

        if (result.success) {
            alert(id ? '更新成功！' : '创建成功！');
            this.closeDrawer();
            window.location.reload();
        } else {
            alert('操作失败: ' + result.message);
        }
    },

    /**
     * 计费模板列表页面
     */
    loadPricingList: async function() {
        const result = await MockAPI.pricingTemplates.getList({ page: 1, pageSize: 10 });

        const html = `
            <div class="page-header">
                <h1 data-i18n="pricing.list">计费模板列表</h1>
                <div>
                    <a href="#/pricing/create" class="btn btn-primary">
                        <i class="bi bi-plus-circle me-1"></i>
                        <span data-i18n="pricing.createNew">新增模板</span>
                    </a>
                </div>
            </div>

            <!-- 表格 -->
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th data-i18n="pricing.templateName">模板名称</th>
                                    <th data-i18n="pricing.peakPrice">峰电价(元/kWh)</th>
                                    <th data-i18n="pricing.flatPrice">平电价(元/kWh)</th>
                                    <th data-i18n="pricing.valleyPrice">谷电价(元/kWh)</th>
                                    <th data-i18n="pricing.effectiveDate">生效日期</th>
                                    <th data-i18n="common.actions">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${result.data.list.map(item => `
                                    <tr>
                                        <td data-label="ID">${item.id}</td>
                                        <td data-label="模板名称">${item.templateName}</td>
                                        <td data-label="峰电价">¥${item.peakPrice}</td>
                                        <td data-label="平电价">¥${item.flatPrice}</td>
                                        <td data-label="谷电价">¥${item.valleyPrice}</td>
                                        <td data-label="生效日期">${item.effectiveDate}</td>
                                        <td data-label="操作">
                                            <div class="action-buttons">
                                                <button class="btn btn-sm btn-primary">
                                                    <i class="bi bi-eye"></i> <span data-i18n="common.view">查看</span>
                                                </button>
                                                <button class="btn btn-sm btn-warning">
                                                    <i class="bi bi-pencil"></i> <span data-i18n="common.edit">编辑</span>
                                                </button>
                                                <button class="btn btn-sm btn-danger">
                                                    <i class="bi bi-trash"></i> <span data-i18n="common.delete">删除</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.renderContent(html);
    },

    /**
     * 计费模板创建页面
     */
    loadPricingCreate: function() {
        const html = `
            <div class="page-header">
                <h1 data-i18n="pricing.createNew">新增计费模板</h1>
            </div>

            <div class="card">
                <div class="card-body">
                    <form id="pricingForm">
                        <div class="mb-3">
                            <label class="form-label" data-i18n="pricing.templateName">模板名称 <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" required>
                        </div>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label" data-i18n="pricing.peakPrice">峰电价(元/kWh) <span class="text-danger">*</span></label>
                                <input type="number" step="0.0001" class="form-control" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label" data-i18n="pricing.flatPrice">平电价(元/kWh) <span class="text-danger">*</span></label>
                                <input type="number" step="0.0001" class="form-control" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label" data-i18n="pricing.valleyPrice">谷电价(元/kWh) <span class="text-danger">*</span></label>
                                <input type="number" step="0.0001" class="form-control" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" data-i18n="pricing.effectiveDate">生效日期</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle me-1"></i>
                                <span data-i18n="common.save">保存</span>
                            </button>
                            <a href="#/pricing/list" class="btn btn-secondary ms-2">
                                <i class="bi bi-x-circle me-1"></i>
                                <span data-i18n="common.cancel">取消</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.renderContent(html);

        document.getElementById('pricingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('计费模板创建成功！');
            window.location.hash = '/pricing/list';
        });
    },

    /**
     * 个人信息页面
     */
    loadProfile: function() {
        const user = Auth.getCurrentUser();

        const html = `
            <div class="page-header">
                <h1 data-i18n="menu.profile">个人信息</h1>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3 text-center mb-4">
                            <div class="avatar-circle" style="width: 120px; height: 120px; font-size: 48px; margin: 0 auto;">
                                <i class="bi bi-person-fill"></i>
                            </div>
                            <h4 class="mt-3">${user.name}</h4>
                            <p class="text-muted">${user.role === 'admin' ? '系统管理员' : '用户'}</p>
                        </div>
                        <div class="col-md-9">
                            <table class="table">
                                <tr>
                                    <th width="150">用户名</th>
                                    <td>${user.username}</td>
                                </tr>
                                <tr>
                                    <th>姓名</th>
                                    <td>${user.name}</td>
                                </tr>
                                <tr>
                                    <th>邮箱</th>
                                    <td>${user.email}</td>
                                </tr>
                                <tr>
                                    <th>角色</th>
                                    <td><span class="badge bg-primary">${user.role === 'admin' ? '管理员' : '普通用户'}</span></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderContent(html);
    },

    /**
     * 修改密码页面 - Apple HIG风格
     */
    loadChangePassword: function() {
        const html = `
            <style>
                /* 修改密码页面专属样式 */
                .password-page-container {
                    max-width: 100%;
                }

                .password-card {
                    background: #FFFFFF;
                    border-radius: 18px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
                    padding: 48px;
                    margin-top: 24px;
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .password-form-group {
                    margin-bottom: 24px;
                }
                
                .password-form-label {
                    font-size: 15px;
                    font-weight: 500;
                    color: #1D1D1F;
                    margin-bottom: 8px;
                    display: block;
                }
                
                .password-input-wrapper {
                    position: relative;
                }
                
                .password-input {
                    width: 100%;
                    height: 52px;
                    border: 1.5px solid rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    padding: 12px 50px 12px 16px;
                    font-size: 15px;
                    color: #1D1D1F;
                    background: #FFFFFF;
                    transition: all 0.2s;
                }
                
                .password-input:focus {
                    outline: none;
                    border-color: #007AFF;
                    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
                }
                
                .password-input.invalid {
                    border-color: #FF3B30;
                }
                
                .password-input.valid {
                    border-color: #34C759;
                }
                
                .toggle-password {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #86868B;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 8px;
                    transition: color 0.2s;
                }
                
                .toggle-password:hover {
                    color: #1D1D1F;
                }
                
                .password-strength {
                    margin-top: 8px;
                    display: none;
                }
                
                .password-strength.show {
                    display: block;
                }
                
                .strength-bar {
                    height: 4px;
                    background: #E5E5EA;
                    border-radius: 2px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }
                
                .strength-bar-fill {
                    height: 100%;
                    width: 0;
                    transition: all 0.3s ease;
                    border-radius: 2px;
                }
                
                .strength-bar-fill.weak {
                    width: 33%;
                    background: #FF3B30;
                }
                
                .strength-bar-fill.medium {
                    width: 66%;
                    background: #FF9500;
                }
                
                .strength-bar-fill.strong {
                    width: 100%;
                    background: #34C759;
                }
                
                .strength-text {
                    font-size: 13px;
                    font-weight: 500;
                }
                
                .strength-text.weak {
                    color: #FF3B30;
                }
                
                .strength-text.medium {
                    color: #FF9500;
                }
                
                .strength-text.strong {
                    color: #34C759;
                }
                
                .password-match {
                    margin-top: 8px;
                    font-size: 13px;
                    display: none;
                }
                
                .password-match.show {
                    display: block;
                }
                
                .password-match.valid {
                    color: #34C759;
                }
                
                .password-match.invalid {
                    color: #FF3B30;
                }
                
                .password-requirements {
                    background: rgba(0, 122, 255, 0.05);
                    border: 1px solid rgba(0, 122, 255, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 32px;
                }
                
                .requirements-title {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1D1D1F;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .requirements-title i {
                    color: #007AFF;
                }
                
                .requirements-list {
                    margin: 0;
                    padding-left: 20px;
                    color: #86868B;
                    font-size: 13px;
                }
                
                .requirements-list li {
                    margin-bottom: 6px;
                }
                
                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    padding-top: 24px;
                    border-top: 1px solid rgba(0, 0, 0, 0.06);
                }
                
                .btn-cancel {
                    padding: 10px 24px;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 500;
                    background: #F5F5F7;
                    color: #1D1D1F;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    transition: all 0.2s;
                    cursor: pointer;
                }
                
                .btn-cancel:hover {
                    background: #E8E8ED;
                    border-color: rgba(0, 0, 0, 0.1);
                    transform: translateY(-1px);
                }
                
                .btn-save {
                    padding: 10px 24px;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 500;
                    background: #007AFF;
                    color: #FFFFFF;
                    border: none;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                
                .btn-save:hover:not(:disabled) {
                    background: #0051D5;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
                }
                
                .btn-save:active {
                    transform: translateY(0);
                }
                
                .btn-save:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                @media (max-width: 992px) {
                    .password-card {
                        padding: 32px 24px;
                    }
                }

                @media (max-width: 768px) {
                    .password-card {
                        padding: 24px 20px;
                        border-radius: 12px;
                    }

                    .password-input {
                        height: 48px;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .btn-cancel,
                    .btn-save {
                        width: 100%;
                    }

                    .password-requirements {
                        padding: 12px;
                    }
                }

                @media (max-width: 576px) {
                    .password-page-container {
                        padding: 0 12px;
                    }

                    .password-card {
                        padding: 20px 16px;
                        margin-top: 16px;
                    }

                    .password-form-group {
                        margin-bottom: 20px;
                    }
                }
            </style>
            
            <div class="page-header">
                <h1 data-i18n="menu.changePassword">修改密码</h1>
            </div>
            
            <div class="password-page-container">
                <div class="password-card">
                    <form id="passwordForm">
                        <!-- 原密码 -->
                        <div class="password-form-group">
                            <label class="password-form-label">
                                原密码 <span style="color: #FF3B30;">*</span>
                            </label>
                            <div class="password-input-wrapper">
                                <input 
                                    type="password" 
                                    id="oldPassword"
                                    class="password-input" 
                                    placeholder="请输入原密码"
                                    required
                                    autocomplete="current-password"
                                >
                                <button type="button" class="toggle-password" data-target="oldPassword">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- 新密码 -->
                        <div class="password-form-group">
                            <label class="password-form-label">
                                新密码 <span style="color: #FF3B30;">*</span>
                            </label>
                            <div class="password-input-wrapper">
                                <input 
                                    type="password" 
                                    id="newPassword"
                                    class="password-input" 
                                    placeholder="请输入新密码"
                                    required
                                    autocomplete="new-password"
                                >
                                <button type="button" class="toggle-password" data-target="newPassword">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                            <div class="password-strength" id="passwordStrength">
                                <div class="strength-bar">
                                    <div class="strength-bar-fill" id="strengthBar"></div>
                                </div>
                                <span class="strength-text" id="strengthText"></span>
                            </div>
                        </div>
                        
                        <!-- 确认密码 -->
                        <div class="password-form-group">
                            <label class="password-form-label">
                                确认新密码 <span style="color: #FF3B30;">*</span>
                            </label>
                            <div class="password-input-wrapper">
                                <input 
                                    type="password" 
                                    id="confirmPassword"
                                    class="password-input" 
                                    placeholder="请再次输入新密码"
                                    required
                                    autocomplete="new-password"
                                >
                                <button type="button" class="toggle-password" data-target="confirmPassword">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                            <div class="password-match" id="passwordMatch"></div>
                        </div>

                        <!-- 按钮 -->
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" onclick="history.back()">
                                取消
                            </button>
                            <button type="submit" class="btn-save" id="saveBtn">
                                <i class="bi bi-check-circle me-1"></i>
                                保存修改
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        this.renderContent(html);
        
        // 密码显示/隐藏切换
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const input = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            });
        });
        
        // 密码强度检测
        const newPasswordInput = document.getElementById('newPassword');
        const strengthIndicator = document.getElementById('passwordStrength');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        function checkPasswordStrength(password) {
            if (!password) return { strength: '', text: '' };
            
            let score = 0;
            
            // 长度检查
            if (password.length >= 8) score++;
            if (password.length >= 12) score++;
            
            // 字符类型检查
            if (/[a-z]/.test(password)) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^a-zA-Z0-9]/.test(password)) score++;
            
            if (score <= 2) {
                return { strength: 'weak', text: '密码强度：弱' };
            } else if (score <= 4) {
                return { strength: 'medium', text: '密码强度：中等' };
            } else {
                return { strength: 'strong', text: '密码强度：强' };
            }
        }
        
        newPasswordInput.addEventListener('input', function() {
            const result = checkPasswordStrength(this.value);
            
            if (this.value) {
                strengthIndicator.classList.add('show');
                strengthBar.className = 'strength-bar-fill ' + result.strength;
                strengthText.className = 'strength-text ' + result.strength;
                strengthText.textContent = result.text;
            } else {
                strengthIndicator.classList.remove('show');
            }
            
            // 验证确认密码
            validateConfirmPassword();
        });
        
        // 确认密码验证
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordMatch = document.getElementById('passwordMatch');
        
        function validateConfirmPassword() {
            const newPass = newPasswordInput.value;
            const confirmPass = confirmPasswordInput.value;
            
            if (confirmPass) {
                passwordMatch.classList.add('show');
                
                if (newPass === confirmPass) {
                    passwordMatch.className = 'password-match show valid';
                    passwordMatch.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>密码匹配';
                    confirmPasswordInput.classList.remove('invalid');
                    confirmPasswordInput.classList.add('valid');
                } else {
                    passwordMatch.className = 'password-match show invalid';
                    passwordMatch.innerHTML = '<i class="bi bi-x-circle-fill me-1"></i>密码不匹配';
                    confirmPasswordInput.classList.remove('valid');
                    confirmPasswordInput.classList.add('invalid');
                }
            } else {
                passwordMatch.classList.remove('show');
                confirmPasswordInput.classList.remove('valid', 'invalid');
            }
        }
        
        confirmPasswordInput.addEventListener('input', validateConfirmPassword);
        
        // 表单提交
        document.getElementById('passwordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // 验证密码强度
            const strength = checkPasswordStrength(newPassword);
            if (strength.strength === 'weak') {
                alert('密码强度太弱，请设置更强的密码！');
                return;
            }
            
            // 验证密码匹配
            if (newPassword !== confirmPassword) {
                alert('两次输入的密码不一致！');
                return;
            }
            
            // 验证原密码（这里是模拟，实际应该调用API）
            if (oldPassword !== '123456') {
                alert('原密码错误！');
                return;
            }
            
            // 禁用按钮，显示加载状态
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>保存中...';
            
            // 模拟API调用
            setTimeout(() => {
                alert('密码修改成功！请重新登录。');
                // 实际应用中这里应该清除token并跳转到登录页
                // window.location.href = './index.html';
                
                // 演示：重置表单
                this.reset();
                strengthIndicator.classList.remove('show');
                passwordMatch.classList.remove('show');
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>保存修改';
            }, 1000);
        });
    },

    /**
     * 搜索版本
     */
    searchVersions: function() {
        alert('搜索功能演示');
    },

    /**
     * 查看版本详情
     */
    viewVersion: function(id) {
        alert('查看版本详情: ' + id);
    },

    /**
     * 删除版本
     */
    deleteVersion: async function(id) {
        if (confirm('确定要删除该版本吗？')) {
            const result = await MockAPI.versions.delete(id);
            if (result.success) {
                alert('删除成功！');
                window.location.reload();
            }
        }
    },

    /**
     * 打开右侧弹窗
     */
    openDrawer: function(title, content, footer = null, width = 600) {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        const drawerTitle = document.getElementById('drawerTitle');
        const drawerBody = document.getElementById('drawerBody');
        const drawerFooter = document.getElementById('drawerFooter');

        drawerTitle.textContent = title;
        drawerBody.innerHTML = content;

        // 设置抽屉宽度
        drawer.style.width = `${width}px`;
        drawer.style.right = `-${width}px`;

        // 设置footer
        if (footer) {
            drawerFooter.innerHTML = footer;
            drawerFooter.style.display = 'flex';
        } else {
            drawerFooter.innerHTML = '';
            drawerFooter.style.display = 'none';
        }

        // 显示弹窗
        setTimeout(() => {
            overlay.classList.add('show');
            drawer.classList.add('show');
            drawer.style.right = '0';
        }, 10);

        // 点击遮罩层关闭
        overlay.onclick = () => this.closeDrawer();

        // 重新应用国际化
        i18n.applyTranslations();
    },

    /**
     * 关闭右侧弹窗
     */

    /**
     * 切换保留天数输入框显示/隐藏
     * @param {string} fieldId - 输入框ID
     * @param {boolean} isPermanent - 是否为长期有效
     */
    toggleRetentionInput: function(fieldId, isPermanent) {
        const inputGroup = document.getElementById(`${fieldId}InputGroup`);
        if (inputGroup) {
            inputGroup.style.display = isPermanent ? 'none' : 'flex';
        }
    },

    /**
     * 切换菜单树展开/折叠
     * @param {HTMLElement} toggleElement - 点击的箭头元素
     */
    toggleMenuTree: function(toggleElement) {
        const treeNode = toggleElement.closest('.menu-tree-item');
        const childrenContainer = treeNode.querySelector('.menu-tree-children');

        if (childrenContainer) {
            const isCollapsed = childrenContainer.classList.contains('collapsed');

            if (isCollapsed) {
                childrenContainer.classList.remove('collapsed');
                childrenContainer.classList.add('expanded');
                toggleElement.classList.add('expanded');
            } else {
                childrenContainer.classList.remove('expanded');
                childrenContainer.classList.add('collapsed');
                toggleElement.classList.remove('expanded');
            }
        }
    },

    /**
     * 处理菜单复选框变化（支持父子级联）
     * @param {HTMLElement} checkbox - 变化的复选框
     */
    handleMenuCheckChange: function(checkbox) {
        const isChecked = checkbox.checked;
        const menuId = parseInt(checkbox.value);

        // 1. 选中/取消当前节点的所有子节点
        const treeNode = checkbox.closest('.menu-tree-item');
        const childCheckboxes = treeNode.querySelectorAll('.menu-tree-children .menu-tree-checkbox');
        childCheckboxes.forEach(cb => {
            cb.checked = isChecked;
        });

        // 2. 更新父节点状态
        this.updateParentCheckboxState(checkbox);
    },

    /**
     * 更新父节点复选框状态（递归）
     * @param {HTMLElement} checkbox - 子节点复选框
     */
    updateParentCheckboxState: function(checkbox) {
        const parentId = checkbox.getAttribute('data-parent');
        if (!parentId) return; // 已经是根节点

        const parentCheckbox = document.getElementById(`menu_${parentId}`);
        if (!parentCheckbox) return;

        const parentTreeNode = parentCheckbox.closest('.menu-tree-item');
        const siblingCheckboxes = Array.from(
            parentTreeNode.querySelectorAll(':scope > .menu-tree-children > .menu-tree-item > .menu-tree-node > .menu-tree-checkbox')
        );

        const checkedCount = siblingCheckboxes.filter(cb => cb.checked).length;
        const totalCount = siblingCheckboxes.length;

        if (checkedCount === 0) {
            // 所有子节点都未选中
            parentCheckbox.checked = false;
            parentCheckbox.indeterminate = false;
            parentCheckbox.classList.remove('indeterminate');
        } else if (checkedCount === totalCount) {
            // 所有子节点都选中
            parentCheckbox.checked = true;
            parentCheckbox.indeterminate = false;
            parentCheckbox.classList.remove('indeterminate');
        } else {
            // 部分子节点选中（半选状态）
            parentCheckbox.checked = false;
            parentCheckbox.indeterminate = true;
            parentCheckbox.classList.add('indeterminate');
        }

        // 递归更新上层父节点
        this.updateParentCheckboxState(parentCheckbox);
    },

    closeDrawer: function() {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');

        drawer.classList.remove('show');
        overlay.classList.remove('show');

        // 延迟恢复默认宽度，等待动画完成
        setTimeout(() => {
            drawer.style.width = '600px';
            drawer.style.right = '-600px';
        }, 300);
    },

    /**
     * 查看客户详情
     */
    viewCustomer: async function(id) {
        const result = await MockAPI.customers.getById(id);

        if (!result.success) {
            alert(result.message);
            return;
        }

        const customer = result.data;

        // 计算服务状态
        const now = new Date();
        const activateDate = new Date(customer.activateTime);
        const expiryDate = new Date(customer.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        const isExpiring = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        const isExpired = daysUntilExpiry <= 0;

        // 判断服务状态
        let serviceStatus = '';
        let statusColor = '';
        let statusBg = '';

        if (customer.status === 'inactive') {
            serviceStatus = i18n.t('customer.status.notStarted');
            statusColor = '#8E8E93';
            statusBg = 'rgba(142, 142, 147, 0.1)';
        } else if (isExpired) {
            serviceStatus = i18n.t('customer.status.expired');
            statusColor = '#FF3B30';
            statusBg = 'rgba(255, 59, 48, 0.1)';
        } else if (now < activateDate) {
            serviceStatus = i18n.t('customer.status.disabled');
            statusColor = '#FFCC00';
            statusBg = 'rgba(255, 204, 0, 0.1)';
        } else {
            serviceStatus = i18n.t('customer.status.active');
            statusColor = '#34C759';
            statusBg = 'rgba(52, 199, 89, 0.1)';
        }

        const content = `
            <div class="customer-detail">
                <!-- 顶部摘要 -->
                <div style="padding: 24px 24px 20px; border-bottom: 1px solid rgba(0, 0, 0, 0.06);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <h3 style="font-size: 20px; font-weight: 600; color: var(--text-primary); margin: 0;">${customer.customerName}</h3>
                        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; background: ${statusBg}; color: ${statusColor};">
                            ${serviceStatus}
                        </span>
                        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; ${customer.edition === 'professional' ? 'background: rgba(255, 149, 0, 0.1); color: #FF9500;' : 'background: rgba(0, 122, 255, 0.1); color: #007AFF;'}">
                            ${customer.edition === 'professional' ? i18n.t('customer.professionalEditionShort') : i18n.t('customer.basicEditionShort')}
                        </span>
                    </div>
                </div>

                <!-- 信息分组 -->
                <div style="padding: 24px;">
                    <!-- 账户信息 -->
                    <div style="margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <i class="bi bi-person-circle" style="color: var(--text-secondary); font-size: 16px;"></i>
                            <h4 style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">${i18n.t('customer.accountInfo')}</h4>
                        </div>
                        <dl style="margin: 0; display: grid; grid-template-columns: 100px 1fr; gap: 12px 16px; align-items: center;">
                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.account')}</dt>
                            <dd style="color: var(--text-primary); font-size: 14px; margin: 0;">${customer.account}</dd>

                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.password')}</dt>
                            <dd style="color: var(--text-primary); font-size: 14px; margin: 0; font-family: 'SF Mono', Monaco, monospace;">${customer.password}</dd>
                        </dl>
                    </div>

                    <!-- 联系方式 -->
                    <div style="margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <i class="bi bi-telephone" style="color: var(--text-secondary); font-size: 16px;"></i>
                            <h4 style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">${i18n.t('customer.contactInfo')}</h4>
                        </div>
                        <dl style="margin: 0; display: grid; grid-template-columns: 100px 1fr; gap: 12px 16px; align-items: center;">
                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.contactPerson')}</dt>
                            <dd style="color: var(--text-primary); font-size: 14px; margin: 0;">${customer.contactPerson}</dd>

                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.contactPhone')}</dt>
                            <dd style="color: var(--text-primary); font-size: 14px; margin: 0;">${customer.contactPhone}</dd>
                        </dl>
                    </div>

                    <!-- 资源统计 -->
                    <div style="margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <i class="bi bi-diagram-3" style="color: var(--text-secondary); font-size: 16px;"></i>
                            <h4 style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">${i18n.t('customer.resourceStats')}</h4>
                        </div>
                        <dl style="margin: 0; display: grid; grid-template-columns: 100px 1fr; gap: 12px 16px; align-items: center;">
                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.sites')}</dt>
                            <dd style="color: var(--text-primary); font-size: 14px; margin: 0;">${customer.siteCount} ${i18n.getCurrentLanguage() === 'zh-CN' ? '个' : ''}</dd>

                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.devices')}</dt>
                            <dd style="color: var(--text-primary); font-size: 14px; margin: 0;">${customer.deviceCount} ${i18n.getCurrentLanguage() === 'zh-CN' ? '台' : ''}</dd>
                        </dl>
                    </div>

                    <!-- 时间信息 -->
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <i class="bi bi-clock-history" style="color: var(--text-secondary); font-size: 16px;"></i>
                            <h4 style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">${i18n.t('customer.timeInfo')}</h4>
                        </div>
                        <dl style="margin: 0; display: grid; grid-template-columns: 100px 1fr; gap: 12px 16px; align-items: center;">
                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.servicePeriod')}</dt>
                            <dd style="margin: 0; display: flex; align-items: center; gap: 8px;">
                                <span style="color: var(--text-primary); font-size: 14px;">${customer.activateTime}</span>
                                <i class="bi bi-arrow-right" style="color: var(--text-secondary); font-size: 12px;"></i>
                                <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; ${isExpired ? 'background: rgba(255, 59, 48, 0.1); color: #FF3B30;' : isExpiring ? 'background: rgba(255, 204, 0, 0.1); color: #FFCC00;' : 'background: rgba(52, 199, 89, 0.1); color: #34C759;'}">
                                    ${customer.expiryDate}
                                </span>
                            </dd>

                            <dt style="color: var(--text-secondary); font-size: 14px; font-weight: 400;">${i18n.t('customer.createTime')}</dt>
                            <dd style="color: var(--text-primary); font-size: 14px; margin: 0;">${customer.createTime}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        `;

        const footer = `
            <button class="btn btn-light" onclick="Router.closeDrawer()" style="height: 40px; padding: 0 20px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); font-size: 15px; font-weight: 500;">
                ${i18n.t('customer.close')}
            </button>
            <button class="btn btn-primary" onclick="Router.closeDrawer(); Router.editCustomer(${id});" style="height: 40px; padding: 0 20px; border-radius: 10px; font-size: 15px; font-weight: 500; background: #007AFF; border: none;">
                <i class="bi bi-pencil me-1"></i>${i18n.t('common.edit')}
            </button>
        `;

        this.openDrawer(i18n.t('customer.detail'), content, footer);
    },

    /**
     * 显示快到期客户列表
     */
    showExpiringCustomers: async function() {
        const result = await MockAPI.customers.getExpiringCustomers();

        if (!result.success || !result.data || result.data.length === 0) {
            alert('暂无快到期客户');
            return;
        }

        const customers = result.data;

        const content = `
            <div style="padding: 20px;">
                <!-- 标题和导出按钮 -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0;">
                        共 ${customers.length} 位客户即将到期
                    </h4>
                    <button class="btn btn-sm" onclick="Router.exportExpiringCustomers()"
                            style="background: #007AFF; color: white; border: none; padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;">
                        <i class="bi bi-download me-1"></i>导出数据
                    </button>
                </div>

                <!-- 表格容器 -->
                <div style="border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 10px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead style="background: #fafafa;">
                            <tr>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">客户名称</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">联系人</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">联系电话</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">版本</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">到期时间</th>
                                <th style="padding: 12px 14px; text-align: center; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">剩余天数</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map((customer, index) => `
                                <tr style="${index !== customers.length - 1 ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.04);' : ''}">
                                    <td style="padding: 12px 14px; color: var(--text-primary); font-weight: 500; white-space: nowrap;">${customer.customerName}</td>
                                    <td style="padding: 12px 14px; color: var(--text-primary); white-space: nowrap;">${customer.contactPerson}</td>
                                    <td style="padding: 12px 14px; color: var(--text-primary); white-space: nowrap;">${customer.contactPhone}</td>
                                    <td style="padding: 12px 14px; white-space: nowrap;">
                                        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; ${customer.edition === 'professional' ? 'background: rgba(255, 149, 0, 0.1); color: #FF9500;' : 'background: rgba(0, 122, 255, 0.1); color: #007AFF;'}">
                                            ${customer.edition === 'professional' ? i18n.t('customer.professionalEditionShort') : i18n.t('customer.basicEditionShort')}
                                        </span>
                                    </td>
                                    <td style="padding: 12px 14px; color: var(--text-primary); white-space: nowrap;">${customer.expiryDate}</td>
                                    <td style="padding: 12px 14px; text-align: center; white-space: nowrap;">
                                        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; ${customer.remainingDays <= 7 ? 'background: rgba(255, 59, 48, 0.1); color: #FF3B30;' : customer.remainingDays <= 15 ? 'background: rgba(255, 204, 0, 0.1); color: #FFCC00;' : 'background: rgba(255, 149, 0, 0.1); color: #FF9500;'}">
                                            ${customer.remainingDays} ${i18n.getCurrentLanguage() === 'zh-CN' ? '天' : 'days'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 缓存数据用于导出
        this._expiringCustomersData = customers;

        this.openDrawer('快到期客户', content, null, 900);
    },

    /**
     * 导出快到期客户数据
     */
    exportExpiringCustomers: function() {
        if (!this._expiringCustomersData || this._expiringCustomersData.length === 0) {
            alert('没有可导出的数据');
            return;
        }

        const customers = this._expiringCustomersData;

        // 构建CSV内容
        const headers = [
            i18n.t('customer.customerName'),
            i18n.t('customer.contactPerson'),
            i18n.t('customer.contactPhone'),
            i18n.t('customer.edition'),
            i18n.t('customer.expiryDate'),
            i18n.getCurrentLanguage() === 'zh-CN' ? '剩余天数' : 'Days Remaining'
        ];
        const rows = customers.map(c => [
            c.customerName,
            c.contactPerson,
            c.contactPhone,
            c.edition === 'professional' ? i18n.t('customer.professionalEditionShort') : i18n.t('customer.basicEditionShort'),
            c.expiryDate,
            c.remainingDays + (i18n.getCurrentLanguage() === 'zh-CN' ? '天' : ' days')
        ]);

        // 生成CSV字符串（使用制表符分隔，方便Excel打开）
        const csvContent = [
            headers.join('\t'),
            ...rows.map(row => row.join('\t'))
        ].join('\n');

        // 添加BOM以支持中文
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // 创建下载链接
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `快到期客户_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 提示导出成功
        alert('数据导出成功！');
    },

    /**
     * 显示最新客户预览
     */
    showNewCustomerPreview: async function() {
        console.log('showNewCustomerPreview called');

        try {
            const result = await MockAPI.customers.getList({ page: 1, pageSize: 2, sortField: 'createTime', sortOrder: 'desc' });
            console.log('API result:', result);

        if (!result.success || !result.data || result.data.list.length === 0) {
            // 没有客户数据，显示空状态
            const content = `
                <div style="padding: 60px 40px; text-align: center;">
                    <div style="width: 80px; height: 80px; background: rgba(0, 122, 255, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                        <i class="bi bi-inbox" style="font-size: 40px; color: #007AFF;"></i>
                    </div>
                    <h4 style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">暂无客户数据</h4>
                    <p style="font-size: 14px; color: var(--text-secondary);">暂无可显示的客户</p>
                </div>
            `;
            this.openDrawer('最新客户', content, null, 900);
            return;
        }

        const customers = result.data.list;

        const content = `
            <div style="padding: 20px;">
                <!-- 标题和导出按钮 -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h4 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0;">
                        最新添加的 ${customers.length} 位客户
                    </h4>
                    <button class="btn btn-sm" onclick="Router.exportNewCustomers()"
                            style="background: #007AFF; color: white; border: none; padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;">
                        <i class="bi bi-download me-1"></i>导出数据
                    </button>
                </div>

                <!-- 表格容器 -->
                <div style="border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 10px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead style="background: #fafafa;">
                            <tr>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">客户名称</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">联系人</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">联系电话</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">版本</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">到期时间</th>
                                <th style="padding: 12px 14px; text-align: left; font-weight: 500; color: var(--text-secondary); border-bottom: 1px solid rgba(0, 0, 0, 0.06); white-space: nowrap;">创建时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map((customer, index) => `
                                <tr style="${index !== customers.length - 1 ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.04);' : ''}">
                                    <td style="padding: 12px 14px; color: var(--text-primary); font-weight: 500; white-space: nowrap;">${customer.customerName}</td>
                                    <td style="padding: 12px 14px; color: var(--text-primary); white-space: nowrap;">${customer.contactPerson}</td>
                                    <td style="padding: 12px 14px; color: var(--text-primary); white-space: nowrap;">${customer.contactPhone}</td>
                                    <td style="padding: 12px 14px; white-space: nowrap;">
                                        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; ${customer.edition === 'professional' ? 'background: rgba(255, 149, 0, 0.1); color: #FF9500;' : 'background: rgba(0, 122, 255, 0.1); color: #007AFF;'}">
                                            ${customer.edition === 'professional' ? i18n.t('customer.professionalEditionShort') : i18n.t('customer.basicEditionShort')}
                                        </span>
                                    </td>
                                    <td style="padding: 12px 14px; color: var(--text-primary); white-space: nowrap;">${customer.expiryDate}</td>
                                    <td style="padding: 12px 14px; color: var(--text-primary); white-space: nowrap;">${customer.createTime}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 缓存数据用于导出
        this._newCustomersData = customers;

        this.openDrawer('最新客户', content, null, 900);
        } catch (error) {
            console.error('Error in showNewCustomerPreview:', error);
            alert('加载客户数据失败：' + error.message);
        }
    },

    /**
     * 导出最新客户数据
     */
    exportNewCustomers: function() {
        if (!this._newCustomersData || this._newCustomersData.length === 0) {
            alert('没有可导出的数据');
            return;
        }

        const customers = this._newCustomersData;

        // 构建CSV内容
        const headers = [
            i18n.t('customer.customerName'),
            i18n.t('customer.contactPerson'),
            i18n.t('customer.contactPhone'),
            i18n.t('customer.edition'),
            i18n.t('customer.expiryDate'),
            i18n.t('customer.createTime')
        ];
        const rows = customers.map(c => [
            c.customerName,
            c.contactPerson,
            c.contactPhone,
            c.edition === 'professional' ? i18n.t('customer.professionalEditionShort') : i18n.t('customer.basicEditionShort'),
            c.expiryDate,
            c.createTime
        ]);

        // 生成CSV字符串（使用制表符分隔，方便Excel打开）
        const csvContent = [
            headers.join('\t'),
            ...rows.map(row => row.join('\t'))
        ].join('\n');

        // 添加BOM以支持中文
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // 创建下载链接
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `最新客户_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 提示导出成功
        alert('数据导出成功！');
    },

    /**
     * 导出客户数据
     */
    exportCustomers: function() {
        if (!this._currentCustomerData || this._currentCustomerData.length === 0) {
            alert('没有可导出的数据');
            return;
        }

        const customers = this._currentCustomerData;
        const now = new Date();

        // 构建CSV内容
        const headers = [
            i18n.t('customer.customerName'),
            i18n.t('customer.contactPerson'),
            i18n.t('customer.contactPhone'),
            i18n.t('customer.edition'),
            i18n.t('customer.siteCount'),
            i18n.t('customer.deviceCount'),
            i18n.t('customer.expiryDate'),
            i18n.t('customer.accountStatus'),
            i18n.t('customer.serviceStatus')
        ];
        const rows = customers.map(c => {
            const activateDate = new Date(c.activateTime);
            const expiryDate = new Date(c.expiryDate);
            const isExpired = now > expiryDate;

            // 计算服务状态
            let serviceStatus = '';
            if (c.status === 'inactive') {
                serviceStatus = i18n.t('customer.status.notStarted');
            } else if (isExpired) {
                serviceStatus = i18n.t('customer.status.expired');
            } else if (now < activateDate) {
                serviceStatus = i18n.t('customer.status.disabled');
            } else {
                serviceStatus = i18n.t('customer.status.active');
            }

            return [
                c.customerName,
                c.contactPerson,
                c.contactPhone,
                c.edition === 'professional' ? i18n.t('customer.professionalEditionShort') : i18n.t('customer.basicEditionShort'),
                c.siteCount,
                c.deviceCount,
                c.expiryDate,
                c.status === 'active' ? i18n.t('customer.accountStatusValue.enabled') : i18n.t('customer.accountStatusValue.disabled'),
                serviceStatus
            ];
        });

        // 生成CSV字符串（使用制表符分隔，方便Excel打开）
        const csvContent = [
            headers.join('\t'),
            ...rows.map(row => row.join('\t'))
        ].join('\n');

        // 添加BOM以支持中文
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // 创建下载链接
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `客户数据_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 提示导出成功
        alert('数据导出成功！');
    },

    /**
     * 编辑客户
     */
    editCustomer: async function(id) {
        const result = await MockAPI.customers.getById(id);

        if (!result.success) {
            alert(result.message);
            return;
        }

        const customer = result.data;

        const content = `
            <form id="editCustomerForm" onsubmit="Router.saveCustomer(event, ${id})" style="padding: 24px;">
                <!-- 客户名称 -->
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.customerName')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <input type="text"
                           class="form-control"
                           name="customerName"
                           value="${customer.customerName}"
                           required
                           style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                </div>

                <!-- 账号和密码 -->
                <div class="row" style="margin-bottom: 20px;">
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.account')} <span style="color: #FF3B30;">*</span>
                            </label>
                            <input type="text"
                                   class="form-control"
                                   name="account"
                                   value="${customer.account}"
                                   required
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.password')} <span style="color: #FF3B30;">*</span>
                            </label>
                            <input type="password"
                                   class="form-control"
                                   name="password"
                                   value="${customer.password}"
                                   required
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                </div>

                <!-- 联系人和联系电话 -->
                <div class="row" style="margin-bottom: 20px;">
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.contactPerson')} <span style="color: #FF3B30;">*</span>
                            </label>
                            <input type="text"
                                   class="form-control"
                                   name="contactPerson"
                                   value="${customer.contactPerson}"
                                   required
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.contactPhone')}
                            </label>
                            <input type="tel"
                                   class="form-control"
                                   name="contactPhone"
                                   value="${customer.contactPhone}"
                                   pattern="[0-9]{11}"
                                   placeholder="${i18n.t('customer.phonePlaceholder')}"
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                </div>

                <!-- 版本 -->
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.edition')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <select class="form-select"
                            name="edition"
                            required
                            style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        <option value="">${i18n.t('customer.selectEdition')}</option>
                        <option value="basic" ${customer.edition === 'basic' ? 'selected' : ''}>${i18n.t('customer.basicEditionShort')}</option>
                        <option value="professional" ${customer.edition === 'professional' ? 'selected' : ''}>${i18n.t('customer.professionalEditionShort')}</option>
                    </select>
                </div>

                <!-- 到期时间类型 -->
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.expiryDateType')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <select class="form-select"
                            id="editExpiryType"
                            onchange="Router.handleEditExpiryTypeChange()"
                            required
                            style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        <option value="">${i18n.t('customer.selectEdition')}</option>
                        <option value="1month">${i18n.t('customer.oneMonth')}</option>
                        <option value="3months">${i18n.t('customer.threeMonths')}</option>
                        <option value="6months">${i18n.t('customer.sixMonths')}</option>
                        <option value="custom">${i18n.t('customer.customDate')}</option>
                        <option value="permanent">${i18n.t('customer.permanentValid')}</option>
                    </select>
                </div>

                <!-- 具体到期日期（条件显示） -->
                <div class="form-group" id="editCustomExpiryDate" style="display: none; margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.specificExpiryDate')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <input type="date"
                           class="form-control"
                           name="expiryDate"
                           id="editExpiryDateInput"
                           value="${customer.expiryDate}"
                           style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                </div>

                <!-- 计算的到期日期（条件显示） -->
                <div class="form-group" id="editCalculatedExpiryDate" style="display: none; margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.calculatedExpiryDate')}
                    </label>
                    <div class="form-control-plaintext" id="editExpiryDateDisplay" style="padding: 8px 0; color: var(--text-primary);"></div>
                </div>

                <!-- 状态 -->
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('common.status')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" name="statusEnabled" id="editStatusEnabled" ${customer.status === 'active' ? 'checked' : ''}>
                        <label class="form-check-label" for="editStatusEnabled" id="editStatusLabel">${customer.status === 'active' ? i18n.t('customer.accountStatusValue.enabled') : i18n.t('customer.accountStatusValue.disabled')}</label>
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button type="button" class="btn btn-light" onclick="Router.closeDrawer()" style="height: 40px; padding: 0 20px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); font-size: 15px; font-weight: 500;">
                <i class="bi bi-x-circle me-1"></i>${i18n.t('common.cancel')}
            </button>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('editCustomerForm').requestSubmit()" style="height: 40px; padding: 0 20px; border-radius: 10px; font-size: 15px; font-weight: 500; background: #007AFF; border: none;">
                <i class="bi bi-check-circle me-1"></i>${i18n.t('common.save')}
            </button>
        `;

        this.openDrawer(i18n.t('customer.edit'), content, footer);

        // 添加状态开关监听事件和初始化到期时间显示
        setTimeout(() => {
            const statusCheckbox = document.getElementById('editStatusEnabled');
            const statusLabel = document.getElementById('editStatusLabel');

            if (statusCheckbox) {
                statusCheckbox.addEventListener('change', function() {
                    statusLabel.textContent = this.checked ? i18n.t('customer.accountStatusValue.enabled') : i18n.t('customer.accountStatusValue.disabled');
                });
            }

            // 初始化到期时间类型为"具体日期"并显示日期输入框
            const editExpiryType = document.getElementById('editExpiryType');
            const editCustomExpiryDate = document.getElementById('editCustomExpiryDate');
            if (editExpiryType && editCustomExpiryDate && customer.expiryDate) {
                editExpiryType.value = 'custom';
                editCustomExpiryDate.style.display = 'block';
            }
        }, 100);
    },

    /**
     * 保存客户信息
     */
    saveCustomer: async function(event, id) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 转换数值类型
        data.siteCount = parseInt(data.siteCount);
        data.deviceCount = parseInt(data.deviceCount);

        // 处理到期日期
        const expiryType = document.getElementById('editExpiryType').value;
        if (expiryType === 'custom') {
            data.expiryDate = document.getElementById('editExpiryDateInput').value;
        } else {
            const expiryDateDisplay = document.getElementById('editExpiryDateDisplay');
            data.expiryDate = expiryDateDisplay.getAttribute('data-expiry-date');
        }

        // 处理状态开关：checkbox 选中为 'active'，未选中为 'inactive'
        data.status = data.statusEnabled === 'on' ? 'active' : 'inactive';
        delete data.statusEnabled;

        const result = await MockAPI.customers.update(id, data);

        if (result.success) {
            alert('保存成功!');
            this.closeDrawer();
            // 刷新页面
            window.location.reload();
        } else {
            alert('保存失败: ' + result.message);
        }
    },

    /**
     * 客户续费
     */
    renewCustomer: function(id) {
        if (confirm('确定要为该客户续费吗？')) {
            alert('续费成功！有效期已延长一年。');
            window.location.reload();
        }
    },

    /**
     * 切换客户账号状态
     */
    toggleCustomerStatus: async function(id, isActive) {
        const newStatus = isActive ? 'active' : 'inactive';
        const statusText = isActive ? '启用' : '禁用';

        try {
            // 更新状态
            const result = await MockAPI.customers.update(id, { status: newStatus });

            if (result.success) {
                // 显示提示信息
                const toast = document.createElement('div');
                toast.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: ${isActive ? '#34C759' : '#8E8E93'};
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease-out;
                `;
                toast.textContent = `账号已${statusText}`;
                document.body.appendChild(toast);

                // 3秒后移除提示
                setTimeout(() => {
                    toast.style.animation = 'slideOut 0.3s ease-out';
                    setTimeout(() => toast.remove(), 300);
                }, 3000);

                // 刷新列表
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } else {
                alert('状态更新失败: ' + result.message);
                // 恢复开关状态
                window.location.reload();
            }
        } catch (error) {
            console.error('状态更新失败:', error);
            alert('状态更新失败，请重试');
            // 恢复开关状态
            window.location.reload();
        }
    },

    /**
     * 删除客户
     */
    deleteCustomer: async function(id) {
        const confirmed = await App.confirm(i18n.t('customer.confirmDeleteMessage'), {
            danger: true,
            title: i18n.t('common.delete'),
            confirmText: i18n.t('common.delete')
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await MockAPI.customers.delete(id);

            if (result.success) {
                // 显示成功提示
                App.showToast(i18n.t('common.success'), 'success');

                // 刷新列表
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } else {
                App.showToast(i18n.t('common.error') + ': ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('删除失败:', error);
            App.showToast(i18n.t('common.error'), 'danger');
        }
    },

    /**
     * 重置筛选
     */
    resetFilters: function() {
        document.getElementById('customerSearch').value = '';
        document.getElementById('versionFilter').value = '';
        window.location.reload();
    },

    /**
     * 显示新增客户弹窗
     */
    showAddCustomerModal: function() {
        window.location.hash = '/customer/create';
    },

    /**
     * 新增客户
     */
    addCustomer: function() {
        const content = `
            <form id="addCustomerForm" onsubmit="Router.createCustomer(event)" style="padding: 24px;">
                <!-- 客户名称 -->
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.customerName')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <input type="text"
                           class="form-control"
                           name="customerName"
                           required
                           style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                </div>

                <!-- 账号和密码 -->
                <div class="row" style="margin-bottom: 20px;">
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.account')} <span style="color: #FF3B30;">*</span>
                            </label>
                            <input type="text"
                                   class="form-control"
                                   name="account"
                                   required
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.password')} <span style="color: #FF3B30;">*</span>
                            </label>
                            <input type="text"
                                   class="form-control"
                                   name="password"
                                   value="admin"
                                   required
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                </div>

                <!-- 联系人和联系电话 -->
                <div class="row" style="margin-bottom: 20px;">
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.contactPerson')} <span style="color: #FF3B30;">*</span>
                            </label>
                            <input type="text"
                                   class="form-control"
                                   name="contactPerson"
                                   required
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                                ${i18n.t('customer.contactPhone')}
                            </label>
                            <input type="tel"
                                   class="form-control"
                                   name="contactPhone"
                                   pattern="[0-9]{11}"
                                   placeholder="${i18n.t('customer.phonePlaceholder')}"
                                   style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        </div>
                    </div>
                </div>

                <!-- 版本 -->
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.edition')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <select class="form-select"
                            name="edition"
                            required
                            style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        <option value="">${i18n.t('customer.selectEdition')}</option>
                        <option value="basic">${i18n.t('customer.basicEditionShort')}</option>
                        <option value="professional">${i18n.t('customer.professionalEditionShort')}</option>
                    </select>
                </div>

                <!-- 到期时间类型 -->
                <div class="form-group" style="margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.expiryDateType')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <select class="form-select"
                            id="expiryType"
                            onchange="Router.handleExpiryTypeChange()"
                            required
                            style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                        <option value="">${i18n.t('customer.selectEdition')}</option>
                        <option value="1month">${i18n.t('customer.oneMonth')}</option>
                        <option value="3months">${i18n.t('customer.threeMonths')}</option>
                        <option value="6months">${i18n.t('customer.sixMonths')}</option>
                        <option value="custom">${i18n.t('customer.customDate')}</option>
                        <option value="permanent">${i18n.t('customer.permanentValid')}</option>
                    </select>
                </div>

                <!-- 具体到期日期（条件显示） -->
                <div class="form-group" id="customExpiryDate" style="display: none; margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.specificExpiryDate')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <input type="date"
                           class="form-control"
                           name="expiryDate"
                           id="expiryDateInput"
                           style="border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); padding: 10px 14px; font-size: 15px; transition: all 0.2s;">
                </div>

                <!-- 计算的到期日期（条件显示） -->
                <div class="form-group" id="calculatedExpiryDate" style="display: none; margin-bottom: 20px;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('customer.calculatedExpiryDate')}
                    </label>
                    <div class="form-control-plaintext" id="expiryDateDisplay" style="padding: 8px 0; color: var(--text-primary);"></div>
                </div>

                <!-- 状态 -->
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                        ${i18n.t('common.status')} <span style="color: #FF3B30;">*</span>
                    </label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" name="statusEnabled" id="statusEnabled" checked>
                        <label class="form-check-label" for="statusEnabled" id="statusLabel">${i18n.t('customer.accountStatusValue.enabled')}</label>
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button type="button" class="btn btn-light" onclick="Router.closeDrawer()" style="height: 40px; padding: 0 20px; border-radius: 10px; border: 1.5px solid rgba(0, 0, 0, 0.1); font-size: 15px; font-weight: 500;">
                <i class="bi bi-x-circle me-1"></i>${i18n.t('common.cancel')}
            </button>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('addCustomerForm').requestSubmit()" style="height: 40px; padding: 0 20px; border-radius: 10px; font-size: 15px; font-weight: 500; background: #007AFF; border: none;">
                <i class="bi bi-check-circle me-1"></i>${i18n.t('common.save')}
            </button>
        `;

        this.openDrawer(i18n.t('customer.createNew'), content, footer);

        // 添加状态开关监听事件
        setTimeout(() => {
            const statusCheckbox = document.getElementById('statusEnabled');
            const statusLabel = document.getElementById('statusLabel');

            if (statusCheckbox) {
                statusCheckbox.addEventListener('change', function() {
                    statusLabel.textContent = this.checked ? i18n.t('customer.accountStatusValue.enabled') : i18n.t('customer.accountStatusValue.disabled');
                });
            }
        }, 100);
    },

    /**
     * 处理到期时间类型变化
     */
    handleExpiryTypeChange: function() {
        const expiryType = document.getElementById('expiryType').value;
        const customExpiryDate = document.getElementById('customExpiryDate');
        const calculatedExpiryDate = document.getElementById('calculatedExpiryDate');
        const expiryDateInput = document.getElementById('expiryDateInput');
        const expiryDateDisplay = document.getElementById('expiryDateDisplay');

        if (expiryType === 'custom') {
            // 显示具体日期选择
            customExpiryDate.style.display = 'block';
            calculatedExpiryDate.style.display = 'none';
            expiryDateInput.required = true;
        } else if (expiryType) {
            // 隐藏具体日期选择，显示计算后的日期
            customExpiryDate.style.display = 'none';
            calculatedExpiryDate.style.display = 'block';
            expiryDateInput.required = false;

            // 根据选择的类型计算到期日期
            const today = new Date();
            let expiryDate = '';
            let displayText = '';

            if (expiryType === '1month') {
                today.setMonth(today.getMonth() + 1);
                expiryDate = today.toISOString().split('T')[0];
                displayText = expiryDate;
            } else if (expiryType === '3months') {
                today.setMonth(today.getMonth() + 3);
                expiryDate = today.toISOString().split('T')[0];
                displayText = expiryDate;
            } else if (expiryType === '6months') {
                today.setMonth(today.getMonth() + 6);
                expiryDate = today.toISOString().split('T')[0];
                displayText = expiryDate;
            } else if (expiryType === 'permanent') {
                expiryDate = '9999-12-31';
                displayText = '永久有效';
            }

            expiryDateDisplay.textContent = displayText;
            expiryDateDisplay.setAttribute('data-expiry-date', expiryDate);
        } else {
            // 未选择类型
            customExpiryDate.style.display = 'none';
            calculatedExpiryDate.style.display = 'none';
        }
    },

    /**
     * 处理编辑表单的到期时间类型变化
     */
    handleEditExpiryTypeChange: function() {
        const expiryType = document.getElementById('editExpiryType').value;
        const customExpiryDate = document.getElementById('editCustomExpiryDate');
        const calculatedExpiryDate = document.getElementById('editCalculatedExpiryDate');
        const expiryDateInput = document.getElementById('editExpiryDateInput');
        const expiryDateDisplay = document.getElementById('editExpiryDateDisplay');

        if (expiryType === 'custom') {
            // 显示具体日期选择
            customExpiryDate.style.display = 'block';
            calculatedExpiryDate.style.display = 'none';
            expiryDateInput.required = true;
        } else if (expiryType) {
            // 隐藏具体日期选择，显示计算后的日期
            customExpiryDate.style.display = 'none';
            calculatedExpiryDate.style.display = 'block';
            expiryDateInput.required = false;

            // 根据选择的类型计算到期日期
            const today = new Date();
            let expiryDate = '';
            let displayText = '';

            if (expiryType === '1month') {
                today.setMonth(today.getMonth() + 1);
                expiryDate = today.toISOString().split('T')[0];
                displayText = expiryDate;
            } else if (expiryType === '3months') {
                today.setMonth(today.getMonth() + 3);
                expiryDate = today.toISOString().split('T')[0];
                displayText = expiryDate;
            } else if (expiryType === '6months') {
                today.setMonth(today.getMonth() + 6);
                expiryDate = today.toISOString().split('T')[0];
                displayText = expiryDate;
            } else if (expiryType === 'permanent') {
                expiryDate = '9999-12-31';
                displayText = '永久有效';
            }

            expiryDateDisplay.textContent = displayText;
            expiryDateDisplay.setAttribute('data-expiry-date', expiryDate);
        } else {
            // 未选择类型
            customExpiryDate.style.display = 'none';
            calculatedExpiryDate.style.display = 'none';
        }
    },

    /**
     * 创建客户
     */
    createCustomer: async function(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 处理到期日期
        const expiryType = document.getElementById('expiryType').value;
        if (expiryType === 'custom') {
            data.expiryDate = document.getElementById('expiryDateInput').value;
        } else {
            const expiryDateDisplay = document.getElementById('expiryDateDisplay');
            data.expiryDate = expiryDateDisplay.getAttribute('data-expiry-date');
        }

        // 处理状态开关
        const statusEnabled = document.getElementById('statusEnabled').checked;
        data.status = statusEnabled ? 'active' : 'inactive';

        // 设置默认值
        data.siteCount = 0;      // 默认站点数量为0
        data.deviceCount = 0;    // 默认设备数量为0

        // 删除不需要的字段
        delete data.statusEnabled;

        const result = await MockAPI.customers.create(data);

        if (result.success) {
            alert('客户创建成功!');
            this.closeDrawer();
            // 刷新页面
            window.location.reload();
        } else {
            alert('创建失败: ' + result.message);
        }
    }
};

// 导出到全局
if (typeof window !== 'undefined') {
    window.Router = Router;
}
