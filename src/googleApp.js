"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const jamAdapter_1 = require("./jamAdapter");
const oauthClient_1 = require("./oauthClient");
const googleapis_1 = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");
//import { eventContext } from 'aws-serverless-express/middleware';
const path_1 = require("path");
const accessToken_dao_1 = require("./dao/accessToken.dao");
function configureGoogleApp() {
    const app = express();
    app.set('view engine', 'pug');
    app.set('views', path_1.join(__dirname, '/views'));
    app.use(cors());
    app.use(body_parser_1.json());
    app.use(body_parser_1.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json({ strict: false }));
    app.get('/', (req, res) => {
        res.render('home');
    });
    app.get('/googlefit/api/callback', fetchFitnessData);
    app.get('/googlefit/fetch/userdetails', fetchUserAuthCode);
    return app;
}
exports.configureGoogleApp = configureGoogleApp;
async function fetchUserAuthCode(req, res) {
    let oauthClient = oauthClient_1.OauthClient.getInstance().oauthClient;
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
    googleapis_1.google.options({
        auth: oauthClient,
    });
    try {
        let accessTokenDao = new accessToken_dao_1.AccessTokenDao('config');
        console.log('User details being fetched : ', req.query.user);
        let result = await accessTokenDao.get(req.query.user);
        console.log('Result from config table from app.ts : ', JSON.stringify(result.Item));
        if (result.Item !== null && result.Item !== undefined) {
            res.redirect(301, '/dev/googlefit/api/callback?state=user:' +
                req.query.user +
                ',isnew:false&code=none');
            //res.send(fetchResponse);
        }
        else {
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
    }
    catch (e) {
        console.log('Exception is....', e);
    }
}
async function fetchFitnessData(req, res) {
    let response;
    let oauthClient = oauthClient_1.OauthClient.getInstance().oauthClient;
    if (oauthClient != null) {
        console.log('Auth client initialized');
    }
    googleapis_1.google.options({
        auth: oauthClient,
    });
    try {
        console.log('Get request query call : ' + req.query.code);
        console.log('User id is:', req.query.state);
        let adapater = new jamAdapter_1.GoogleAdapter(oauthClient, req.query.code);
        if (adapater != null) {
            response = await adapater.getFitnessData(oauthClient, req.query.code, req.query.state);
        }
        else {
            console.log('Adapter is destroyed');
        }
        //res.redirect(301,url);
        console.log('The response is : ');
        console.log(response);
        res.send({
            data: response,
        });
    }
    catch (e) {
        console.log('Exception is....', e);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ29vZ2xlQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLDZDQUErQztBQUMvQyw2Q0FBNkM7QUFDN0MsK0NBQTRDO0FBQzVDLDJDQUFvQztBQUNwQyw2QkFBNkI7QUFDN0IsMENBQXlDO0FBQ3pDLG1FQUFtRTtBQUNuRSwrQkFBNEI7QUFDNUIsMkRBQXVEO0FBR3ZELFNBQWdCLGtCQUFrQjtJQUNoQyxNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztJQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQUksRUFBRSxDQUFDLENBQUM7SUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FDTCx3QkFBVSxDQUFDO1FBQ1QsUUFBUSxFQUFFLElBQUk7S0FDZixDQUFDLENBQ0gsQ0FBQztJQUNGLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFNUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUVyRCxHQUFHLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLGlCQUFpQixDQUFD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