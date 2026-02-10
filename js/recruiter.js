const select = document.getElementById('activeRecruiter');
RECRUITERS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = r;
    select.appendChild(opt);
});

function calculateHours(iso) {
    if (!iso) return 0;
    return Math.floor((new Date() - new Date(iso)) / (1000 * 60 * 60));
}

function render() {
    const tbody = document.getElementById('tableBody');
    const apps = DB.getApps();
    const actor = select.value;

    // Load Stats
    const stats = document.getElementById('loadStats');
    stats.innerHTML = RECRUITERS.map(r => {
        const count = apps.filter(a => a.owner === r && a.status === 'ANALYSING').length;
        return `<div class="stat-item"><span class="stat-value">${count}</span><span class="time-meta">${r.split(' ')[0]}</span></div>`;
    }).join('');

    tbody.innerHTML = '';
    apps.forEach(app => {
        const hrsApplied = calculateHours(app.timestamps.applied);
        const hrsAnalysed = calculateHours(app.timestamps.analysed);
        
        let stale = "";
        if(app.status === 'APPLIED' && hrsApplied > 24) stale = '<span class="stale-tag">⚠️ UNCLAIMED > 24H</span>';
        if(app.status === 'ANALYSING' && hrsAnalysed > 48) stale = '<span class="stale-tag">⚠️ STUCK > 48H</span>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${app.name}</strong> ${stale}
                <span class="time-meta">${app.role} | Applied ${hrsApplied}h ago</span>
            </td>
            <td><span class="badge status-${app.status.toLowerCase()}">${app.status}</span></td>
            <td>${app.owner || '--'}</td>
            <td>${getActions(app, actor)}</td>
        `;
        tbody.appendChild(row);
    });
}

function getActions(app, actor) {
    if (app.status === 'APPLIED') {
        return `<button class="btn-primary" onclick="viewResume(${app.id}, '${app.resumeName}')">View Resume</button>`;
    }
    if (app.status === 'ANALYSING') {
        if (app.owner !== actor) return `<small>Owned by ${app.owner}</small>`;
        return `
            <button class="btn-success" onclick="DB.decideApp(${app.id}, 'HIRED', '${actor}'); render();">Hire</button>
            <button class="btn-danger" onclick="DB.decideApp(${app.id}, 'REJECTED', '${actor}'); render();">Reject</button>
            <br><small style="cursor:pointer;color:blue" onclick="viewResume(${app.id}, '${app.resumeName}')">Re-view</small>
        `;
    }
    return `<span class="time-meta">Closed by ${app.owner}</span>`;
}

function viewResume(id, fileName) {
    const actor = select.value;
    const apps = DB.getApps();
    const app = apps.find(a => a.id === id);

    if (app.status === 'APPLIED') {
        DB.startAnalysis(id, actor);
    }

    const win = window.open('', '_blank');
    win.document.write(`<html><body style="font-family:sans-serif;text-align:center;padding:50px;">
        <h1>📄 Resume: ${fileName}</h1>
        <p>Candidate: ${app.name}</p>
        <div style="border:2px dashed #ccc; height:300px; display:flex; align-items:center; justify-content:center;">[ Resume Content ]</div>
        <button onclick="window.close()">Back to Dashboard</button>
    </body></html>`);
    
    render();
}

window.onload = render;