(function() {
    const currentUser = sessionStorage.getItem('active_recruiter');
    const tableBody = document.getElementById('appTableBody');
    const statsDisplay = document.getElementById('statsDisplay');

    if (!currentUser) {
        window.location.href = 'recruiter-login.html';
        return;
    }

    document.getElementById('userBadge').textContent = "👤 " + currentUser;

    window.renderDashboard = function() {
        const apps = DB.getApps();
        
        // 1. Stats
        statsDisplay.innerHTML = RECRUITERS.map(r => {
            const load = apps.filter(a => a.owner === r.name && a.status === 'ANALYSING').length;
            return `<div class="stat-item"><span class="stat-val">${load}</span><small>${r.name.split(' ')[0]}</small></div>`;
        }).join('');

        // 2. Table
        tableBody.innerHTML = '';
        if (apps.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:3rem; color:#64748b;">No candidates found.</td></tr>';
            return;
        }

        apps.forEach(app => {
            const isAnalysing = (app.status === 'ANALYSING');
            const isOwner = (app.owner === currentUser);
            const isFinal = (app.status === 'HIRED' || app.status === 'REJECTED');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong>${app.name}</strong><br>
                    <small style="color:#64748b">${app.role} | ${app.resumeName}</small>
                </td>
                <td><span class="badge status-${app.status.toLowerCase()}">${app.status}</span></td>
                <td><small>${app.owner || '--'}</small></td>
                <td>
                    ${!isFinal ? `
                        <button class="btn-outline" onclick="handleView(${app.id})">View Resume</button>
                        <button class="btn-primary" style="background:#16a34a" ${(!isAnalysing || !isOwner) ? 'disabled' : ''} onclick="handleUpdate(${app.id}, 'HIRED')">Hire</button>
                        <button class="btn-primary" style="background:#dc2626" ${(!isAnalysing || !isOwner) ? 'disabled' : ''} onclick="handleUpdate(${app.id}, 'REJECTED')">Reject</button>
                    ` : '<small>Workflow Complete</small>'}
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    window.handleView = function(id) {
        const app = DB.getApps().find(a => a.id === id);
        if (app.status === 'APPLIED') {
            DB.claimAndReview(id, currentUser);
        }
        
        const win = window.open('', '_blank');
        win.document.write('<h1>Resume Viewer</h1><p>Candidate: ' + app.name + '</p><hr><button onclick="window.close()">Back</button>');
        win.document.close();
        renderDashboard();
    };

    window.handleUpdate = function(id, status) {
        DB.updateStatus(id, status);
        renderDashboard();
    };

    renderDashboard();
})();