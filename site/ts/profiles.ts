document.addEventListener('DOMContentLoaded', function() {

    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.getElementById('search-icon');
    const modal = document.getElementById('profileModal');
    const closeBtn = document.getElementById('closeModal');
    const viewProfileButtons = document.querySelectorAll('button[id^="viewProfile"]');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }

    viewProfileButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    searchBar.addEventListener('focus', function() {
        searchIcon.classList.add('hidden');
    });

    searchBar.addEventListener('blur', function() {
        searchIcon.classList.remove('hidden');
    });

});