(function(apiKey){
  (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
    v=['initialize','identify','updateOptions','pageLoad'];for(w=0,x=v.length;w<x;++w)(function(m){
      o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('1f300a54-394e-4bf7-6461-c96bdc4e2c55');

function initializePendo(userContext)
{
  if (typeof pendo == 'object') {

    var visitor = {};
    var account = {};

    if (userContext){
      var visitor = {
        id: userContext.UserId,             // Required if user is logged in
        email: userContext.Email        // Optional
        // role:         // Optional

        // You can add any additional visitor level key-values here,
        // as long as it's not one of the above reserved names.
      };
      var account = {
        id: userContext.CompanyId,            // Highly recommended
        name: userContext.CompanyName         // Optional
        // planLevel:    // Optional
        // planPrice:    // Optional
        // creationDate: // Optional

        // You can add any additional account level key-values here,
        // as long as it's not one of the above reserved names.
      };

    }

    pendo.initialize({
      visitor: visitor,
      account: account
    })

  }
}
