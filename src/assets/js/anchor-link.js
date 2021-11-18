(function() {
  var allLinks = document.getElementsByClassName('main-menu__link');

  var addSubmenuClickHandler = function(link) {
    link.onclick = TwoLevelMenu.closeMenu;
  }

  for(var i = 0; i < allLinks.length; i++) {
    if(!window.classFunction.hasClass(allLinks[i], 'main-menu__link--submenu')) {
      addSubmenuClickHandler(allLinks[i]);
    }
  }
})();