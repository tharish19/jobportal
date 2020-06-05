import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  // tslint:disable-next-line: pipe-prefix
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(moment.utc(value).toDate())) / 1000);
      if (seconds < 29) {
        return 'now';
      }
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
      };
      let counter;
      for (const i of Object.keys(intervals)) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            // if (i === 'hour' || i === 'minute' || i === 'second') {
            //   return '-';
            // }
            return counter + ' ' + i + ' ago';
          }
          // if (i === 'hour' || i === 'minute' || i === 'second') {
          //   return '-';
          // }
          return counter + ' ' + i + 's ago';
        }
      }
    }
    return value;
  }

}
