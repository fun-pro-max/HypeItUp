const DB_KEY = 'hiring_chaos_apps';

const DB = {
    // Get all applications
    getApps: () => {
        return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    },

    // Save a new application
    saveApp: (appData) => {
        const apps = DB.getApps();
        const newApp = {
            id: Date.now(),
            ...appData,
            status: 'Pending',
            appliedAt: new Date().toLocaleDateString()
        };
        apps.push(newApp);
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
        return newApp;
    },

    // Update status of existing app
    updateStatus: (id, newStatus) => {
        const apps = DB.getApps().map(app => 
            app.id === parseInt(id) ? { ...app, status: newStatus } : app
        );
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
    },

    // Find app by email
    findByEmail: (email) => {
        return DB.getApps().find(app => app.email.toLowerCase() === email.toLowerCase());
    }
};