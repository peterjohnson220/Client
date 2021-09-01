const payscaleLogo = document.querySelector('payscale-loading-logo');
const payfactorsLogo = document.querySelector('.loading-logo');

// get LaunchDarkly key and initialize
const { protocol, host } = window.location;
const launchDarklyKey = await fetch(protocol + '//' + host + '/odata/Account.GetLoginSettings')
  .then(response => response.json())
  .then(data => data.LaunchDarklyClientSdkKey);
const ldClient = LDClient.initialize(launchDarklyKey, { key: 'anonymous' });

var start = new Date();
var targetNode = document.querySelector('pf-root');
var loadingMask = document.querySelector('.loading-mask');
var config = { attributes: true };

// Payscale rebrand vars
let payscaleBrandingFeatureFlag = false;
ldClient.on('ready', () => {
  payscaleBrandingFeatureFlag = ldClient.variation('payscale-branding', false);
})

// Observe the root Angular application for when its ready
// If the application is ready before the threshold, immediately hide the mask
// otherwise wait another threshold before hiding. This will prevent flickering of
// the loading mask.
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.attributeName === 'class' && targetNode.classList.contains('ready')) {
      setTimeout(function() {
        loadingMask.style.display = "none";
      }, (new Date() - start) > 1250 ? 1000 : 1);
    } else {
      if (payscaleBrandingFeatureFlag) {
        payfactorsLogo.style.display = "none";
        document.querySelector('.loading-mask').style.backgroundColor = '#fff';
        payscaleLogo.style.display = "block";
      } else {
        payscaleLogo.style.display = "none";
        payfactorsLogo.style.display = "block";
      }
    }
  });
});

observer.observe(targetNode, config);
