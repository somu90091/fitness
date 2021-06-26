import { DynamoDB } from 'aws-sdk';
import {
  GetItemInput,
  PutItemInput,
  GetItemOutput,
  PutItemOutput,
} from 'aws-sdk/clients/dynamodb';

class GoogleDao {
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
    id: string,
    userId: string,
    startTime: any,
    endTime: any,
    value: any,
    type: any,
  ): Promise<PutItemOutput> {
    console.log('Pushing google steps data');
    let putParams: PutItemInput = {
      TableName: this.tableName,
      Item: {
        id: id,
        userId: userId,
        type: type,
        startTime: startTime,
        endTime: endTime,
        value: value,
      } as any,
    };

    console.log('putParams:', JSON.stringify(putParams));
    return await this.dynamoDbClient.put(putParams).promise();
  }
}
export { GoogleDao };
