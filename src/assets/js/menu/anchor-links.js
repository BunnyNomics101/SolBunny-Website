(function() {
    // If there is an anchor link in the menu, clicking on it should close the menu.
    var mainMenuContainer = document.getElementById('main-menu-container');
    var mainMenuLinks = mainMenuContainer.getElementsByTagName('a');
    var windowWidth = window.width();

    for (var i = 0; i < mainMenuLinks.length; i++) {
        mainMenuLinks[i].onclick = function() {
            if(window.isMediaQueriesSupported && windowWidth < 839) {
                window.closeDropdownMainMenu();
            }
        }
    }
})();