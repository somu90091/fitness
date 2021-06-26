// import { Configuration, IConfig } from "../config";
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import {
  GetTokenResponse,
  RefreshAccessTokenResponse,
} from 'google-auth-library/build/src/auth/oauth2client';
import { GaxiosResponse } from 'gaxios';
import { dataSources } from '../src/dictionaries';
import { AccessTokenDao } from '../src/dao/accessToken.dao';
import { calculate } from '../src/calcuateGSteps';

export class GoogleAdapter {
  // private config: IConfig = Configuration();
  oauthclient: any;
  authcode: string;

  constructor(oauthClient: OAuth2Client, authcode: string) {
    this.oauthclient = oauthClient;
    this.authcode = authcode;
  }

  public async getGoogleToken(
    oauthClient: any,
    authcode: string,
  ): Promise<string> {
    let token;
    try {
      token = await oauthClient.getToken(authcode);
      oauthClient.setCredentials(token);
    } catch (e) {
      console.log('Error');
    }
    return token;
  }

  public async getFitnessData(
    oauthClient: OAuth2Client,
    authcode: string,
    state: string,
  ): Promise<any> {
    let accessTokenDao: AccessTokenDao = new AccessTokenDao('config');
    console.log('Token for fitness : ');
    let stateArr: any = state.split(',');
    let userId = stateArr[0].split(':')[1];
    let isNew = stateArr[1].split(':')[1];

    console.log('User id : ', userId);
    console.log('isUserNew:', isNew);

    if (isNew === 'true') {
      console.log('Entered the new auth flow ');

      let token: GetTokenResponse = await oauthClient.getToken(authcode);
      await accessTokenDao.post(
        userId,
        token.tokens.access_token,
        token.tokens.token_type,
        token.tokens.refresh_token,
        token.tokens.expiry_date,
        token.tokens.id_token,
      );
      oauthClient.setCredentials({
        access_token: token.tokens.access_token,
        token_type: token.tokens.token_type,
        expiry_date: token.tokens.expiry_date,
        id_token: token.tokens.id_token,
        refresh_token: token.tokens.refresh_token,
      });
    } else {
      console.log('Entered the existing user auth flow ');
      console.log('User Id : ' + userId);

      let userResult: any = await accessTokenDao.get(userId);
      console.log('userTokenDetails', userResult.Item);

      oauthClient.setCredentials({
        access_token: userResult.Item.accessToken,
        token_type: userResult.Item.tokenType,
        expiry_date: userResult.Item.expirationDate,
        id_token: userResult.Item.idToken,
        refresh_token: userResult.Item.refreshToken,
      });
    }

    let fitness = google.fitness({
      version: 'v1',
      auth: oauthClient,
    });
    if (fitness == null) {
      console.log('fitness is null');
    }
    let startTimeMillis = new Date().setHours(0, 0, 0, 0);
    let endTimeMillis = startTimeMillis - 6.048e8;

    let datasets: any = [];
    let datasources: any = await fitness.users.dataSources.list({
      userId: 'me',
    });
    datasources.data.dataSource.forEach((data: any) => {
      datasets.push({
        dataTypeName: data.dataType.name,
        dataSourceId: data.dataStreamId,
      });
      console.log({
        name: data.dataType.name,
        datasourceId: data.dataStreamId,
      });
    });

    let requestPayload = {
      aggregateBy: [
        {
          dataTypeName: 'com.google.step_count.delta',
        },
        {
          dataTypeName: 'com.google.calories.expended',
        },
      ],
      bucketByTime: { durationMillis: '86400000' },
      endTimeMillis: '' + startTimeMillis,
      startTimeMillis: '' + endTimeMillis,
    };

    try {
      let fitnessData = { avgs: {}, sets: {}, activities: {} };
      let response: GaxiosResponse = await fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: requestPayload,
      });
      console.log('Response from Gaxios Call : ');
      console.log(JSON.stringify(response));

      if (response.status == 200) {
        //console.log("Google fit response : Response : ", JSON.stringify(response))
        // let fitnessData = { avgs: {}, sets: {}, activities: {} };
        // let dataArray = generateEmptySetArray();

        await response.data.bucket.forEach((bucket: any) => {
          bucket.dataset.forEach((ds: any) => {
            const sourceId = ds.dataSourceId.split(':')[1];
            const type = dataSources[sourceId];
            console.log('Activity : ', type);
            console.log('Fitness data : ', JSON.stringify(fitnessData));
            try {
              calculate(type, ds, userId);
            } catch (e) {
              console.log('Could Not Store', type);
            }
            // if (type !== 'activity') {
            //   fitnessData.sets[type] = buildRegularSets(ds, type, dataArray);
            //   fitnessData.avgs[type] = calculateAverages(
            //     fitnessData.sets[type],
            //   );
            // } else {
            //   fitnessData.activities = buildActivitiesSet(ds);
            // }
          });
        });
        // return function
        // let responseVal = { type: 'SET_USER_DATA', payload: fitnessData };
        // console.log('Response is:', responseVal);
        // return responseVal;
      } else if ((response.status = 401)) {
        let refreshtoken: RefreshAccessTokenResponse = await oauthClient.refreshAccessToken();
        oauthClient.setCredentials(refreshtoken.credentials);
        let response: GaxiosResponse = await fitness.users.dataset.aggregate({
          userId: 'me',
          requestBody: requestPayload,
        });
        console.log('Response from Gaxios Call in refresh token call : ');
        console.log(response);
        if (response.status == 200) {
          //console.log("Google fit response : Response : ", JSON.stringify(response))
          // let dataArray = generateEmptySetArray();

          await response.data.bucket.forEach((bucket: any) => {
            bucket.dataset.forEach((ds: any) => {
              const sourceId = ds.dataSourceId.split(':')[1];
              const type = dataSources[sourceId];
              // console.log('Activity : ', type);
              // console.log('Fitness data : ', JSON.stringify(fitnessData));
              try {
                calculate(type, ds, userId);
              } catch (e) {
                console.log('Could Not store', type);
              }

              // if (type !== 'activity') {
              //   fitnessData.sets[type] = buildRegularSets(ds, type, dataArray);
              //   fitnessData.avgs[type] = calculateAverages(
              //     fitnessData.sets[type],
              //   );
              // } else {
              //   fitnessData.activities = buildActivitiesSet(ds);
              // }
            });
          });
          // return functions
          // let responseVal = { type: 'SET_USER_DATA', payload: fitnessData };
          // console.log('Response from refresh token call is:', responseVal);
          // return responseVal;
        }
      }

      let responseVal = { type: 'SET_USER_DATA', payload: response };
      console.log('Response from refresh token call is:', responseVal);
      return responseVal;
      //store the reponse
    } catch (e) {
      console.log('Error in fitness', e);
    }
  }
}
