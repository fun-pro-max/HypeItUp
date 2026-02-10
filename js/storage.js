const DB_KEY = 'hiring_chaos_resolver_v2_5';
const RECRUITERS = ["Sarah Jenkins", "Mark Anthony", "Jenny Wu"];

const DB = {
    getApps: () => JSON.parse(localStorage.getItem(DB_KEY) || '[]'),
    
    saveApp: (appData) => {
        const apps = DB.getApps();
        const newApp = {
            id: Date.now(),
            ...appData,
            status: 'APPLIED',
            owner: null,
            timestamps: {
                applied: new Date().toISOString(),
                analysed: null,
                decided: null
            }
        };
        apps.push(newApp);
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
    },

    startAnalysis: (id, recruiterName) => {
        const apps = DB.getApps().map(app => {
            if (app.id === parseInt(id)) {
                return {
                    ...app,
                    status: 'ANALYSING',
                    owner: recruiterName,
                    timestamps: { ...app.timestamps, analysed: new Date().toISOString() }
                };
            }
            return app;
        });
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
    },

    decideApp: (id, status, recruiterName) => {
        const apps = DB.getApps().map(app => {
            if (app.id === parseInt(id)) {
                return {
                    ...app,
                    status: status,
                    owner: recruiterName,
                    timestamps: { ...app.timestamps, decided: new Date().toISOString() }
                };
            }
            return app;
        });
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
    },

    findByEmail: (email) => DB.getApps().find(app => app.email.toLowerCase() === email.toLowerCase())
};