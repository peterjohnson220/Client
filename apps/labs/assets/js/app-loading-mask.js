// Observe the root Angular application for when its ready
// If the application is ready before the threshold, immediately hide the mask
// otherwise wait another threshold before hiding. This will prevent flickering of
// the loading mask.
var start = new Date();
var targetNode = document.querySelector('pf-root');
var loadingMask = document.querySelector('.loading-mask');
var config = { attributes: true };

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.attributeName === 'class' && targetNode.classList.contains('ready')) {
      setTimeout(function() {
        loadingMask.style.display = "none"
      }, (new Date() - start) > 1250 ? 1000 : 1);
    }
  });
});

observer.observe(targetNode, config);
