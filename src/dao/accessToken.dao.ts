import { DynamoDB } from 'aws-sdk';
import {
  GetItemInput,
  PutItemInput,
  GetItemOutput,
} from 'aws-sdk/clients/dynamodb';

class AccessTokenDao {
  tableName: string;
  dynamoDbClient: DynamoDB.DocumentClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.dynamoDbClient = new DynamoDB.DocumentClient();
  }

  async get(userId: any): Promise<any> {
    console.log('Fetching current valid access Token', userId);
    let getParms: GetItemInput = {
      TableName: this.tableName,
      Key: {
        userId: userId,
      } as any,
    };

    try {
      const res: GetItemOutput = await this.dynamoDbClient
        .get(getParms)
        .promise();
      console.log(res, 'Current access Token in DB.');
      return res;
    } catch (e) {
      console.log(e);
    }
  }

  async post(
    userId: string,
    accessToken: any,
    tokenType: any,
    refreshToken: any,
    expirationDate: any,
    idToken: any,
  ): Promise<any> {
    console.log('Pushing the new generated access Token');
    let putParams: PutItemInput = {
      TableName: this.tableName,
      Item: {
        userId: userId,
        accessToken: accessToken,
        tokenType: tokenType,
        refreshToken: refreshToken,
        expirationDate: expirationDate,
        idToken: idToken,
      } as any,
    };

    console.log('putParams:', JSON.stringify(putParams));
    await this.dynamoDbClient.put(putParams).promise();
  }
}
export { AccessTokenDao };
