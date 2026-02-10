const DB_KEY = 'hiring_chaos_v3_multi';

const COMPANIES = [
    { id: 'tech-vision', name: 'TechVision Inc' },
    { id: 'green-energy', name: 'GreenEnergy Co' }
];

const RECRUITERS = [
    { companyId: 'tech-vision', name: "Sarah Jenkins", initial: "SJ", role: "Tech Lead" },
    { companyId: 'tech-vision', name: "Mark Anthony", initial: "MA", role: "HR Manager" },
    { companyId: 'green-energy', name: "Jenny Wu", initial: "JW", role: "Director" }
];

const DB = {
    getApps: () => JSON.parse(localStorage.getItem(DB_KEY) || '[]'),
    
    saveApps: (apps) => localStorage.setItem(DB_KEY, JSON.stringify(apps)),
    
    getCompanyApps: (companyId) => {
        return DB.getApps().filter(app => app.companyId === companyId);
    },
    
    addApp: (appData) => {
        const apps = DB.getApps();
        const activeCompanyId = sessionStorage.getItem('selected_company_id');
        
        apps.push({
            id: Date.now(),
            companyId: activeCompanyId,
            name: appData.name,
            role: appData.role,
            status: 'APPLIED',
            owner: null,
            resumeName: appData.resumeName,
            resumeUrl: `resumes/${appData.resumeName}`, // Path to static folder
            timestamp: new Date().toISOString()
        });
        DB.saveApps(apps);
    },

    updateStatus: (id, status, owner = null) => {
        const apps = DB.getApps().map(a => {
            if (a.id === id) {
                const update = { ...a, status };
                if (owner) update.owner = owner;
                return update;
            }
            return a;
        });
        DB.saveApps(apps);
    }
};