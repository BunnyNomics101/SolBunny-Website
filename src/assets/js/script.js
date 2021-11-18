(function() {

var header = document.querySelector(".header");
if(document.addEventListener){
    window.addEventListener("scroll", function (e) {
        if (document.documentElement.scrollTop > 0) {
            window.classFunction.addClass(header, 'scrolled');
        } else {
            window.classFunction.removeClass(header, 'scrolled');
        }
    })
    
    if(document.dataset){
        var parralaxElems = document.querySelectorAll('.background');
    
    
        window.addEventListener("scroll", function (e) {
            for (var el = 0; el < parralaxElems.length; el++) { 
                
                if(this.window.innerWidth >840){
                    var speedEl = (parralaxElems[el].dataset.speed);
                    var yPos = -(window.pageYOffset / speedEl);
                    var coords = parralaxElems[el].dataset.orientation +" " + yPos + 'px' + ', center center';
                    parralaxElems[el].style.backgroundPosition = coords;
                }
                
            }
         
        });
        
        
        var enchancedParralaxElems = document.querySelectorAll('.backgroundEnchanced');
        
        window.addEventListener("scroll", function (e) {
            for (var el = 0; el < enchancedParralaxElems.length; el++) {
                
                var blockCenter;
        
                if(window.innerWidth > 660){
                    blockCenter =  window.getComputedStyle(enchancedParralaxElems[el]).height.slice(0, -2)/2;
                } else{
                    blockCenter =  window.innerHeight;
                }
                var speedEl = +(parralaxElems[el].dataset.speed);
                var yPos = (-(window.pageYOffset / speedEl)) + blockCenter;
                var coords = enchancedParralaxElems[el].dataset.orientation+" " + yPos + 'px';
                
                enchancedParralaxElems[el].style.backgroundPosition = coords;
            }
        });
        
        var transitionParallaxEls = document.querySelectorAll('.about__image_wrapper');
        
        
        function transitionParallaxElsCheck(parallaxEl){
            if(this.window.innerWidth <840){
                var speedEl = (parallaxEl.dataset.speed);
                var yPos = -(window.pageYOffset / speedEl/2);
                var coords = "translateY(" + Math.round(yPos) + 'px)';
                parallaxEl.style.transform = coords;
            } else{
                parallaxEl.style.transform = "translateY(0px)";
            }
        }
        
        
        window.addEventListener("scroll", function (e) {
            for (var el = 0; el < transitionParallaxEls.length; el++) {
                transitionParallaxElsCheck(transitionParallaxEls[el])
            }
        });
        
        window.addEventListener("resize", function (e) {
            for (var el = 0; el < transitionParallaxEls.length; el++) {
                transitionParallaxElsCheck(transitionParallaxEls[el])
            }
        });
    }
   
}
})();
