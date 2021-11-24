(function(){
  if(document.addEventListener){
    var targets = document.querySelectorAll('.anchor-target');
    var links = document.querySelectorAll('.main-menu__link');
    var sideLinks = document.querySelectorAll(".section-navigation__link");

    var visible = function (target, link) {
      var targetPosition = {
        top: window.pageYOffset + target.getBoundingClientRect().top,
        bottom: window.pageYOffset + target.getBoundingClientRect().bottom
      };

      windowPosition = {
        top: window.pageYOffset,
        bottom: window.pageYOffset + document.documentElement.clientHeight
      };

    
      if(Math.round(windowPosition.bottom) == Math.round(window.getComputedStyle(document.documentElement).height.slice(0,-2))){
        var previousLink = document.querySelector('.main-menu__link--current');
        var previousSideLink = document.querySelector('.section-navigation__link--current');
        
        window.classFunction.removeClass(previousLink, 'main-menu__link--current');
        window.classFunction.removeClass(previousSideLink, 'section-navigation__link--current');

        window.classFunction.addClass(links[links.length-1], 'main-menu__link--current');
        window.classFunction.addClass(sideLinks[sideLinks.length-1], 'section-navigation__link--current');    
        return link;
      } else if (targetPosition.bottom > windowPosition.top &&
        targetPosition.top < windowPosition.bottom) {
        var previousLink = document.querySelector('.main-menu__link--current');
        var previousSideLink = document.querySelector('.section-navigation__link--current');

        if(link != undefined){
          if(previousLink && !link.isEqualNode(previousLink)) {
            window.classFunction.removeClass(previousLink, 'main-menu__link--current');
            window.classFunction.removeClass(previousSideLink, 'section-navigation__link--current');
            
            window.classFunction.addClass(link, 'main-menu__link--current');
            if(window.history.pushState){
              window.history.pushState('', '', link.getAttribute('href'));
            }
          } else if(!previousLink) {
            window.classFunction.addClass(link, 'main-menu__link--current');
            if(window.history.pushState){
              window.history.pushState('', '', link.getAttribute('href'));
            }
          }

          for (var i = 0; i < sideLinks.length; i++) {
            if(sideLinks[i].getAttribute("href") == link.getAttribute('href')){
              window.classFunction.addClass(sideLinks[i], 'section-navigation__link--current');
            }
          };
        }
        
        return link;
      }

      
    };
    
    var currentLink;
    function setCurrentLink() {
      currentLink = null;
      for (var i = 0; i < targets.length; i++) {
        currentLink = visible(targets[i], links[i]);
        if(currentLink) {
          return;
        }
      }

      if(!currentLink) {
        var previousLink = document.querySelector('.main-menu__link--current');
        var previousSideLink = document.querySelector('.section-navigation__link--current');
        if(previousLink) {
          window.classFunction.removeClass(previousLink, 'main-menu__link--current');
         
        }

        if(previousSideLink) {
          window.classFunction.removeClass(previousSideLink, 'section-navigation__link--current');
          
        }

        if(document.location.href !== document.location.protocol + '//' + document.location.host + document.location.pathname) {
          if(window.history.pushState){
            window.history.pushState('', '', link.getAttribute('href'));
          }  
      
        }

      }
    }
    
    setCurrentLink();
    window.addEventListener('scroll', setCurrentLink);
    window.addEventListener('resize', setCurrentLink);
  }
})();