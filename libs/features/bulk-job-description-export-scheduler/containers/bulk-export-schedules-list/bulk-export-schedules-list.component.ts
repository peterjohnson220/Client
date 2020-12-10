import { Component, Input} from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { BulkExportSchedule, JobDescriptionViewModel } from 'libs/models/jdm';

import * as fromJdmAdminReducer from '../../reducers/index';
import * as fromJdmBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';

@Component({
  selector: 'pf-bulk-export-schedules-list',
  templateUrl: './bulk-export-schedules-list.component.html',
  styleUrls: [ './bulk-export-schedules-list.component.scss' ]
})
export class BulkExportSchedulesListComponent {
  @Input() schedules: BulkExportSchedule[];
  @Input() views: JobDescriptionViewModel[];

  clickedSchedule: string;
  weekday: string[] = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  occurence: string[] = [ 'First', 'Second', 'Third', 'Fourth' ];
  showBulkScheduleDeleteModal$: Observable<boolean>;
  filename: string;

  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.showBulkScheduleDeleteModal$ = this.store.select(fromJdmAdminReducer.getBulkScheduleDeleteModalOpen);
  }

  removeSchedule(fileName) {
    this.store.dispatch(new fromJdmBulkExportScheduleActions.RemovingSchedule(fileName));
    this.store.dispatch(new fromJdmBulkExportScheduleActions.CloseScheduleModal);
  }

  onScheduleClick(identifier) {
    this.clickedSchedule = this.clickedSchedule !== identifier ? identifier : '';
  }

  occurrenceAsString(occurrence) {
    return this.occurence[ occurrence - 1 ];
  }

  daysOfWeekAsString(dayNumbers) {
    const days = dayNumbers.split(',');
    let daysString = '';
    days.sort();

    for (const day of days) {
      daysString += this.weekday[ day - 1 ] + ', ';
    }

    return daysString.slice(0, -2);
  }

  getViewName(viewId) {
    for (const view of this.views) {
      if (view.Id === viewId) {
        return view.Name;
      }
    }

    return '';
  }

  closeBulkScheduleDeleteModal() {
    this.store.dispatch(new fromJdmBulkExportScheduleActions.CloseScheduleModal);
  }

  openModal(filename) {
    this.filename = filename;
    this.store.dispatch(new fromJdmBulkExportScheduleActions.OpenScheduleModal);
  }
}
