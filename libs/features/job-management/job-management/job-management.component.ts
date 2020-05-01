import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Store, ActionsSubject } from '@ngrx/store';

import * as fromJobManagementActions from '../actions';
import * as fromJobManagementReducer from '../reducers';
import { ofType } from '@ngrx/effects';
import { CompanyJob } from 'libs/models';

@Component({
  selector: 'pf-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss'],
})
export class JobManagementComponent implements OnInit, OnChanges, OnDestroy {

  @Input() showModal$: Observable<boolean>;
  @Input() jobId: number;

  @Output() cancelChanges = new EventEmitter();
  @Output() saveSuccess = new EventEmitter();

  loading$: Observable<boolean>;
  saving$: Observable<boolean>;

  saveSuccessSubscription = new Subscription();
  showModalSubscription = new Subscription();
  jobFormDataSubscription = new Subscription();

  jobFormData: CompanyJob;

  /* TODO
    This component can be extended with a display-type property which determines how to show the AddJob form
	    As a Modal
	    As an embedded component withing a page
	    As a Payfactors standalone page
    Replace all Add Job modals & componenets with the generic job-management-component
  */
  constructor(private store: Store<fromJobManagementReducer.State>, private actionsSubject: ActionsSubject) {
    this.loading$ = this.store.select(fromJobManagementReducer.getLoading);
    this.saving$ = this.store.select(fromJobManagementReducer.getSaving);
    this.jobFormDataSubscription = this.store.select(fromJobManagementReducer.getJobFormData)
      .subscribe(value => {
        this.jobFormData = value;
      });

    this.saveSuccessSubscription = actionsSubject
      .pipe(ofType(fromJobManagementActions.SAVE_COMPANY_JOB_SUCCESS))
      .subscribe(data => {
        this.saveSuccess.emit();
      });
  }

  ngOnInit() {
    this.store.dispatch(new fromJobManagementActions.LoadJobOptions());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] && changes['jobId'].currentValue) {
      this.store.dispatch(new fromJobManagementActions.LoadJob(changes['jobId'].currentValue));
    }
  }

  ngOnDestroy() {
    this.saveSuccessSubscription.unsubscribe();
    this.showModalSubscription.unsubscribe();
  }

  onCancelChanges() {
    this.store.dispatch(new fromJobManagementActions.ResetState());
    this.cancelChanges.emit();
  }

}
