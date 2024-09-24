document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const arrow = document.getElementById('sidebar-toggle');
    const profilesBtn = document.getElementById('profiles-btn');
    const scrumBtn = document.getElementById('scrum-btn');
    const hboIBtn = document.getElementById('hbo-i-btn');
    const homeBtn = document.getElementById('home-btn');
    arrow.addEventListener('click', function () {
        sidebar.classList.toggle('sidebar-expanded');
    });
    if (profilesBtn) {
        profilesBtn.addEventListener('click', function () {
            window.location.href = 'profiles.html';
        });
    }
    else if (scrumBtn) {
        scrumBtn.addEventListener('click', function () {
            window.location.href = 'scrum.html';
        });
    }
    else if (hboIBtn) {
        hboIBtn.addEventListener('click', function () {
            window.location.href = 'hboI.html';
        });
    }
    else if (homeBtn) {
        homeBtn.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }
});
