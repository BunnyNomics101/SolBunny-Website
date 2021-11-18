// https://habr.com/ru/post/336466/
window.supportsCSS = function (property, value) {
    var element = document.createElement('span');
    if (element.style[property] !== undefined) {
        element.style.cssText = property + ':' + value;
    } else {
        return false;
    }
    return element.style[property] === value;
};