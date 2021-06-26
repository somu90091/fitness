"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
class FitBitAccessTokenDao {
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
    async post(userId, accessToken, tokenType, refreshToken, expirationDate) {
        console.log('Pushing the new generated access Token');
        let putParams = {
            TableName: this.tableName,
            Item: {
                userId: userId,
                accessToken: accessToken,
                tokenType: tokenType,
                refreshToken: refreshToken,
                expirationDate: expirationDate,
            },
        };
        console.log('putParams:', JSON.stringify(putParams));
        await this.dynamoDbClient.put(putParams).promise();
    }
}
exports.FitBitAccessTokenDao = FitBitAccessTokenDao;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml0Yml0VG9rZW4uZGFvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZml0Yml0VG9rZW4uZGFvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQW1DO0FBT25DLE1BQU0sb0JBQW9CO0lBSXhCLFlBQVksU0FBaUI7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGtCQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBVztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNELElBQUksUUFBUSxHQUFpQjtZQUMzQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxFQUFFO2dCQUNILE1BQU0sRUFBRSxNQUFNO2FBQ1I7U0FDVCxDQUFDO1FBRUYsSUFBSTtZQUNGLE1BQU0sR0FBRyxHQUFrQixNQUFNLElBQUksQ0FBQyxjQUFjO2lCQUNqRCxHQUFHLENBQUMsUUFBUSxDQUFDO2lCQUNiLE9BQU8sRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztZQUNoRCxPQUFPLEdBQUcsQ0FBQztTQUNaO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQ1IsTUFBYyxFQUNkLFdBQWdCLEVBQ2hCLFNBQWMsRUFDZCxZQUFpQixFQUNqQixjQUFtQjtRQUVuQixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDdEQsSUFBSSxTQUFTLEdBQWlCO1lBQzVCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLE1BQU07Z0JBQ2QsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixZQUFZLEVBQUUsWUFBWTtnQkFDMUIsY0FBYyxFQUFFLGNBQWM7YUFDeEI7U0FDVCxDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckQsQ0FBQztDQUNGO0FBQ1Esb0RBQW9CIn0=