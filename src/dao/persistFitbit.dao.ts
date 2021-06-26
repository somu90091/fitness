import { DynamoDB } from 'aws-sdk';
import {
  GetItemInput,
  PutItemInput,
  GetItemOutput,
  PutItemOutput,
} from 'aws-sdk/clients/dynamodb';

class FitbitDao {
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
    userTime: string,
    userId: string,
    date: any,
    count: any,
  ): Promise<PutItemOutput> {
    let putParams: PutItemInput = {
      TableName: this.tableName,
      Item: {
        userTime: userTime,
        userId: userId,
        count: count,
        date: date,
      } as any,
    };
    return await this.dynamoDbClient.put(putParams).promise();
  }
}
export { FitbitDao };
