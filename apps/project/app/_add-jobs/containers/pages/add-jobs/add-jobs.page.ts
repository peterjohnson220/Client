import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAddJobsReducer from '../../../reducers';
import * as fromJobsPageActionsfrom from '../../../actions/add-jobs.page.actions';

@Component({
  selector: 'pf-add-jobs-page',
  templateUrl: './add-jobs.page.html',
  styleUrls: ['./add-jobs.page.scss']
})
export class AddJobsPageComponent  {

  selectedJobIds$: Observable<number[]>;

  constructor(
    private store: Store<fromAddJobsReducer.State>,
  ) {
    this.selectedJobIds$ = this.store.select(fromAddJobsReducer.getSelectedJobIds);
  }

  // Event Handling
  handleCancelClicked() {
    this.store.dispatch(new fromJobsPageActionsfrom.CloseJobsSearch());
  }


}
