function initializeRecaptcha(siteKey) {
  var script = document.createElement("script");

  script.type = "text/javascript";
  script.src = 'https://www.recaptcha.net/recaptcha/api.js?render=' + siteKey;

  document.getElementsByTagName("head")[0].appendChild(script);
}
