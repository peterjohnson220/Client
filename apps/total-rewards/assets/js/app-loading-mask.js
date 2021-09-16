(async () => {
  const payscaleLogo = document.querySelector('payscale-loading-logo');
  const payfactorsLogo = document.querySelector('.loading-logo');

  let isFeatureFlagReady = false, isRootReady = false;

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
        isRootReady = true;
      }
    });
  });

  observer.observe(targetNode, config);

  // get LaunchDarkly key and initialize
  const { protocol, host } = window.location;
  const launchDarklyKey = await fetch(protocol + '//' + host + '/odata/Account.GetLoginSettings')
    .then(response => response.json())
    .then(data => data.LaunchDarklyClientSdkKey);
  const ldClient = LDClient.initialize(launchDarklyKey, { key: 'anonymous' });

  // Payscale rebrand vars
  let payscaleBrandingFeatureFlag = false;
  ldClient.on('ready', async() => {
    payscaleBrandingFeatureFlag = ldClient.variation('payscale-branding', false);
    isFeatureFlagReady = true;
    await ldClient.close();
  });

  const intervalID = setInterval(() => {
    if (isFeatureFlagReady) {
      setBranding();
    }
    if (isFeatureFlagReady && isRootReady) {
      removeMask();
      clearInterval(intervalID);
    }
  }, 100);

  function setBranding() {
    if (payscaleBrandingFeatureFlag) {
      payfactorsLogo.style.display = "none";
      loadingMask.style.backgroundColor = '#fff';
      payscaleLogo.style.display = "block";
    } else {
      payscaleLogo.style.display = "none";
      payfactorsLogo.style.display = "block";
    }
  }

  function removeMask() {
    setTimeout(function() {
      loadingMask.style.display = "none";
    }, (new Date() - start) > 1250 ? 1000 : 1);
  }
})();