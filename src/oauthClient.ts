import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

export class OauthClient {
  private static instance: OauthClient;

  public oauthClient: OAuth2Client;

  private constructor() {}

  static getInstance(): OauthClient {
    if (!OauthClient.instance) {
      OauthClient.instance = new OauthClient();
      /*OauthClient.instance.oauthClient = new google.auth.OAuth2(
        '43694453964-pj76ss9d4f7m246kp46tf9fuah3kud57.apps.googleusercontent.com',
        'bjNrxwyOXCwdEwrwyWviQGWh',
        'https://42f60559.ngrok.io/api/callback',
      );*/
      OauthClient.instance.oauthClient = new google.auth.OAuth2(
        '43694453964-l637qmb5n2q3lfrukn1m741tgc91h906.apps.googleusercontent.com',
        'vs5QdKq-vD8sr6Nkfiva32Ln',
        'https://emzkzxxqb7.execute-api.eu-west-1.amazonaws.com/dev/googlefit/api/callback',
      );
    }
    return OauthClient.instance;
  }
}
