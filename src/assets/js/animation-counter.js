(function() {
  if(window.animation === true) { // Проверяю, работает ли в браузере анимация.э
    var animationTargets = [];
    // Нахожу все элементы, которые должны быть анимированы.
    var elements = document.querySelectorAll('.animation-target');
    for (var i = 0; i < elements.length; i++) {
      var animationTarget = {};

      animationTarget.element = elements[i];
      var animationChild = elements[i].querySelectorAll('.animating-counter');
      if(animationChild.length > 0) { // И их дочерние анимации, которые зависят от родителя.
        animationTarget.child = animationChild;
        for (var ii = 0; ii < animationTarget.child.length; ii++) {
          var start = +(animationTarget.child[ii].getAttribute('data-start'));
          animationTarget.child[ii].textContent = start;
        }
      }

      animationTargets.push(animationTarget);
    }
    
    var visibleAnimated = function(target) { // Проверка, попал ли элемент в экран.
      var targetPosition = { // Позиция элемента.
        top: window.pageYOffset + target.getBoundingClientRect().top,
        bottom: window.pageYOffset + target.getBoundingClientRect().bottom
      }

      var windowPosition = { // Позиция окна.
        top: window.pageYOffset,
        bottom: window.pageYOffset + document.documentElement.clientHeight
      };

      if(targetPosition.top < windowPosition.top && targetPosition.bottom <= windowPosition.top &&
        !target.classList.contains('scrolled') && !target.classList.contains('animated')) { // Если проскроллен - задать сразу финальное значение.
        target.classList.add('scrolled');
        return 'scrolled';
      } else if (
        (targetPosition.top < windowPosition.bottom && targetPosition.bottom > windowPosition.bottom ||
        targetPosition.bottom > windowPosition.top && targetPosition.top < windowPosition.top ||
        targetPosition.top > windowPosition.top && targetPosition.bottom < windowPosition.bottom ) &&
        !target.classList.contains('scrolled') && !target.classList.contains('animated')
        ) { // Если попал - запустить анимацию.
        target.classList.add('animated');
        return 'animated';
      }
    };

    // https://css-tricks.com/animating-number-counters/#the-new-school-css-solution - Анимация счетчика.

    var animateValue = function (obj, start, end, duration, delay, rounding) {
      setTimeout(function() {
      var startTimestamp = null;
      var step = function(timestamp) {
        if (!startTimestamp) {
          startTimestamp = timestamp;
        }
        var progress = Math.min((timestamp - startTimestamp) / duration, 1);

        if(rounding === 0) {
          obj.innerHTML = Math.floor(progress * (end - start) + start);
        } else {
          obj.innerHTML = (progress * (end - start) + start).toFixed(rounding);
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
     window.requestAnimationFrame(step)}, delay);
    };

    var runAnimation = function() {
      var isAllElementsAnimated = true;

      for(var i = 0; i < animationTargets.length; i++) {

        var state = visibleAnimated(animationTargets[i].element);
        if(!(state)) {
          isAllElementsAnimated = false;
        }

        if(animationTargets[i].hasOwnProperty('child')) {
          for (var ii = 0; ii < animationTargets[i].child.length; ii++) {

            var end = +(animationTargets[i].child[ii].getAttribute('data-end'));

            if(state === 'animated') {
              var start = +(animationTargets[i].child[ii].getAttribute('data-start'));
              var duration = +(animationTargets[i].child[ii].getAttribute('data-duration'));
              var delay = 0;
              if(animationTargets[i].child[ii].getAttribute('data-delay')) {
                delay = +(animationTargets[i].child[ii].getAttribute('data-delay'));
              }
              var rounding = 0;
              if(animationTargets[i].child[ii].getAttribute('data-rounding')) {
                rounding = +(animationTargets[i].child[ii].getAttribute('data-rounding'));
              }
              animateValue(animationTargets[i].child[ii], start, end, duration, delay, rounding);
            }

            if(state === 'scrolled') {
              animationTargets[i].child[ii].textContent = end;
            } 
          }
          
        }
      }

      if(isAllElementsAnimated) {
        window.removeEventListener('scroll', runAnimation);
        window.removeEventListener('resize', runAnimation);
        document.removeEventListener("DOMContentLoaded", runAnimation);
      }
    };

    window.addEventListener('scroll', runAnimation);
    window.addEventListener('resize', runAnimation);
    document.addEventListener("DOMContentLoaded", runAnimation);
  }
})();