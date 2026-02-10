const DB_KEY = 'hiring_chaos_v2.5_stable';

const RECRUITERS = [
    { name: "Sarah Jenkins", initial: "SJ", role: "Technical Lead" },
    { name: "Mark Anthony", initial: "MA", role: "HR Manager" },
    { name: "Jenny Wu", initial: "JW", role: "Talent Director" }
];

const DB = {
    getApps: () => JSON.parse(localStorage.getItem(DB_KEY) || '[]'),
    
    saveApps: (apps) => localStorage.setItem(DB_KEY, JSON.stringify(apps)),
    
    addApp: (app) => {
        const apps = DB.getApps();
        apps.push({
            id: Date.now(),
            ...app,
            status: 'APPLIED',
            owner: null,
            viewed: false,
            timestamp: new Date().toISOString()
        });
        DB.saveApps(apps);
    },

    claimAndReview: (id, recruiterName) => {
        const apps = DB.getApps().map(a => {
            if (a.id === id) {
                return { ...a, status: 'ANALYSING', owner: recruiterName, viewed: true };
            }
            return a;
        });
        DB.saveApps(apps);
    },

    updateStatus: (id, status) => {
        const apps = DB.getApps().map(a => a.id === id ? { ...a, status } : a);
        DB.saveApps(apps);
    }
};