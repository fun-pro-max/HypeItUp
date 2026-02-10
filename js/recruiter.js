// Initialize Recruiter Dropdown
const select = document.getElementById('activeRecruiter');
RECRUITERS.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
});

function calculateHours(isoString) {
    if (!isoString) return 0;
    const diff = new Date() - new Date(isoString);
    return Math.floor(diff / (1000 * 60 * 60));
}

function renderStats(apps) {
    const statsContainer = document.getElementById('loadStats');
    const counts = {};
    RECRUITERS.forEach(r => counts[r] = 0);
    
    apps.forEach(app => {
        if (app.owner && app.status === 'UNDER_REVIEW') counts[app.owner]++;
    });

    statsContainer.innerHTML = RECRUITERS.map(name => `
        <div class="stat-item">
            <span class="stat-value">${counts[name]}</span>
            <span style="font-size:0.7rem; color:var(--text-muted)">${name.split(' ')[0]}'s Load</span>
        </div>
    `).join('') + `<div style="margin-left:auto"><strong>Total Active Reviews:</strong> ${apps.filter(a => a.status === 'UNDER_REVIEW').length}</div>`;
}

function renderRecruiterTable() {
    const tbody = document.getElementById('recruiterTableBody');
    const roleFilter = document.getElementById('roleFilter').value;
    const currentActor = document.getElementById('activeRecruiter').value;
    const apps = DB.getApps();

    renderStats(apps);
    tbody.innerHTML = '';

    const filtered = roleFilter === 'All' ? apps : apps.filter(a => a.role === roleFilter);

    filtered.forEach(app => {
        const hoursSinceApplied = calculateHours(app.timestamps.applied);
        const hoursInReview = calculateHours(app.timestamps.reviewed);
        
        // Stale Logic
        let staleLabel = '';
        if (app.status === 'APPLIED' && hoursSinceApplied > 24) staleLabel = '<span class="stale-tag">⚠️ UNCLAIMED > 24H</span>';
        if (app.status === 'UNDER_REVIEW' && hoursInReview > 48) staleLabel = '<span class="stale-tag">⚠️ STUCK IN REVIEW > 48H</span>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${app.name}</strong> ${staleLabel}
                <small class="time-meta">Applied ${hoursSinceApplied}h ago</small>
            </td>
            <td>${app.owner || '<em style="color:#ccc">Unassigned</em>'}</td>
            <td><span class="badge status-${app.status.toLowerCase()}">${app.status}</span></td>
            <td>
                ${renderActions(app, currentActor)}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderActions(app, actor) {
    if (app.status === 'APPLIED') {
        return `<button class="btn-claim" onclick="handleClaim(${app.id})">Claim Application</button>`;
    }
    if (app.status === 'UNDER_REVIEW') {
        if (app.owner !== actor) return `<small style="color:var(--text-muted)">Locked to ${app.owner}</small>`;
        return `
            <button class="btn-primary" onclick="handleDecide(${app.id}, 'HIRED')" style="background:var(--success); padding: 0.4rem 0.8rem;">Hire</button>
            <button class="btn-primary" onclick="handleDecide(${app.id}, 'REJECTED')" style="background:var(--danger); padding: 0.4rem 0.8rem;">Reject</button>
        `;
    }
    return `<small class="time-meta">Finalized by ${app.owner}</small>`;
}

function handleClaim(id) {
    const actor = document.getElementById('activeRecruiter').value;
    DB.claimApp(id, actor);
    renderRecruiterTable();
}

function handleDecide(id, status) {
    const actor = document.getElementById('activeRecruiter').value;
    DB.decideApp(id, status, actor);
    renderRecruiterTable();
}

window.onload = renderRecruiterTable;