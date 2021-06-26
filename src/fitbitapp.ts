import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
//import { eventContext } from 'aws-serverless-express/middleware';
import axios from 'axios';
import * as querystring from 'querystring';
import { FitBitAccessTokenDao } from './dao/fitbitToken.dao';
import { FitbitDao } from './dao/persistFitbit.dao';

import { GetItemOutput } from 'aws-sdk/clients/dynamodb';

export function configureFitbitApp() {
  const app = express();
  app.set('view engine', 'pug');
  app.use(cors());
  app.use(json());
  app.use(
    urlencoded({
      extended: true,
    }),
  );

  //app.use(eventContext());

  app.get('/', (req, res) => {
    res.render('home');
  });

  app.get('/fitbit/oauth/redirect', fitbitRedirect);
  app.get('/fitbit/oauth/codeflow', fitbitFlow);
  return app;
}

async function fitbitFlow(
  req: express.Request,
  res: express.Response,
): Promise<any> {
  try {
    let fitbitAccessTokenDao: FitBitAccessTokenDao = new FitBitAccessTokenDao(
      'fitbitconfig',
    );
    console.log('User details being fetched : ', req.query.user);
    let result: GetItemOutput = await fitbitAccessTokenDao.get(req.query.user);
    console.log(
      'Result from config table from app.ts : ',
      JSON.stringify(result.Item),
    );

    if (result.Item !== null && result.Item !== undefined) {
      res.redirect(
        301,
        '/fitbit/oauth/redirect?state=user:' +
          req.query.user +
          ',isnew:false&code=none',
      );
      //res.send(fetchResponse);
    } else {
      let callback_url =
        'https://emzkzxxqb7.execute-api.eu-west-1.amazonaws.com/dev/fitbit/oauth/redirect';
      let scope =
        'activity heartrate location nutrition profile settings sleep social weight';
      let expires_in = '604800';
      let state = 'user:' + req.query.user + ',isNew:true';
      let client_id = '22DJDD';
      let response_type = 'code';
      let redirect_url = encodeURI(
        'https://www.fitbit.com/oauth2/authorize?' +
          'response_type=' +
          response_type +
          '&client_id=' +
          client_id +
          '&redirect_uri=' +
          callback_url +
          '&scope=' +
          scope +
          '&expires_in' +
          expires_in +
          '&state=' +
          state,
      );
      //let redirectUrl: string = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22DJDD&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ffitbit%2Foauth%2Fredirect&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800&state=userid:suhas';
      res.redirect(301, redirect_url);
    }
  } catch (e) {}
}

async function fitbitRedirect(
  req: express.Request,
  res: express.Response,
): Promise<any> {
  const authcode = req.query.code;
  console.log('The auth code is : ' + authcode);
  const state = req.query.state;
  let userId = state.split(',')[0].split(':')[1];
  let isNew = state.split(',')[1].split(':')[1];

  let fitbitAccessTokenDao: FitBitAccessTokenDao = new FitBitAccessTokenDao(
    'fitbitconfig',
  );

  console.log('User id : ', userId);
  console.log('isUserNew:', isNew);
  var d = new Date(),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  let dateStr = [year, month, day].join('-');
  //let activity_url = 'https://api.fitbit.com/1/user/-/activities/date/2019-04-03.json'
  let activity_steps_timeseries =
    'https://api.fitbit.com/1/user/-/activities/steps/date/' + dateStr +'/7d.json';
  let activity_calories_timeseries =
    'https://api.fitbit.com/1/user/-/activities/calories/date/' + dateStr + '/7d.json';

  let activity_lifetime = 'https://api.fitbit.com/1/user/-/activities.json';
  
  let authconfig = { headers: {} };
  let refreshToken = '';
  let userResult: any = await fitbitAccessTokenDao.get(userId);
  console.log('userTokenDetails', userResult.Item);

  if (isNew === 'true') {
    let reqBody = {
      clientId: '22DJDD',
      grant_type: 'authorization_code',
      redirect_uri:
        'https://emzkzxxqb7.execute-api.eu-west-1.amazonaws.com/dev/fitbit/oauth/redirect',
      code: authcode,
    };

    let config = {
      headers: {
        Authorization:
          'Basic MjJESkREOmQxYjllOWRmMDUwNGJhOTMxM2FkODg1M2MwYjA0NDRh',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const url = 'https://api.fitbit.com/oauth2/token';

    let tokenResp = await axios.post(url, querystring.stringify(reqBody), {
      headers: config.headers,
    });

    console.log("Response token : ")
    console.log(tokenResp)

    await fitbitAccessTokenDao.post(
      userId,
      tokenResp.data.access_token,
      tokenResp.data.token_type,
      tokenResp.data.refresh_token,
      tokenResp.data.expires_in,
    );
    refreshToken = tokenResp.data.refresh_token;
    let accessToken = tokenResp.data.access_token;

    authconfig.headers = {
      Authorization: 'Bearer ' + accessToken,
    };
  } else {
    console.log('Entered the existing user auth flow ');
    console.log('User Id : ' + userId);

    refreshToken = userResult.Item.refreshToken;

    authconfig.headers = {
      Authorization: 'Bearer ' + userResult.Item.accessToken,
    };

    console.log("Done the authorization check for the exiting user")

  }

  let activityStepsTimeSeriesResponse = null
  let activityCaloriesTimeSeriesResponse = null
  let activityLifetime = null


  try {
    activityStepsTimeSeriesResponse = await axios.get(
      activity_steps_timeseries,
      { headers: authconfig.headers },
    );
    activityCaloriesTimeSeriesResponse = await axios.get(
      activity_calories_timeseries,
      { headers: authconfig.headers },
    );
    activityLifetime = await axios.get(activity_lifetime, {
      headers: authconfig.headers,
    });
  }catch(error){

    console.log("Error in promise resolution : ")
    console.log(error.response.status)

    let refreshTokenConfig = {
      headers: {
        Authorization:
          'Basic MjJESkREOmQxYjllOWRmMDUwNGJhOTMxM2FkODg1M2MwYjA0NDRh',
      },
    };

    console.log("Refresh token val : ")
    console.log(refreshToken)

    let refreshReqBody = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    let refreshTokenResponse = await axios.post(
      'https://api.fitbit.com/oauth2/token',
      querystring.stringify(refreshReqBody),
      { headers: refreshTokenConfig.headers },
    );
    let accessToken = refreshTokenResponse.data.access_token;
    let refreshTokenNew = refreshTokenResponse.data.refresh_token;

    console.log('Access token : ' + accessToken);
    console.log('Refresh Token : ' + refreshTokenNew);

    await fitbitAccessTokenDao.post(
      userId,
      refreshTokenResponse.data.access_token,
      refreshTokenResponse.data.token_type,
      refreshTokenResponse.data.refresh_token,
      refreshTokenResponse.data.expiry_date,
    );

    authconfig.headers = {
      Authorization: 'Bearer ' + accessToken,
    };

    activityStepsTimeSeriesResponse = await axios.get(
      activity_steps_timeseries,
      { headers: authconfig.headers },
    );
    activityCaloriesTimeSeriesResponse = await axios.get(
      activity_calories_timeseries,
      { headers: authconfig.headers },
    );
    activityLifetime = await axios.get(activity_lifetime, {
      headers: authconfig.headers,
    });

    console.log("Moving out of the catch block : ")

  }

  if (
    activityStepsTimeSeriesResponse.status == 200 ||
    activityCaloriesTimeSeriesResponse.status == 200 ||
    activityLifetime.status == 200
  ) {
    let timeseriesData =
      activityStepsTimeSeriesResponse.data['activities-steps'];
    let fitbitStoreDao = new FitbitDao('fitbitsteps');

    let timeseriesCalData =
      activityCaloriesTimeSeriesResponse.data['activities-calories'];
    let fitbitCaloriesStoreDao = new FitbitDao('fitbitcalories');

    timeseriesData.forEach(async (data: any) => {
      console.log(data);
      await fitbitStoreDao.post(
        userId + data.dateTime,
        userId,
        data.dateTime,
        data.value,
      );
    });

    timeseriesCalData.forEach(async (data: any) => {
      await fitbitCaloriesStoreDao.post(
        userId + data.dateTime,
        userId,
        data.dateTime,
        data.value,
      );
    });

    res.send({
      // activity_steps_timeseries: activityStepsTimeSeriesResponse.data,
      // activity_calories_timeseries: activityCaloriesTimeSeriesResponse.data,
      // activity_lifetime: activityLifetime.data,
      message : "success",
      status: 200
    });
  }
}
