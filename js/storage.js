const DB_KEY = 'hiring_chaos_apps_v2';

// Predefined Recruiters for Level 2
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
                reviewed: null,
                decided: null
            },
            history: [{ status: 'APPLIED', at: new Date().toISOString(), actor: 'System' }]
        };
        apps.push(newApp);
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
    },

    // Claim: Move from APPLIED -> UNDER_REVIEW
    claimApp: (id, recruiterName) => {
        const apps = DB.getApps().map(app => {
            if (app.id === parseInt(id)) {
                return {
                    ...app,
                    status: 'UNDER_REVIEW',
                    owner: recruiterName,
                    timestamps: { ...app.timestamps, reviewed: new Date().toISOString() },
                    history: [...app.history, { status: 'UNDER_REVIEW', at: new Date().toISOString(), actor: recruiterName }]
                };
            }
            return app;
        });
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
    },

    // Decide: Move from UNDER_REVIEW -> HIRED/REJECTED
    decideApp: (id, status, recruiterName) => {
        const apps = DB.getApps().map(app => {
            if (app.id === parseInt(id)) {
                return {
                    ...app,
                    status: status,
                    timestamps: { ...app.timestamps, decided: new Date().toISOString() },
                    history: [...app.history, { status: status, at: new Date().toISOString(), actor: recruiterName }]
                };
            }
            return app;
        });
        localStorage.setItem(DB_KEY, JSON.stringify(apps));
    },

    findByEmail: (email) => DB.getApps().find(app => app.email.toLowerCase() === email.toLowerCase())
};