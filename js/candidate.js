document.getElementById('applyForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const appData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        resumeName: document.getElementById('resume').files[0].name
    };

    DB.saveApp(appData);
    alert('Application submitted! Use your email to track status.');
    e.target.reset();
});

function handleTrack() {
    const email = document.getElementById('trackEmail').value;
    const resultDiv = document.getElementById('statusResult');
    const app = DB.findByEmail(email);

    if (app) {
        resultDiv.innerHTML = `
            <div style="border-left: 4px solid var(--primary); padding: 1rem; background: #f1f5f9;">
                <h4 style="margin:0">${app.role}</h4>
                <p style="margin: 0.5rem 0;">Current Status: <span class="badge status-${app.status.toLowerCase()}">${app.status}</span></p>
                <small>Applied on: ${app.appliedAt}</small>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color: var(--danger)">No application found for this email.</p>`;
    }
}