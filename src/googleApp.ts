import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import { GoogleAdapter } from './jamAdapter';
import { OauthClient } from './oauthClient';
import { google } from 'googleapis';
import * as cors from 'cors';
import * as bodyParser from 'body-parser'
//import { eventContext } from 'aws-serverless-express/middleware';
import { join } from 'path';
import { AccessTokenDao } from './dao/accessToken.dao';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';

export function configureGoogleApp() {
  const app = express();
  app.set('view engine', 'pug');
  app.set('views', join(__dirname, '/views'));
  app.use(cors());
  app.use(json());
  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json({ strict: false }));
  
  app.get('/', (req, res) => {
    res.render('home');
  });

  app.get('/googlefit/api/callback', fetchFitnessData);

  app.get('/googlefit/fetch/userdetails', fetchUserAuthCode);

  return app;
}

async function fetchUserAuthCode(
  req: express.Request,
  res: express.Response,
): Promise<any> {
  let oauthClient = OauthClient.getInstance().oauthClient;

  let scopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.activity.write',
    'https://www.googleapis.com/auth/fitness.blood_glucose.read',
    'https://www.googleapis.com/auth/fitness.blood_glucose.write',
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.blood_pressure.write',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.body.write',
    'https://www.googleapis.com/auth/fitness.body_temperature.read',
    'https://www.googleapis.com/auth/fitness.body_temperature.write',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.location.write',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/fitness.nutrition.write',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.write',
    'https://www.googleapis.com/auth/fitness.reproductive_health.read',
    'https://www.googleapis.com/auth/fitness.reproductive_health.write',
  ];

  google.options({
    auth: oauthClient,
  });

  try {
    let accessTokenDao: AccessTokenDao = new AccessTokenDao('config');
    console.log('User details being fetched : ', req.query.user);
    let result: GetItemOutput = await accessTokenDao.get(req.query.user);
    console.log(
      'Result from config table from app.ts : ',
      JSON.stringify(result.Item),
    );

    if (result.Item !== null && result.Item !== undefined) {
      res.redirect(
        301,
        '/dev/googlefit/api/callback?state=user:' +
          req.query.user +
          ',isnew:false&code=none',
      );
      //res.send(fetchResponse);
    } else {
      const url = await oauthClient.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        prompt: 'consent',
        state: 'user:' + req.query.user + ',isnew:true',
        // If you only need one scope you can pass it as a string
        scope: scopes,
      });
      console.log(url);
      res.redirect(301, url);
    }
  } catch (e) {
    console.log('Exception is....', e);
  }
}

async function fetchFitnessData(
  req: express.Request,
  res: express.Response,
): Promise<any> {
  let response;
  let oauthClient = OauthClient.getInstance().oauthClient;
  if (oauthClient != null) {
    console.log('Auth client initialized');
  }

  google.options({
    auth: oauthClient,
  });

  try {
    console.log('Get request query call : ' + req.query.code);
    console.log('User id is:', req.query.state);
    let adapater = new GoogleAdapter(oauthClient, req.query.code);
    if (adapater != null) {
      response = await adapater.getFitnessData(
        oauthClient,
        req.query.code,
        req.query.state,
      );
    } else {
      console.log('Adapter is destroyed');
    }
    //res.redirect(301,url);
    console.log('The response is : ');
    console.log(response);
    res.send({
      data: response,
    });
  } catch (e) {
    console.log('Exception is....', e);
  }
}
