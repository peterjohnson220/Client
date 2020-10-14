import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { CompanyJob } from 'libs/models';

import * as fromJobManagementActions from '../actions';
import * as fromNotesManagerActions from '../../notes-manager/actions';
import * as fromJobManagementReducer from '../reducers';
import { JobContainerComponent } from '../containers';

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

  @ViewChild(JobContainerComponent) jobContainer: JobContainerComponent;

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
  constructor(private store: Store<fromJobManagementReducer.State>,
              private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    this.loading$ = this.store.select(fromJobManagementReducer.getLoading);
    this.saving$ = this.store.select(fromJobManagementReducer.getSaving);
    this.jobFormDataSubscription = this.store.select(fromJobManagementReducer.getJobFormData)
      .subscribe(value => {
        this.jobFormData = value;
      });

    this.saveSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobManagementActions.SAVE_COMPANY_JOB_SUCCESS))
      .subscribe(data => {
        this.resetForms();
        this.saveSuccess.emit();
      });

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
    this.jobFormDataSubscription.unsubscribe();
  }

  onCancelChanges() {
    this.resetForms();
    this.cancelChanges.emit();
  }

  resetForms() {
    this.jobContainer.notesManager.notesManagerContent?.resetForm();
    this.store.dispatch(new fromJobManagementActions.ResetState());
    this.store.dispatch(new fromNotesManagerActions.ResetState());
  }

}
