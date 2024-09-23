document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const arrow = document.getElementById('sidebar-toggle');
    arrow.addEventListener('click', function () {
        sidebar.classList.toggle('sidebar-expanded');
    });
});
