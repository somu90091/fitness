"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
class AccessTokenDao {
    constructor(tableName) {
        this.tableName = tableName;
        this.dynamoDbClient = new aws_sdk_1.DynamoDB.DocumentClient();
    }
    async get(userId) {
        console.log('Fetching current valid access Token', userId);
        let getParms = {
            TableName: this.tableName,
            Key: {
                userId: userId,
            },
        };
        try {
            const res = await this.dynamoDbClient
                .get(getParms)
                .promise();
            console.log(res, 'Current access Token in DB.');
            return res;
        }
        catch (e) {
            console.log(e);
        }
    }
    async post(userId, accessToken, tokenType, refreshToken, expirationDate, idToken) {
        console.log('Pushing the new generated access Token');
        let putParams = {
            TableName: this.tableName,
            Item: {
                userId: userId,
                accessToken: accessToken,
                tokenType: tokenType,
                refreshToken: refreshToken,
                expirationDate: expirationDate,
                idToken: idToken,
            },
        };
        console.log('putParams:', JSON.stringify(putParams));
        await this.dynamoDbClient.put(putParams).promise();
    }
}
exports.AccessTokenDao = AccessTokenDao;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzVG9rZW4uZGFvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWNjZXNzVG9rZW4uZGFvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQW1DO0FBT25DLE1BQU0sY0FBYztJQUlsQixZQUFZLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVc7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxJQUFJLFFBQVEsR0FBaUI7WUFDM0IsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsTUFBTTthQUNSO1NBQ1QsQ0FBQztRQUVGLElBQUk7WUFDRixNQUFNLEdBQUcsR0FBa0IsTUFBTSxJQUFJLENBQUMsY0FBYztpQkFDakQsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixPQUFPLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDaEQsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUNSLE1BQWMsRUFDZCxXQUFnQixFQUNoQixTQUFjLEVBQ2QsWUFBaUIsRUFDakIsY0FBbUIsRUFDbkIsT0FBWTtRQUVaLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN0RCxJQUFJLFNBQVMsR0FBaUI7WUFDNUIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsTUFBTTtnQkFDZCxXQUFXLEVBQUUsV0FBVztnQkFDeEIsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLFlBQVksRUFBRSxZQUFZO2dCQUMxQixjQUFjLEVBQUUsY0FBYztnQkFDOUIsT0FBTyxFQUFFLE9BQU87YUFDVjtTQUNULENBQUM7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckQsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0NBQ0Y7QUFDUSx3Q0FBYyJ9