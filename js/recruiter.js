(function() {
    const user = sessionStorage.getItem('active_recruiter');
    const coId = sessionStorage.getItem('selected_company_id');
    const coName = sessionStorage.getItem('selected_company_name');

    if (!user || !coId) {
        window.location.href = 'recruiter-login.html';
        return;
    }

    document.getElementById('navCo').textContent = coName;
    document.getElementById('userBadge').textContent = "👤 " + user;

    window.renderDashboard = function() {
        const apps = DB.getCompanyApps(coId);
        const tbody = document.getElementById('appTableBody');
        const stats = document.getElementById('statsDisplay');

        // Stats
        const coRecruiters = RECRUITERS.filter(r => r.companyId === coId);
        stats.innerHTML = coRecruiters.map(r => {
            const load = apps.filter(a => a.owner === r.name && a.status === 'ANALYSING').length;
            return `<div class="stat-item"><span class="stat-val">${load}</span><small>${r.initial}</small></div>`;
        }).join('');

        // Table
        tbody.innerHTML = '';
        if (apps.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:3rem;">No applications.</td></tr>';
            return;
        }

        apps.forEach(app => {
            const isOwner = app.owner === user;
            const isAnalysing = app.status === 'ANALYSING';
            const isFinal = app.status === 'HIRED' || app.status === 'REJECTED';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${app.name}</strong><br><small>${app.resumeName}</small></td>
                <td><span class="badge status-${app.status.toLowerCase()}">${app.status}</span></td>
                <td><small>${app.owner || '--'}</small></td>
                <td>
                    ${!isFinal ? `
                        <button class="btn-outline" onclick="handleView(${app.id})">View Resume</button>
                        <button class="btn-primary" style="background:#16a34a" ${(!isAnalysing || !isOwner) ? 'disabled' : ''} onclick="handleUpdate(${app.id}, 'HIRED')">Hire</button>
                        <button class="btn-primary" style="background:#dc2626" ${(!isAnalysing || !isOwner) ? 'disabled' : ''} onclick="handleUpdate(${app.id}, 'REJECTED')">Reject</button>
                    ` : 'Closed'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    window.handleView = function(id) {
        const app = DB.getApps().find(a => a.id === id);
        
        // Ownership Logic
        if (app.status === 'APPLIED') {
            DB.updateStatus(id, 'ANALYSING', user);
        }

        // Native Browser Open (Static Asset)
        window.open(app.resumeUrl, '_blank');
        
        renderDashboard();
    };

    window.handleUpdate = function(id, status) {
        DB.updateStatus(id, status);
        renderDashboard();
    };

    renderDashboard();
})();