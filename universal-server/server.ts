import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import fetch from 'node-fetch';
import {join} from 'path';
import * as querystring from 'querystring';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(__dirname, '..', 'smallbiz');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('../smallbiz/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.use(cookieParser());

app.get('/app/login', (req, res) => {
  const authParams = {
    response_type: 'code',
    client_id: process.env.Auth0ClientId,
    redirect_uri: process.env.Auth0RedirectUri,
    audience: process.env.SmallbizApiAudience,
    scope: 'openid email',
    state: req.query.state
  };
  const authUrl = `${process.env.Auth0Domain}/authorize?${querystring.stringify(authParams)}`;
  res.redirect(authUrl);
});

app.get('/app/callback', (req, res) => {
  const tokenRequestBody = {
    grant_type: 'authorization_code',
    client_id: process.env.Auth0ClientId,
    client_secret: process.env.Auth0ClientSecret,
    code: req.query.code,
    redirect_uri: process.env.Auth0RedirectUri
  };
  fetch(`${process.env.Auth0Domain}/oauth/token`, {
    method: 'POST',
    body: JSON.stringify(tokenRequestBody),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(tokenRes => tokenRes.json())
    .then(tokenResJson => {
      res.cookie('tk', `${tokenResJson.access_token}||${tokenResJson.id_token}`,
        { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.redirect(`/app${req.query.state}`);
    });
});

// Server static files from /browser
app.get('/app/*.*', (req, res, next) => {
    req.url = req.url.replace('/app/', '');
    next();
  },
  express.static(join(DIST_FOLDER, 'browser')
));

// All regular routes use the Universal engine
const renderUniversal = (req, res) => {
  let userContext: any = null;
  if (!!req.cookies['tk']) {
    const tkParts = req.cookies['tk'].split('||');
    const [ accessToken, idToken ] = tkParts;
    const decoded = jwt.decode(idToken);
    const userMetaData = decoded[process.env.Auth0UserMetaDataClaim];
    userContext = {
      apiAccessToken: accessToken,
      emailAddress: decoded.email,
      firstName: userMetaData.firstName,
      lastName: userMetaData.lastName,
      companyName: userMetaData.companyName
    };
  }
  res.render('index', {
    req,
    providers: [
      { provide: APP_BASE_HREF, useValue: '/app/' },
      { provide: 'userContext', useValue: userContext }
    ]
  });
};
app.get('/app', renderUniversal);
app.get('/app/*', renderUniversal);

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
