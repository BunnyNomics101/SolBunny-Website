(function(){
  if(window.supportsCSS('position', 'sticky') || window.supportsCSS('position', '-webkit-sticky')) {
    var stickyHeader = document.querySelector('.header');
    stickyHeader.classList.add('header--sticky');
    var mainMenuContainer = stickyHeader.querySelector('.header__main-menu-container');
    var burgerButton = stickyHeader.querySelector('.burger');
    function calcMenuHeight() {
      // If the device/browser has a small screen height, then the sticky header will cover the entire screen and some of the bottom links will not fit on the screen.
      // To see the bottom menu link, user will first have to scroll through the entire page. So, you need to add a scroll to the menu itself.
      // mainMenuContainer.style.maxHeight = window.height() - stickyHeader.offsetHeight + 'px';
    }

    calcMenuHeight();
    window.addEventListener('resize', calcMenuHeight);
    burgerButton.addEventListener('click', calcMenuHeight);
  }
})();