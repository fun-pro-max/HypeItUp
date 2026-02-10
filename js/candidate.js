document.getElementById('applyForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('resume');
    
    const appData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        resumeFileName: fileInput.files[0] ? fileInput.files[0].name : "resume.pdf"
    };

    DB.saveApp(appData);
    alert('Application submitted! Your resume is ready for review.');
    e.target.reset();
});

// Update the checkStatus display logic inside handleTrack()
// Add this line to statusResult.innerHTML inside handleTrack():
// <span>${app.status === 'ANALYSING' ? '🔍 Your resume is being reviewed' : app.status}</span>
function handleTrack() {
    const email = document.getElementById('trackEmail').value;
    const resultDiv = document.getElementById('statusResult');
    const app = DB.findByEmail(email);

    if (app) {
        resultDiv.innerHTML = `
            <div style="border-left: 4px solid var(--primary); padding: 1rem; background: #f1f5f9;">
                <h4 style="margin:0">${app.role}</h4>
                <p style="margin: 0.5rem 0;">Current Status: <span>${app.status === 'ANALYSING' ? '🔍 Your resume is being reviewed' : app.status}</span>
                <small>Applied on: ${app.appliedAt}</small>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color: var(--danger)">No application found for this email.</p>`;
    }
}