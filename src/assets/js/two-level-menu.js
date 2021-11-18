var TwoLevelMenu = {};

TwoLevelMenu.closeMenu = function() {
  var mainMenuContainer = document.getElementsByClassName('header__main-menu-container')[0];
  var burgerButton = document.getElementsByClassName('burger__button')[0];

  var openedLink = document.getElementsByClassName('main-menu__link--submenu-opened')[0];
  var openedSubmenu = document.getElementsByClassName('main-menu__submenu--opened')[0];
  var openedItem = document.getElementsByClassName('main-menu__item--submenu-opened')[0];

  if(burgerButton) {
    burgerButton.setAttribute('aria-expanded', 'false');
    burgerButton.setAttribute('aria-label', 'Open menu');
    if(window.svg) {
      burgerButton.setAttribute('style', 'background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxOCAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNMCAxMkgxOFYxMEgwVjEyWk0wIDdIMThWNUgwVjdaTTAgMFYySDE4VjBIMFoiIGZpbGw9IiMyRDJEMkQiLz4NCjwvc3ZnPg0K");');
    } else {
      burgerButton.setAttribute('style', 'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMCAYAAABvEu28AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAmSURBVHgB7dAxEQAACAJAsA/942kEF89j4CM8JTUOFGLDZP/xyx4khASc012b1gAAAABJRU5ErkJggg==");');
    }
    window.classFunction.removeClass(mainMenuContainer, 'header__main-menu-container--opened');
  }

  if(openedLink && openedSubmenu && openedItem) {
    TwoLevelMenu.closeSubmenu(openedLink, openedSubmenu, openedItem);
  }
};

TwoLevelMenu.closeSubmenu = function(link, submenu, item) {
  window.classFunction.removeClass(link, 'main-menu__link--submenu-opened');
  window.classFunction.removeClass(submenu, 'main-menu__submenu--opened');
  window.classFunction.removeClass(item, 'main-menu__item--submenu-opened');
  link.setAttribute('aria-expanded', 'false');
};


TwoLevelMenu.openSubmenu = function(link, submenu, item) {
  var previousLink = document.getElementsByClassName('main-menu__link--submenu-opened')[0];
  var previousSubmenu = document.getElementsByClassName('main-menu__submenu--opened')[0];
  var previousItem = document.getElementsByClassName('main-menu__item--submenu-opened')[0];

  window.classFunction.addClass(link, 'main-menu__link--submenu-opened');
  window.classFunction.addClass(submenu, 'main-menu__submenu--opened');
  window.classFunction.addClass(item, 'main-menu__item--submenu-opened');
  link.setAttribute('aria-expanded', 'true');
  if(previousLink && previousSubmenu && previousItem) {
    TwoLevelMenu.closeSubmenu(previousLink, previousSubmenu, previousItem);
  }
};
