(function() {
  if(document.addEventListener && window.isMediaQueriesSupported) {
    var header = document.querySelector('.header');
    var mainMenuContainer = document.querySelector('.header__main-menu-container');
    var burgerButtonContainer = document.querySelector('.header__main-menu-burger');
    var burgerButton = document.createElement('button');
    window.classFunction.addClass(burgerButton, 'burger__button');
    burgerButton.setAttribute('id', 'burger-button');
    burgerButton.setAttribute('aria-haspopup', 'true');
    burgerButton.setAttribute('aria-expanded', 'false');
    burgerButton.setAttribute('aria-label', 'Open menu');

    if(window.classFunction.hasClass(header, 'header--dark')) {
      window.classFunction.addClass(burgerButton, 'burger__button--dark');
    }

    // if(window.svg) {
    //   burgerButton.setAttribute('style', 'background-image: url("");');
    // } else {
    //   burgerButton.setAttribute('style', 'background-image: url("");');
    // }

    burgerButtonContainer.appendChild(burgerButton);

    var firstLink = mainMenuContainer.querySelector('.main-menu__link');

    // TODO: chacge comment for aria atributes.
    function toggleDropdownMenu() {
      if(burgerButton.getAttribute('aria-expanded') === 'true') { // If menu is already opened (check 'aria-expanded' attribute).
        burgerButton.setAttribute('aria-expanded', 'false');
        burgerButton.setAttribute('aria-label', 'Open menu');
        // if(window.svg) {
        //   burgerButton.setAttribute('style', 'background-image: url("{% include '../../img/buttons/burger-svg.njk' %}");');
        // } else {
        //   burgerButton.setAttribute('style', 'background-image: url("{% include '../../img/buttons/burger-png.njk' %}"); background-size: 14px 14px; background-position: center; background-repeat: no-repeat;');
        // }
        window.classFunction.removeClass(burgerButton, 'burger__button--opened');
        window.classFunction.removeClass(header, 'opened');
        window.classFunction.removeClass(mainMenuContainer, 'header__main-menu-container--opened');
        document.removeEventListener('click', window.emptySpaceClick);
      } else {
        burgerButton.setAttribute('aria-expanded', 'true');
        burgerButton.setAttribute('aria-label', 'Close menu');
        // if(window.svg) {
        //   burgerButton.setAttribute('style', 'background-image: url("{% include '../../img/buttons/cross-svg.njk' %}");');
        // } else {
        //   burgerButton.setAttribute('style', 'background-image: url("{% include '../../img/buttons/cross-png.njk' %}");');
        // }
        window.classFunction.addClass(header, 'opened');
        window.classFunction.addClass(burgerButton, 'burger__button--opened');
        window.classFunction.addClass(mainMenuContainer, 'header__main-menu-container--opened');
        document.addEventListener('click', window.emptySpaceClick);
      }
    };

    burgerButton.addEventListener('click', toggleDropdownMenu);

    // We handle not only a click, but also pressing Enter/Space.
    burgerButton.addEventListener('keydown', function(event) {
      if(event.keyCode === Keycode.SPACE || event.keyCode === Keycode.ENTER) {
        event.preventDefault();
        toggleDropdownMenu();

        if(burgerButton.getAttribute('aria-expanded') === 'true') {
          firstLink.focus();
        } else {
          burgerButton.focus();
        }
      }

      if(event.keyCode === Keycode.ESC) {
        window.closeDropdownMainMenu();
      }
    });
  }
})();