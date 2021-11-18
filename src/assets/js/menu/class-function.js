// In this code, I use my functions instead of the default ones ("hasClass", "addClass", "removeClass"), because older versions of browsers do not support them.
// TODO: Approve this functions.
(function(){
    window.classFunction = {};

    window.classFunction.hasClass = function(elem, elemClass) {
        return !!elem.className.match(new RegExp('(\\s|^)'+ elemClass +'(\\s|$)'));
    };
    
    window.classFunction.addClass = function(elem, elemClass) {
        if (!window.classFunction.hasClass(elem,elemClass)) elem.className += " " + elemClass;
    };
    
    window.classFunction.removeClass = function(elem, elemClass) {
        if (window.classFunction.hasClass(elem, elemClass)) {
            var reg = new RegExp('(\\s|^)' + elemClass + '(\\s|$)');
            elem.className = elem.className.replace(reg,' ');
        }
    };
})();