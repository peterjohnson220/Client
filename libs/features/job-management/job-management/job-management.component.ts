import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import * as fromJobManagementActions from '../actions';
import * as fromJobManagementReducer from '../reducers';

@Component({
  selector: 'pf-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss'],
})
export class JobManagementComponent implements OnInit, OnChanges {

  @Input() showJobForm = false;

  @Output() cancelChanges = new EventEmitter();
  @Output() saveSuccess = new EventEmitter();

  showJobForm$: Observable<boolean>;
  loading$: Observable<boolean>;
  saving$: Observable<boolean>;

  /* TODO
    This component can be extended with a display-type property which determines how to show the AddJob form
	    As a Modal
	    As an embedded component withing a page
	    As a Payfactors standalone page
    Modify the job-management-component so we can edit jobs along with adding new jobs
    Replace all Add Job modals & componenets with the generic job-management-component
  */
  constructor(private store: Store<fromJobManagementReducer.State>) {
    this.showJobForm$ = this.store.select(fromJobManagementReducer.getShowJobForm);
    this.loading$ = this.store.select(fromJobManagementReducer.getLoading);
    this.saving$ = this.store.select(fromJobManagementReducer.getSaving);
  }

  ngOnInit() {
    this.store.dispatch(new fromJobManagementActions.LoadJobOptions());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showJobForm']) {
      this.store.dispatch(new fromJobManagementActions.ShowJobForm(changes['showJobForm'].currentValue));
    }
  }

  onCancelChanges() {
    this.store.dispatch(new fromJobManagementActions.SetDuplicateJobCodeError(false));
    this.cancelChanges.emit();
  }

}
