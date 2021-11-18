(function() {
  var submenusLinks = document.getElementsByClassName('main-menu__link--submenu');
  var submenus = document.getElementsByClassName('main-menu__submenu');
  var submenuItems = document.getElementsByClassName('main-menu__item--submenu');

  var addSubmenuClickHandler = function(link, submenu, item) {
    link.onclick = function() {
      if(window.classFunction.hasClass(link, 'main-menu__link--submenu-opened')) {
        TwoLevelMenu.closeSubmenu(link, submenu, item);
      } else {
        TwoLevelMenu.openSubmenu(link, submenu, item);
      }
    };
  };

  for(var i = 0; i < submenusLinks.length; i++) {
    // submenusLinks[i].setAttribute('tabIndex', 0);
    submenusLinks[i].setAttribute('aria-expanded','false');
    submenusLinks[i].setAttribute('aria-haspopup','true');
    addSubmenuClickHandler(submenusLinks[i], submenus[i], submenuItems[i]);
  }
})();