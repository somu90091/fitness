"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Configuration, IConfig } from "../config";
const googleapis_1 = require("googleapis");
const dictionaries_1 = require("../src/dictionaries");
const accessToken_dao_1 = require("../src/dao/accessToken.dao");
const calcuateGSteps_1 = require("../src/calcuateGSteps");
class GoogleAdapter {
    constructor(oauthClient, authcode) {
        this.oauthclient = oauthClient;
        this.authcode = authcode;
    }
    async getGoogleToken(oauthClient, authcode) {
        let token;
        try {
            token = await oauthClient.getToken(authcode);
            oauthClient.setCredentials(token);
        }
        catch (e) {
            console.log('Error');
        }
        return token;
    }
    async getFitnessData(oauthClient, authcode, state) {
        let accessTokenDao = new accessToken_dao_1.AccessTokenDao('config');
        console.log('Token for fitness : ');
        let stateArr = state.split(',');
        let userId = stateArr[0].split(':')[1];
        let isNew = stateArr[1].split(':')[1];
        console.log('User id : ', userId);
        console.log('isUserNew:', isNew);
        if (isNew === 'true') {
            console.log('Entered the new auth flow ');
            let token = await oauthClient.getToken(authcode);
            await accessTokenDao.post(userId, token.tokens.access_token, token.tokens.token_type, token.tokens.refresh_token, token.tokens.expiry_date, token.tokens.id_token);
            oauthClient.setCredentials({
                access_token: token.tokens.access_token,
                token_type: token.tokens.token_type,
                expiry_date: token.tokens.expiry_date,
                id_token: token.tokens.id_token,
                refresh_token: token.tokens.refresh_token,
            });
        }
        else {
            console.log('Entered the existing user auth flow ');
            console.log('User Id : ' + userId);
            let userResult = await accessTokenDao.get(userId);
            console.log('userTokenDetails', userResult.Item);
            oauthClient.setCredentials({
                access_token: userResult.Item.accessToken,
                token_type: userResult.Item.tokenType,
                expiry_date: userResult.Item.expirationDate,
                id_token: userResult.Item.idToken,
                refresh_token: userResult.Item.refreshToken,
            });
        }
        let fitness = googleapis_1.google.fitness({
            version: 'v1',
            auth: oauthClient,
        });
        if (fitness == null) {
            console.log('fitness is null');
        }
        let startTimeMillis = new Date().setHours(0, 0, 0, 0);
        let endTimeMillis = startTimeMillis - 6.048e8;
        let datasets = [];
        let datasources = await fitness.users.dataSources.list({
            userId: 'me',
        });
        datasources.data.dataSource.forEach((data) => {
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
            let response = await fitness.users.dataset.aggregate({
                userId: 'me',
                requestBody: requestPayload,
            });
            console.log('Response from Gaxios Call : ');
            console.log(JSON.stringify(response));
            if (response.status == 200) {
                //console.log("Google fit response : Response : ", JSON.stringify(response))
                // let fitnessData = { avgs: {}, sets: {}, activities: {} };
                // let dataArray = generateEmptySetArray();
                await response.data.bucket.forEach((bucket) => {
                    bucket.dataset.forEach((ds) => {
                        const sourceId = ds.dataSourceId.split(':')[1];
                        const type = dictionaries_1.dataSources[sourceId];
                        console.log('Activity : ', type);
                        console.log('Fitness data : ', JSON.stringify(fitnessData));
                        try {
                            calcuateGSteps_1.calculate(type, ds, userId);
                        }
                        catch (e) {
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
            }
            else if ((response.status = 401)) {
                let refreshtoken = await oauthClient.refreshAccessToken();
                oauthClient.setCredentials(refreshtoken.credentials);
                let response = await fitness.users.dataset.aggregate({
                    userId: 'me',
                    requestBody: requestPayload,
                });
                console.log('Response from Gaxios Call in refresh token call : ');
                console.log(response);
                if (response.status == 200) {
                    //console.log("Google fit response : Response : ", JSON.stringify(response))
                    // let dataArray = generateEmptySetArray();
                    await response.data.bucket.forEach((bucket) => {
                        bucket.dataset.forEach((ds) => {
                            const sourceId = ds.dataSourceId.split(':')[1];
                            const type = dictionaries_1.dataSources[sourceId];
                            // console.log('Activity : ', type);
                            // console.log('Fitness data : ', JSON.stringify(fitnessData));
                            try {
                                calcuateGSteps_1.calculate(type, ds, userId);
                            }
                            catch (e) {
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
        }
        catch (e) {
            console.log('Error in fitness', e);
        }
    }
}
exports.GoogleAdapter = GoogleAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFtQWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImphbUFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBc0Q7QUFDdEQsMkNBQW9DO0FBT3BDLHNEQUFrRDtBQUNsRCxnRUFBNEQ7QUFDNUQsMERBQWtEO0FBRWxELE1BQWEsYUFBYTtJQUt4QixZQUFZLFdBQXlCLEVBQUUsUUFBZ0I7UUFDckQsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVNLEtBQUssQ0FBQyxjQUFjLENBQ3pCLFdBQWdCLEVBQ2hCLFFBQWdCO1FBRWhCLElBQUksS0FBSyxDQUFDO1FBQ1YsSUFBSTtZQUNGLEtBQUssR0FBRyxNQUFNLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0MsV0FBVyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVNLEtBQUssQ0FBQyxjQUFjLENBQ3pCLFdBQXlCLEVBQ3pCLFFBQWdCLEVBQ2hCLEtBQWE7UUFFYixJQUFJLGNBQWMsR0FBbUIsSUFBSSxnQ0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwQyxJQUFJLFFBQVEsR0FBUSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FB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