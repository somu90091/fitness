"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
class FitbitDao {
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
    async post(userTime, userId, date, count) {
        let putParams = {
            TableName: this.tableName,
            Item: {
                userTime: userTime,
                userId: userId,
                count: count,
                date: date,
            },
        };
        return await this.dynamoDbClient.put(putParams).promise();
    }
}
exports.FitbitDao = FitbitDao;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdEZpdGJpdC5kYW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJzaXN0Rml0Yml0LmRhby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFtQztBQVFuQyxNQUFNLFNBQVM7SUFJYixZQUFZLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVc7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxJQUFJLFFBQVEsR0FBaUI7WUFDM0IsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsTUFBTTthQUNSO1NBQ1QsQ0FBQztRQUVGLElBQUk7WUFDRixNQUFNLEdBQUcsR0FBa0IsTUFBTSxJQUFJLENBQUMsY0FBYztpQkFDakQsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixPQUFPLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDaEQsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUNSLFFBQWdCLEVBQ2hCLE1BQWMsRUFDZCxJQUFTLEVBQ1QsS0FBVTtRQUVWLElBQUksU0FBUyxHQUFpQjtZQUM1QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsSUFBSTthQUNKO1NBQ1QsQ0FBQztRQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0NBQ0Y7QUFDUSw4QkFBUyJ9