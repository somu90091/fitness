"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dictionaries_1 = require("./dictionaries");
function generateEmptySetArray() {
    let emptyArray = [];
    for (var i = 6; i >= 0; i--) {
        //Get today's date and generate day of week going backwards 7 days
        const today = new Date().setHours(0, 0, 0, 0);
        const prevDay = new Date(today - 6.048e8 / 7 * (i + 1)).getDay();
        //Change entries and initialize value to zero
        emptyArray[i] = { day: 0, value: 0 };
        emptyArray[i].day = prevDay;
        emptyArray[i].value = 0;
    }
    return emptyArray;
}
exports.generateEmptySetArray = generateEmptySetArray;
//Create sets for non-activity data
//Create arrays of data for steps, distance, calories and speed
function buildRegularSets(dataset, type, dataArray) {
    //let dataArray = generateEmptySetArray();
    dataset.point.forEach((pt) => {
        //Determine the day of week activity was completed - based on end time
        let day = new Date(pt.endTimeNanos / 1000000).getDay();
        let value = pt.value[0].intVal || pt.value[0].fpVal;
        let index = dataArray.findIndex((entry) => entry.day === day);
        //Add value to array - average if speed
        //Note: average is simplified here - for more accuracy it should be
        //a weighted average
        if (type === 'speed') {
            dataArray[index].value += value;
            dataArray[index].value /= 2;
        }
        else {
            dataArray[index].value += value;
        }
    });
    return dataArray;
}
exports.buildRegularSets = buildRegularSets;
//Create the set of activities
//Create activities object that contains the activities completed by user
//and the days of the week when they were completed
function buildActivitiesSet(dataset) {
    let activitiesSet = {};
    dataset.point.forEach((point) => {
        //Determine the day of week activity was completed - based on end time
        //and activity type
        let day = new Date(point.endTimeNanos / 1000000).getDay();
        let activity = dictionaries_1.activitiesDictionary[point.value[0].intVal] || '';
        //Check to see if activity code is valid
        if (activity) {
            if (activity in activitiesSet) {
                const index = activitiesSet[activity].findIndex((el) => el === day);
                if (index === -1)
                    activitiesSet[activity].push(day);
            }
            else {
                activitiesSet[activity] = [];
                activitiesSet[activity].push(day);
            }
        }
    });
    return activitiesSet;
}
exports.buildActivitiesSet = buildActivitiesSet;
//Calculating weekly averages
function calculateAverages(dataArray) {
    const sum = dataArray
        .map((point) => point.value)
        .reduce((acc, next) => (acc += next));
    const avg = Math.round(sum / 7 * 10) / 10;
    return avg;
}
exports.calculateAverages = calculateAverages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YUJ1Y2tldHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYXRhQnVja2V0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFzRDtBQUV0RCxTQUFnQixxQkFBcUI7SUFDbkMsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0Isa0VBQWtFO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakUsNkNBQTZDO1FBQzdDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3JDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQWJELHNEQWFDO0FBRUQsbUNBQW1DO0FBQ25DLCtEQUErRDtBQUMvRCxTQUFnQixnQkFBZ0IsQ0FBQyxPQUFZLEVBQUUsSUFBUyxFQUFFLFNBQWM7SUFDdEUsMENBQTBDO0lBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBTyxFQUFFLEVBQUU7UUFDaEMsc0VBQXNFO1FBQ3RFLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDcEQsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUVuRSx1Q0FBdUM7UUFDdkMsbUVBQW1FO1FBQ25FLG9CQUFvQjtRQUNwQixJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDcEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7WUFDaEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7U0FDN0I7YUFBTTtZQUNMLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBcEJELDRDQW9CQztBQUVELDhCQUE4QjtBQUM5Qix5RUFBeUU7QUFDekUsbURBQW1EO0FBQ25ELFNBQWdCLGtCQUFrQixDQUFDLE9BQVk7SUFDN0MsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7UUFDbkMsc0VBQXNFO1FBQ3RFLG1CQUFtQjtRQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFELElBQUksUUFBUSxHQUFHLG1DQUFvQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWpFLHdDQUF3QztRQUN4QyxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksUUFBUSxJQUFJLGFBQWEsRUFBRTtnQkFDN0IsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FDN0MsQ0FBQyxFQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQ3hCLENBQUM7Z0JBQ0YsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO29CQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDckQ7aUJBQU07Z0JBQ0wsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDN0IsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBdkJELGdEQXVCQztBQUVELDZCQUE2QjtBQUM3QixTQUFnQixpQkFBaUIsQ0FBQyxTQUFjO0lBQzlDLE1BQU0sR0FBRyxHQUFHLFNBQVM7U0FDbEIsR0FBRyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1NBQ2hDLE1BQU0sQ0FBQyxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQyxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFORCw4Q0FNQyJ9