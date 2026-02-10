function renderRecruiterTable() {
    const tableBody = document.getElementById('recruiterTableBody');
    const filterValue = document.getElementById('roleFilter').value;
    const apps = DB.getApps();

    tableBody.innerHTML = '';

    const filteredApps = filterValue === 'All' 
        ? apps 
        : apps.filter(app => app.role === filterValue);

    filteredApps.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${app.name}</strong><br>
                <small style="color: var(--text-muted)">${app.email}</small>
            </td>
            <td>${app.role}</td>
            <td><span class="badge status-${app.status.toLowerCase()}">${app.status}</span></td>
            <td>
                <button onclick="updateAndRefresh(${app.id}, 'Interviewing')" class="btn-outline" style="padding: 0.4rem 0.7rem; font-size: 0.75rem;">Interview</button>
                <button onclick="updateAndRefresh(${app.id}, 'Hired')" class="btn-primary" style="padding: 0.4rem 0.7rem; font-size: 0.75rem; background: var(--success);">Hire</button>
                <button onclick="updateAndRefresh(${app.id}, 'Rejected')" class="btn-primary" style="padding: 0.4rem 0.7rem; font-size: 0.75rem; background: var(--danger);">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    if (filteredApps.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 3rem;">No candidates found.</td></tr>';
    }
}

function updateAndRefresh(id, status) {
    DB.updateStatus(id, status);
    renderRecruiterTable();
}

// Initial Load
window.onload = renderRecruiterTable;