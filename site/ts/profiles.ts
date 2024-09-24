document.addEventListener('DOMContentLoaded', function() {

    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.getElementById('search-icon');

    searchBar.addEventListener('focus', function() {
        searchIcon.classList.add('hidden');
    });

    searchBar.addEventListener('blur', function() {
        searchIcon.classList.remove('hidden');
    });

});