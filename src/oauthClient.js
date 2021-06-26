"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
class OauthClient {
    constructor() { }
    static getInstance() {
        if (!OauthClient.instance) {
            OauthClient.instance = new OauthClient();
            /*OauthClient.instance.oauthClient = new google.auth.OAuth2(
              '43694453964-pj76ss9d4f7m246kp46tf9fuah3kud57.apps.googleusercontent.com',
              'bjNrxwyOXCwdEwrwyWviQGWh',
              'https://42f60559.ngrok.io/api/callback',
            );*/
            OauthClient.instance.oauthClient = new googleapis_1.google.auth.OAuth2('43694453964-l637qmb5n2q3lfrukn1m741tgc91h906.apps.googleusercontent.com', 'vs5QdKq-vD8sr6Nkfiva32Ln', 'https://emzkzxxqb7.execute-api.eu-west-1.amazonaws.com/dev/googlefit/api/callback');
        }
        return OauthClient.instance;
    }
}
exports.OauthClient = OauthClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGhDbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvYXV0aENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFvQztBQUdwQyxNQUFhLFdBQVc7SUFLdEIsZ0JBQXVCLENBQUM7SUFFeEIsTUFBTSxDQUFDLFdBQVc7UUFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDekIsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3pDOzs7O2dCQUlJO1lBQ0osV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3ZELHlFQUF5RSxFQUN6RSwwQkFBMEIsRUFDMUIsbUZBQW1GLENBQ3BGLENBQUM7U0FDSDtRQUNELE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQztJQUM5QixDQUFDO0NBQ0Y7QUF2QkQsa0NBdUJDIn0=