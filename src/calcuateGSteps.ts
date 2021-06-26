import * as moment from 'moment';
import * as uuid from 'uuid';
import { GoogleDao } from '../src/dao/persistGoogle.dao';

export async function calculate(type: any, dataset: any, userId: any) {
  let result;
  if (type == 'steps') {
    dataset.point.forEach((pt: any) => {
      let googleDao = new GoogleDao('googlefitsteps');
      let uuid1 = uuid();
      let startTime = moment(pt.startTimeNanos / 1000000).format(
        'dddd MMMM Do YYYY, h:mm:ss a',
      );
      let endTime = moment(pt.endTimeNanos / 1000000).format(
        'dddd MMMM Do YYYY, h:mm:ss a',
      );
      let stepsCount = pt.value[0].intVal || pt.value[0].fpVal;
      result = googleDao.post(
        uuid1,
        userId,
        startTime,
        endTime,
        stepsCount,
        type,
      );
      console.log({
        startTime: startTime,
        endTime: endTime,
        steps: stepsCount,
        result: result,
      });
    });
  } else if (type == 'calories') {
    dataset.point.forEach((pt: any) => {
      let googleDao = new GoogleDao('googlefitcal');
      let uuid1 = uuid();
      let startTime = moment(pt.startTimeNanos / 1000000).format(
        'dddd MMMM Do YYYY, h:mm:ss a',
      );
      let endTime = moment(pt.endTimeNanos / 1000000).format(
        'dddd MMMM Do YYYY, h:mm:ss a',
      );
      let calorieCount = pt.value[0].intVal || pt.value[0].fpVal;
      result = googleDao.post(
        uuid1,
        userId,
        startTime,
        endTime,
        calorieCount,
        type,
      );
      console.log({
        startTime: startTime,
        endTime: endTime,
        calories: calorieCount,
      });
    });
  }
}
