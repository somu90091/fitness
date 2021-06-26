"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const cors = require("cors");
//import { eventContext } from 'aws-serverless-express/middleware';
const axios_1 = require("axios");
const querystring = require("querystring");
const fitbitToken_dao_1 = require("./dao/fitbitToken.dao");
const persistFitbit_dao_1 = require("./dao/persistFitbit.dao");
function configureFitbitApp() {
    const app = express();
    app.set('view engine', 'pug');
    app.use(cors());
    app.use(body_parser_1.json());
    app.use(body_parser_1.urlencoded({
        extended: true,
    }));
    //app.use(eventContext());
    app.get('/', (req, res) => {
        res.render('home');
    });
    app.get('/fitbit/oauth/redirect', fitbitRedirect);
    app.get('/fitbit/oauth/codeflow', fitbitFlow);
    return app;
}
exports.configureFitbitApp = configureFitbitApp;
async function fitbitFlow(req, res) {
    try {
        let fitbitAccessTokenDao = new fitbitToken_dao_1.FitBitAccessTokenDao('fitbitconfig');
        console.log('User details being fetched : ', req.query.user);
        let result = await fitbitAccessTokenDao.get(req.query.user);
        console.log('Result from config table from app.ts : ', JSON.stringify(result.Item));
        if (result.Item !== null && result.Item !== undefined) {
            res.redirect(301, '/fitbit/oauth/redirect?state=user:' +
                req.query.user +
                ',isnew:false&code=none');
            //res.send(fetchResponse);
        }
        else {
            let callback_url = 'https://emzkzxxqb7.execute-api.eu-west-1.amazonaws.com/dev/fitbit/oauth/redirect';
            let scope = 'activity heartrate location nutrition profile settings sleep social weight';
            let expires_in = '604800';
            let state = 'user:' + req.query.user + ',isNew:true';
            let client_id = '22DJDD';
            let response_type = 'code';
            let redirect_url = encodeURI('https://www.fitbit.com/oauth2/authorize?' +
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
                state);
            //let redirectUrl: string = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22DJDD&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ffitbit%2Foauth%2Fredirect&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800&state=userid:suhas';
            res.redirect(301, redirect_url);
        }
    }
    catch (e) { }
}
async function fitbitRedirect(req, res) {
    const authcode = req.query.code;
    console.log('The auth code is : ' + authcode);
    const state = req.query.state;
    let userId = state.split(',')[0].split(':')[1];
    let isNew = state.split(',')[1].split(':')[1];
    let fitbitAccessTokenDao = new fitbitToken_dao_1.FitBitAccessTokenDao('fitbitconfig');
    console.log('User id : ', userId);
    console.log('isUserNew:', isNew);
    var d = new Date(), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    let dateStr = [year, month, day].join('-');
    //let activity_url = 'https://api.fitbit.com/1/user/-/activities/date/2019-04-03.json'
    let activity_steps_timeseries = 'https://api.fitbit.com/1/user/-/activities/steps/date/' + dateStr + '/7d.json';
    let activity_calories_timeseries = 'https://api.fitbit.com/1/user/-/activities/calories/date/' + dateStr + '/7d.json';
    let activity_lifetime = 'https://api.fitbit.com/1/user/-/activities.json';
    let authconfig = { headers: {} };
    let refreshToken = '';
    let userResult = await fitbitAccessTokenDao.get(userId);
    console.log('userTokenDetails', userResult.Item);
    if (isNew === 'true') {
        let reqBody = {
            clientId: '22DJDD',
            grant_type: 'authorization_code',
            redirect_uri: 'https://emzkzxxqb7.execute-api.eu-west-1.amazonaws.com/dev/fitbit/oauth/redirect',
            code: authcode,
        };
        let config = {
            headers: {
                Authorization: 'Basic MjJESkREOmQxYjllOWRmMDUwNGJhOTMxM2FkODg1M2MwYjA0NDRh',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const url = 'https://api.fitbit.com/oauth2/token';
        let tokenResp = await axios_1.default.post(url, querystring.stringify(reqBody), {
            headers: config.headers,
        });
        console.log("Response token : ");
        console.log(tokenResp);
        await fitbitAccessTokenDao.post(userId, tokenResp.data.access_token, tokenResp.data.token_type, tokenResp.data.refresh_token, tokenResp.data.expires_in);
        refreshToken = tokenResp.data.refresh_token;
        let accessToken = tokenResp.data.access_token;
        authconfig.headers = {
            Authorization: 'Bearer ' + accessToken,
        };
    }
    else {
        console.log('Entered the existing user auth flow ');
        console.log('User Id : ' + userId);
        refreshToken = userResult.Item.refreshToken;
        authconfig.headers = {
            Authorization: 'Bearer ' + userResult.Item.accessToken,
        };
        console.log("Done the authorization check for the exiting user");
    }
    let activityStepsTimeSeriesResponse = null;
    let activityCaloriesTimeSeriesResponse = null;
    let activityLifetime = null;
    try {
        activityStepsTimeSeriesResponse = await axios_1.default.get(activity_steps_timeseries, { headers: authconfig.headers });
        activityCaloriesTimeSeriesResponse = await axios_1.default.get(activity_calories_timeseries, { headers: authconfig.headers });
        activityLifetime = await axios_1.default.get(activity_lifetime, {
            headers: authconfig.headers,
        });
    }
    catch (error) {
        console.log("Error in promise resolution : ");
        console.log(error.response.status);
        let refreshTokenConfig = {
            headers: {
                Authorization: 'Basic MjJESkREOmQxYjllOWRmMDUwNGJhOTMxM2FkODg1M2MwYjA0NDRh',
            },
        };
        console.log("Refresh token val : ");
        console.log(refreshToken);
        let refreshReqBody = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        };
        let refreshTokenResponse = await axios_1.default.post('https://api.fitbit.com/oauth2/token', querystring.stringify(refreshReqBody), { headers: refreshTokenConfig.headers });
        let accessToken = refreshTokenResponse.data.access_token;
        let refreshTokenNew = refreshTokenResponse.data.refresh_token;
        console.log('Access token : ' + accessToken);
        console.log('Refresh Token : ' + refreshTokenNew);
        await fitbitAccessTokenDao.post(userId, refreshTokenResponse.data.access_token, refreshTokenResponse.data.token_type, refreshTokenResponse.data.refresh_token, refreshTokenResponse.data.expiry_date);
        authconfig.headers = {
            Authorization: 'Bearer ' + accessToken,
        };
        activityStepsTimeSeriesResponse = await axios_1.default.get(activity_steps_timeseries, { headers: authconfig.headers });
        activityCaloriesTimeSeriesResponse = await axios_1.default.get(activity_calories_timeseries, { headers: authconfig.headers });
        activityLifetime = await axios_1.default.get(activity_lifetime, {
            headers: authconfig.headers,
        });
        console.log("Moving out of the catch block : ");
    }
    if (activityStepsTimeSeriesResponse.status == 200 ||
        activityCaloriesTimeSeriesResponse.status == 200 ||
        activityLifetime.status == 200) {
        let timeseriesData = activityStepsTimeSeriesResponse.data['activities-steps'];
        let fitbitStoreDao = new persistFitbit_dao_1.FitbitDao('fitbitsteps');
        let timeseriesCalData = activityCaloriesTimeSeriesResponse.data['activities-calories'];
        let fitbitCaloriesStoreDao = new persistFitbit_dao_1.FitbitDao('fitbitcalories');
        timeseriesData.forEach(async (data) => {
            console.log(data);
            await fitbitStoreDao.post(userId + data.dateTime, userId, data.dateTime, data.value);
        });
        timeseriesCalData.forEach(async (data) => {
            await fitbitCaloriesStoreDao.post(userId + data.dateTime, userId, data.dateTime, data.value);
        });
        res.send({
            // activity_steps_timeseries: activityStepsTimeSeriesResponse.data,
            // activity_calories_timeseries: activityCaloriesTimeSeriesResponse.data,
            // activity_lifetime: activityLifetime.data,
            message: "success",
            status: 200
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml0Yml0YXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZml0Yml0YXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLDZDQUErQztBQUMvQyw2QkFBNkI7QUFDN0IsbUVBQW1FO0FBQ25FLGlDQUEwQjtBQUMxQiwyQ0FBMkM7QUFDM0MsMkRBQTZEO0FBQzdELCtEQUFvRDtBQUlwRCxTQUFnQixrQkFBa0I7SUFDaEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7SUFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQUksRUFBRSxDQUFDLENBQUM7SUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FDTCx3QkFBVSxDQUFDO1FBQ1QsUUFBUSxFQUFFLElBQUk7S0FDZixDQUFDLENBQ0gsQ0FBQztJQUVGLDBCQUEwQjtJQUUxQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNsRCxHQUFHLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQXBCRCxnREFvQkM7QUFFRCxLQUFLLFVBQVUsVUFBVSxDQUN2QixHQUFvQixFQUNwQixHQUFxQjtJQUVyQixJQUFJO1FBQ0YsSUFBSSxvQkFBb0IsR0FBeUIsSUFBSSxzQ0FBb0IsQ0FDdkUsY0FBYyxDQUNmLENBQUM7UUFDRixPQUFPLENBQUMsR0FB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