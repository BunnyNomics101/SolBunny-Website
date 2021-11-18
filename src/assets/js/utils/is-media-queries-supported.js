// Checking if the browser supports media queries.
window.isMediaQueriesSupported = function() {
  return (typeof window.matchMedia != 'undefined' || typeof window.msMatchMedia != 'undefined' ||  typeof window.MediaError != 'undefined');
};