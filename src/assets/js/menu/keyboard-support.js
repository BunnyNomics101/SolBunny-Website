(function(){
    function getFirstSymbol(element) {
      var elementName = (element.textContent || element.innerText).toLowerCase().replace(/\s+/g, '');
      elementName = elementName.substr(0, 1)
      return elementName;
    }

    var mainMenuContainer = document.getElementById('main-menu-container');
    var mainMenuLinks = mainMenuContainer.getElementsByTagName('a');
    var mainMenuLinksSymbols = [];
    var burgerButton = document.getElementById('burger-button');
  
    function keyboardSupport(links, linksSymbols, i) {
      return function () {
        if (!event) { // If browser is IE8, or older the event object is a global property (window.event) and not an argument of the handler.
            event = window.event;
        } 
        var keyCode = event.keyCode || event.which; // Keycode (second condition for old browsers).
        var pressedKeySymbol = (event.key || String.fromCharCode(keyCode)).toLowerCase(); // The character of the pressed key (second condition for old browsers).
        var windowWidth = window.width();
        var shiftSymbolFlag; // User wants go to the link in the menu, and looks for it by the first letter in the name + shift, using keyboard (go backward).
        var symbolFlag; // User wants go to the link in the menu, and looks for it by the first letter in the name, using keyboard (go forward).
        var nextElement; // Menu link, that will be focused next.
          
        for(var j = 0; j < linksSymbols.length; j++) {
          if(linksSymbols[j] === pressedKeySymbol) { // If at least one link have the first letter, pressed by user - it means that user wanted go to this link. 
            if (event.shiftKey) {
              shiftSymbolFlag = true; // If the + shift key is pressed, the search will go backwards.
              break;
            } else {
              symbolFlag = true; // Otherwise, in the usual dirrection.
              break;
            }
          }
        }
  
        // There are two versions of keyboard support. The default is the desktop version: it will work when the browser does not support media queries, or when it support and screen larger than 839 px.
        // Otherwise the mobile version for menu will work.
        if(!window.isMediaQueriesSupported() || (windowWidth > 839 && window.isMediaQueriesSupported)) {
          if(keyCode === Keycode.ARROW_LEFT) {
            if(i === 0) {
              nextElement = links[links.length - 1];  // If user is at the first item, start at the last one.
            } else {
              nextElement = links[i - 1]; // Otherwise, from the current one.
            }
          }
          if(keyCode === Keycode.ARROW_RIGHT) {
            if(i === links.length - 1) {
              nextElement = links[0]; // If user is on the last item, start from the first.
            } else {
              nextElement = links[i + 1]; // Otherwise, from the current one.
            }
          }
        } else {
          if(keyCode === Keycode.ARROW_UP) {
            event.returnValue = false;  // Cancel the default action - scroll the page up.
            if(i === 0) {
                nextElement = links[links.length - 1];  // If user is at the first item, start at the last one.
            } else {
                nextElement = links[i - 1]; // Otherwise, from the current one.
            }
          }
  
          if(keyCode === Keycode.ARROW_DOWN) {
            event.returnValue = false;  // Cancel the default action - scroll the page down.
            if(i === links.length - 1) {
                nextElement = links[0]; // If user is on the last item, start from the first.
            } else {
                nextElement = links[i + 1]; // Otherwise, from the current one.
            }
          }
  
          if(keyCode === Keycode.ESC) {
            window.closeDropdownMainMenu();
            nextElement = burgerButton;
          }

          if(keyCode === Keycode.SPACE || keyCode === Keycode.ENTER) {
            window.closeDropdownMainMenu(); // For anchor links.
          }
        }

        if(keyCode === Keycode.SPACE || keyCode === Keycode.ENTER) {
          event.returnValue = false; // Space bar scrolls the page down - cancel the default behavior.
          document.location.href = links[i].href;
        }

        if(keyCode === Keycode.HOME) {
          event.returnValue = false;
          nextElement = links[0];
        }

        if(keyCode === Keycode.END) {
          event.returnValue = false;
          nextElement = links[links.length - 1];
        }
  
        if(symbolFlag) { // Go forward.
          var startLink;
          if(i === links.length - 1 ) { 
            startLink = 0; // If the current element is already the last one, start the search from the beginning.
          } else {
            startLink = i + 1;  // Otherwise, start the search from the next element.
          }
          while(startLink < links.length) {
            if(linksSymbols[startLink] === pressedKeySymbol) {
              nextElement = links[startLink]; // If the character of the pressed key is the first letter of the link, we have found the required link.
              break;
            }
            if(startLink === links.length - 1 ) {
              startLink = 0; // If we still have not found the desired link, it is in the previous ones. So let's start over again.
              continue; // Go to the next iteration without increasing the counter (so as not to miss startLink = 0).
            }
            if(startLink === links[i]) {
              break; // The cycle has come full circle and the link was never found. In order not to create an infinite cycle, we will interrupt it.
            }
            startLink++;
          }
        }
  
        if(shiftSymbolFlag) { // Go backward.
          var startLink;
          if(i === 0 ) {
            startLink = links.length - 1; // If the current element is already the first one, start the search from the end.
          } else {
            startLink = i - 1; // Otherwise, start the search from the previous element.
          }
          while(startLink >= 0) {
            if(linksSymbols[startLink] === pressedKeySymbol) { 
              nextElement = links[startLink]; // If the character of the pressed key is the first letter of the link, we have found the required link.
              break;
            }
            if(startLink === 0 ) {
              startLink = links.length - 1; // If we still have not found the desired link, it is somewhere forward. So let's start over again.
              continue;  // Go to the next iteration without decreasing the counter (so as not to miss startLink = links.length - 1).
            }
            if(startLink === links[i]) { // The cycle has come full circle and the link was never found. In order not to create an infinite cycle, we will interrupt it.
              break;
            }
            startLink--;
          }
        }
  
        if(nextElement) {
          nextElement.focus();
        }
      }
    }
  
    for (var i = 0; i < mainMenuLinks.length; i++) {
        mainMenuLinksSymbols.push(getFirstSymbol(mainMenuLinks[i]));
        if(i === 1) { // For all menu links, remove tabindex, except for the first one (I do my own way of navigating with the keyboard).
            mainMenuLinks[i].setAttribute('tabindex', 0);
          } else {
            mainMenuLinks[i].setAttribute('tabindex', -1);
          }
        mainMenuLinks[i].onkeydown = keyboardSupport(mainMenuLinks, mainMenuLinksSymbols, i);
    }
})();