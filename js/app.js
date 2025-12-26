/**
 * 应用主逻辑
 * 初始化和全局事件处理
 */
const App = {
    /**
     * 初始化应用
     */
    init: async function() {
        // 检查认证状态
        if (!Auth.initAuthCheck()) {
            return;
        }

        // 强制设置为中文
        localStorage.setItem('language', 'zh-CN');

        // 初始化i18n
        await i18n.init();

        // 更新语言显示
        this.updateLanguageDisplay();

        // 初始化用户信息
        this.initUserInfo();

        // 初始化路由
        Router.init();

        // 初始化事件监听
        this.initEventListeners();

        // 初始化侧边栏状态
        this.initSidebar();
    },

    /**
     * 初始化用户信息显示
     */
    initUserInfo: function() {
        const user = Auth.getCurrentUser();
        if (user) {
            const userNameElement = document.getElementById('currentUser');
            if (userNameElement) {
                userNameElement.textContent = user.name || user.username;
            }
        }
    },

    /**
     * 初始化事件监听
     */
    initEventListeners: function() {
        // 侧边栏切换
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // 语言切换
        const languageDropdown = document.getElementById('languageDropdown');
        if (languageDropdown) {
            const languageLinks = document.querySelectorAll('[data-lang]');
            languageLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = link.getAttribute('data-lang');
                    this.changeLanguage(lang);
                });
            });
        }

        // 退出登录
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // 窗口大小变化时的响应式处理
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 点击侧边栏外部关闭侧边栏（移动端）
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');

            if (window.innerWidth <= 991) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            }
        });
    },

    /**
     * 初始化侧边栏
     */
    initSidebar: function() {
        // 从LocalStorage获取侧边栏状态
        const sidebarCollapsed = localStorage.getItem('sidebar_collapsed');
        if (sidebarCollapsed === 'true' && window.innerWidth > 991) {
            this.toggleSidebar();
        }
    },

    /**
     * 切换侧边栏
     */
    toggleSidebar: function() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (window.innerWidth <= 991) {
            // 移动端：显示/隐藏侧边栏
            sidebar.classList.toggle('show');
        } else {
            // PC端：收缩/展开侧边栏
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');

            // 保存状态到LocalStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebar_collapsed', isCollapsed);
        }
    },

    /**
     * 更新语言显示
     */
    updateLanguageDisplay: function() {
        const currentLang = i18n.getCurrentLanguage();
        const langNames = {
            'zh-CN': '中文',
            'en-US': 'English'
        };
        const currentLanguageElement = document.getElementById('currentLanguage');
        if (currentLanguageElement) {
            currentLanguageElement.textContent = langNames[currentLang] || '中文';
        }
    },

    /**
     * 切换语言
     */
    changeLanguage: function(lang) {
        i18n.setLanguage(lang);

        // 更新语言按钮文本
        this.updateLanguageDisplay();

        // 重新加载当前路由以更新动态内容
        if (typeof Router !== 'undefined' && Router.handleRouteChange) {
            Router.handleRouteChange();
        }

        // 显示提示
        this.showToast(i18n.t('common.success'), 'success');
    },

    /**
     * 退出登录
     */
    logout: function() {
        // 显示退出登录确认模态框
        const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        logoutModal.show();

        // 绑定确认退出按钮
        const confirmBtn = document.getElementById('confirmLogoutBtn');
        confirmBtn.onclick = () => {
            logoutModal.hide();
            Auth.logout();
        };
    },

    /**
     * 窗口大小变化处理
     */
    handleResize: function() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (window.innerWidth > 991) {
            // PC端
            sidebar.classList.remove('show');

            // 恢复保存的收缩状态
            const sidebarCollapsed = localStorage.getItem('sidebar_collapsed');
            if (sidebarCollapsed === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            }
        } else {
            // 移动端
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    },

    /**
     * 显示Toast提示
     */
    showToast: function(message, type = 'info') {
        // 创建Toast容器（如果不存在）
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                min-width: 250px;
            `;
            document.body.appendChild(toastContainer);
        }

        // 创建Toast
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show`;
        toast.role = 'alert';
        toast.style.cssText = `
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            margin-bottom: 10px;
            animation: slideInRight 0.3s ease-out;
        `;

        const iconMap = {
            success: 'check-circle',
            danger: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };

        toast.innerHTML = `
            <i class="bi bi-${iconMap[type]}-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        toastContainer.appendChild(toast);

        // 3秒后自动移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },

    /**
     * 显示确认对话框 - Apple HIG风格
     * @param {string} message - 确认消息
     * @param {object} options - 可选配置
     * @returns {Promise<boolean>} - 用户选择结果
     */
    confirm: function(message, options = {}) {
        return new Promise((resolve) => {
            // 设置消息内容
            const messageElement = document.getElementById('confirmDialogMessage');
            if (messageElement) {
                messageElement.textContent = message;
            }

            // 设置标题（如果提供）
            const titleElement = document.getElementById('confirmDialogTitleText');
            if (titleElement && options.title) {
                titleElement.textContent = options.title;
            } else if (titleElement) {
                titleElement.textContent = i18n.t('common.confirm');
            }

            // 设置按钮文本
            const cancelTextElement = document.getElementById('confirmDialogCancelText');
            const confirmTextElement = document.getElementById('confirmDialogConfirmText');
            if (cancelTextElement) {
                cancelTextElement.textContent = options.cancelText || i18n.t('common.cancel');
            }
            if (confirmTextElement) {
                confirmTextElement.textContent = options.confirmText || i18n.t('common.confirm');
            }

            // 设置按钮样式（危险操作使用红色）
            const confirmBtn = document.getElementById('confirmDialogConfirmBtn');
            if (confirmBtn) {
                if (options.danger) {
                    confirmBtn.style.background = '#FF3B30';
                    confirmBtn.onmouseover = function() {
                        this.style.background = '#D52E23';
                        this.style.transform = 'translateY(-1px)';
                        this.style.boxShadow = '0 4px 12px rgba(255, 59, 48, 0.3)';
                    };
                    confirmBtn.onmouseout = function() {
                        this.style.background = '#FF3B30';
                        this.style.transform = 'translateY(0)';
                        this.style.boxShadow = 'none';
                    };
                } else {
                    confirmBtn.style.background = '#007AFF';
                    confirmBtn.onmouseover = function() {
                        this.style.background = '#0051D5';
                        this.style.transform = 'translateY(-1px)';
                        this.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3)';
                    };
                    confirmBtn.onmouseout = function() {
                        this.style.background = '#007AFF';
                        this.style.transform = 'translateY(0)';
                        this.style.boxShadow = 'none';
                    };
                }
            }

            // 显示模态框
            const confirmDialog = new bootstrap.Modal(document.getElementById('confirmDialog'));
            confirmDialog.show();

            // 绑定确认按钮
            const confirmClickHandler = () => {
                confirmDialog.hide();
                resolve(true);
                // 移除事件监听器
                confirmBtn.removeEventListener('click', confirmClickHandler);
            };
            confirmBtn.addEventListener('click', confirmClickHandler);

            // 绑定取消按钮和关闭事件
            const dialogElement = document.getElementById('confirmDialog');
            const cancelHandler = () => {
                resolve(false);
            };
            dialogElement.addEventListener('hidden.bs.modal', cancelHandler, { once: true });
        });
    },

    /**
     * 显示Loading
     */
    showLoading: function() {
        Router.showLoading();
    },

    /**
     * 隐藏Loading
     */
    hideLoading: function() {
        Router.hideLoading();
    },

    /**
     * 防抖函数
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     */
    throttle: function(func, wait) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, wait);
            }
        };
    },

    /**
     * 格式化日期
     */
    formatDate: function(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    /**
     * 格式化文件大小
     */
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * 复制到剪贴板
     */
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('复制成功', 'success');
            }).catch(() => {
                this.showToast('复制失败', 'danger');
            });
        } else {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                this.showToast('复制成功', 'success');
            } catch (err) {
                this.showToast('复制失败', 'danger');
            }
            document.body.removeChild(textarea);
        }
    },

    /**
     * 导出为CSV
     */
    exportToCSV: function(data, filename = 'export.csv') {
        const csvContent = this.convertToCSV(data);
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }
    },

    /**
     * 转换为CSV格式
     */
    convertToCSV: function(data) {
        if (!data || data.length === 0) return '';

        const keys = Object.keys(data[0]);
        const header = keys.join(',');
        const rows = data.map(row => {
            return keys.map(key => {
                let value = row[key];
                if (typeof value === 'string' && value.includes(',')) {
                    value = `"${value}"`;
                }
                return value;
            }).join(',');
        });

        return [header, ...rows].join('\n');
    }
};

// DOM加载完成后初始化应用
if (typeof window !== 'undefined') {
    window.App = App;

    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            App.init();
        });
    } else {
        App.init();
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .fade-in {
        animation: slideUp 0.3s ease-out;
    }
`;
document.head.appendChild(style);
