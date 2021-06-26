"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const uuid = require("uuid");
const persistGoogle_dao_1 = require("../src/dao/persistGoogle.dao");
async function calculate(type, dataset, userId) {
    let result;
    if (type == 'steps') {
        dataset.point.forEach((pt) => {
            let googleDao = new persistGoogle_dao_1.GoogleDao('googlefitsteps');
            let uuid1 = uuid();
            let startTime = moment(pt.startTimeNanos / 1000000).format('dddd MMMM Do YYYY, h:mm:ss a');
            let endTime = moment(pt.endTimeNanos / 1000000).format('dddd MMMM Do YYYY, h:mm:ss a');
            let stepsCount = pt.value[0].intVal || pt.value[0].fpVal;
            result = googleDao.post(uuid1, userId, startTime, endTime, stepsCount, type);
            console.log({
                startTime: startTime,
                endTime: endTime,
                steps: stepsCount,
                result: result,
            });
        });
    }
    else if (type == 'calories') {
        dataset.point.forEach((pt) => {
            let googleDao = new persistGoogle_dao_1.GoogleDao('googlefitcal');
            let uuid1 = uuid();
            let startTime = moment(pt.startTimeNanos / 1000000).format('dddd MMMM Do YYYY, h:mm:ss a');
            let endTime = moment(pt.endTimeNanos / 1000000).format('dddd MMMM Do YYYY, h:mm:ss a');
            let calorieCount = pt.value[0].intVal || pt.value[0].fpVal;
            result = googleDao.post(uuid1, userId, startTime, endTime, calorieCount, type);
            console.log({
                startTime: startTime,
                endTime: endTime,
                calories: calorieCount,
            });
        });
    }
}
exports.calculate = calculate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VhdGVHU3RlcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWxjdWF0ZUdTdGVwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyw2QkFBNkI7QUFDN0Isb0VBQXlEO0FBRWxELEtBQUssVUFBVSxTQUFTLENBQUMsSUFBUyxFQUFFLE9BQVksRUFBRSxNQUFXO0lBQ2xFLElBQUksTUFBTSxDQUFDO0lBQ1gsSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBTyxFQUFFLEVBQUU7WUFDaEMsSUFBSSxTQUFTLEdBQUcsSUFBSSw2QkFBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUM7WUFDbkIsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUN4RCw4QkFBOEIsQ0FDL0IsQ0FBQztZQUNGLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FDcEQsOEJBQThCLENBQy9CLENBQUM7WUFDRixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUN6RCxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FDckIsS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLFVBQVUsRUFDVixJQUFJLENBQ0wsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0JBQ1YsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixLQUFLLEVBQUUsVUFBVTtnQkFDakIsTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztLQUNKO1NBQU0sSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBTyxFQUFFLEVBQUU7WUFDaEMsSUFBSSxTQUFTLEdBQUcsSUFBSSw2QkFBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlDLElBQUksS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDO1lBQ25CLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FDeEQsOEJBQThCLENBQy9CLENBQUM7WUFDRixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQ3BELDhCQUE4QixDQUMvQixDQUFDO1lBQ0YsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDM0QsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQ3JCLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULE9BQU8sRUFDUCxZQUFZLEVBQ1osSUFBSSxDQUNMLENBQUM7WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUNWLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixPQUFPLEVBQUUsT0FBTztnQkFDaEIsUUFBUSxFQUFFLFlBQVk7YUFDdkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUF0REQsOEJBc0RDIn0=