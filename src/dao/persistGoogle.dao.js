"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
class GoogleDao {
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
    async post(id, userId, startTime, endTime, value, type) {
        console.log('Pushing google steps data');
        let putParams = {
            TableName: this.tableName,
            Item: {
                id: id,
                userId: userId,
                type: type,
                startTime: startTime,
                endTime: endTime,
                value: value,
            },
        };
        console.log('putParams:', JSON.stringify(putParams));
        return await this.dynamoDbClient.put(putParams).promise();
    }
}
exports.GoogleDao = GoogleDao;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdEdvb2dsZS5kYW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJzaXN0R29vZ2xlLmRhby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFtQztBQVFuQyxNQUFNLFNBQVM7SUFJYixZQUFZLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVc7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxJQUFJLFFBQVEsR0FBaUI7WUFDM0IsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsTUFBTTthQUNSO1NBQ1QsQ0FBQztRQUVGLElBQUk7WUFDRixNQUFNLEdBQUcsR0FBa0IsTUFBTSxJQUFJLENBQUMsY0FBYztpQkFDakQsR0FBRyxDQUFDLFFBQVEsQ0FBQztpQkFDYixPQUFPLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDaEQsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUNSLEVBQVUsRUFDVixNQUFjLEVBQ2QsU0FBYyxFQUNkLE9BQVksRUFDWixLQUFVLEVBQ1YsSUFBUztRQUVULE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN6QyxJQUFJLFNBQVMsR0FBaUI7WUFDNUIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLElBQUksRUFBRTtnQkFDSixFQUFFLEVBQUUsRUFBRTtnQkFDTixNQUFNLEVBQUUsTUFBTTtnQkFDZCxJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsU0FBUztnQkFDcEIsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLEtBQUssRUFBRSxLQUFLO2FBQ047U0FDVCxDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0NBQ0Y7QUFDUSw4QkFBUyJ9