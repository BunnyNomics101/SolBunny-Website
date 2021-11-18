// Function for calculating window width.
window.width = function() {
    var widnowWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    return widnowWidth;
}