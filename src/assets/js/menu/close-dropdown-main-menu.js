(function() {
  if(document.querySelector && window.isMediaQueriesSupported) { // This function is only need if there is support for media queries.
    var burgerButton = document.querySelector('.burger__button');
    var header = document.querySelector('.header');
    var mainMenuContainer = document.querySelector('.header__main-menu-container');
    
    window.closeDropdownMainMenu = function() {
      burgerButton.setAttribute('aria-expanded', 'false');
      burgerButton.setAttribute('aria-label', 'Open menu');
      window.classFunction.removeClass(burgerButton, 'burger__button--opened');
      window.classFunction.removeClass(header, 'opened');

      // if(window.svg) {
      //   burgerButton.setAttribute('style', 'background-image: url("{% include '../../img/buttons/burger-svg.njk' %}");');
      // } else {
      //   burgerButton.setAttribute('style', 'background-image: url("{% include '../../img/buttons/burger-png.njk' %}"); background-size: 14px 14px; background-position: center; background-repeat: no-repeat;');
      // }         
      window.classFunction.removeClass(mainMenuContainer, 'header__main-menu-container--opened');
      document.removeEventListener('click', window.emptySpaceClick);
    }
  }
})();


