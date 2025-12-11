/**
 * 认证管理模块
 * 处理用户登录、登出、会话管理
 */
const Auth = {
    // Token存储键
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_info',

    // Mock用户数据
    mockUsers: [
        {
            id: 1,
            username: 'admin',
            password: '123456',
            name: '管理员',
            email: 'admin@energy.com',
            role: 'admin',
            avatar: null
        }
    ],

    /**
     * 登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @param {boolean} rememberMe - 是否记住登录状态
     * @returns {object} 登录结果
     */
    login: function(username, password, rememberMe = false) {
        // 查找用户
        const user = this.mockUsers.find(u => u.username === username && u.password === password);

        if (user) {
            // 生成Token（实际项目中应该由后端生成）
            const token = this.generateToken();

            // 保存用户信息（移除密码）
            const userInfo = {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            };

            // 根据记住我选项决定存储方式
            if (rememberMe) {
                localStorage.setItem(this.TOKEN_KEY, token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
            } else {
                sessionStorage.setItem(this.TOKEN_KEY, token);
                sessionStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
            }

            return {
                success: true,
                message: '登录成功',
                data: {
                    token,
                    user: userInfo
                }
            };
        } else {
            return {
                success: false,
                message: '用户名或密码错误'
            };
        }
    },

    /**
     * 登出
     */
    logout: function() {
        // 清除存储
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);

        // 跳转到登录页
        window.location.href = './index.html';
    },

    /**
     * 获取Token
     * @returns {string|null} Token
     */
    getToken: function() {
        return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    },

    /**
     * 获取当前用户信息
     * @returns {object|null} 用户信息
     */
    getCurrentUser: function() {
        const userStr = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                console.error('Failed to parse user info:', e);
                return null;
            }
        }
        return null;
    },

    /**
     * 检查是否已登录
     * @returns {boolean} 是否已登录
     */
    isAuthenticated: function() {
        return !!this.getToken();
    },

    /**
     * 检查权限
     * @param {string} permission - 权限代码
     * @returns {boolean} 是否有权限
     */
    hasPermission: function(permission) {
        const user = this.getCurrentUser();
        if (!user) return false;

        // 管理员拥有所有权限
        if (user.role === 'admin') return true;

        // 这里可以扩展更复杂的权限检查逻辑
        return false;
    },

    /**
     * 生成Token（Mock实现）
     * @returns {string} Token
     */
    generateToken: function() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2);
        return `token_${timestamp}_${random}`;
    },

    /**
     * 验证Token（Mock实现）
     * @param {string} token - Token
     * @returns {boolean} Token是否有效
     */
    validateToken: function(token) {
        // 实际项目中应该向后端发送请求验证
        // 这里简单判断Token格式和是否过期（24小时）
        if (!token || !token.startsWith('token_')) return false;

        try {
            const parts = token.split('_');
            const timestamp = parseInt(parts[1]);
            const now = Date.now();
            const expiryTime = 24 * 60 * 60 * 1000; // 24小时

            return (now - timestamp) < expiryTime;
        } catch (e) {
            return false;
        }
    },

    /**
     * 刷新Token（Mock实现）
     * @returns {string} 新Token
     */
    refreshToken: function() {
        const newToken = this.generateToken();
        const oldToken = this.getToken();

        // 更新存储
        if (localStorage.getItem(this.TOKEN_KEY)) {
            localStorage.setItem(this.TOKEN_KEY, newToken);
        } else if (sessionStorage.getItem(this.TOKEN_KEY)) {
            sessionStorage.setItem(this.TOKEN_KEY, newToken);
        }

        return newToken;
    },

    /**
     * 更新用户信息
     * @param {object} userInfo - 用户信息
     */
    updateUserInfo: function(userInfo) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...userInfo };

        if (localStorage.getItem(this.USER_KEY)) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
        } else if (sessionStorage.getItem(this.USER_KEY)) {
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
        }
    },

    /**
     * 修改密码
     * @param {string} oldPassword - 旧密码
     * @param {string} newPassword - 新密码
     * @returns {object} 操作结果
     */
    changePassword: function(oldPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: '用户未登录' };
        }

        // 在实际项目中，这里应该向后端发送请求
        const user = this.mockUsers.find(u => u.username === currentUser.username);
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        if (user.password !== oldPassword) {
            return { success: false, message: '原密码错误' };
        }

        user.password = newPassword;
        return { success: true, message: '密码修改成功' };
    },

    /**
     * 初始化认证检查
     * 在需要登录的页面调用
     */
    initAuthCheck: function() {
        // 检查是否在登录页
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            // 如果已登录，跳转到控制台
            if (this.isAuthenticated()) {
                window.location.href = './dashboard.html';
            }
            return;
        }

        // 检查是否已登录
        if (!this.isAuthenticated()) {
            // 未登录，跳转到登录页
            window.location.href = './index.html';
            return;
        }

        // 验证Token
        const token = this.getToken();
        if (!this.validateToken(token)) {
            // Token无效或过期
            alert('登录已过期，请重新登录');
            this.logout();
            return;
        }

        // Token有效，继续
        return true;
    }
};

// 导出到全局
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}
