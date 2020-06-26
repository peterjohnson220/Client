import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';

import { Store, ActionsSubject } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

import { JobDescriptionSummaryEditorComponent } from 'libs/forms';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import * as fromJobsPageReducer from '../../../../reducers';
import * as fromJobDescriptionActions from '../../../../actions';

import { JobDescriptionSummary, AsyncStateObj } from 'libs/models';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'pf-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: PfDataGridFilter[];

  @ViewChild('jobDescriptionEditor', { static: true }) jobDescriptionEditor: JobDescriptionSummaryEditorComponent;

  readonly JOB_SUMMARY_MIN_LENGTH = 10;

  loading$: Observable<boolean>;
  jobDescriptionSummary$: Observable<AsyncStateObj<JobDescriptionSummary>>;
  updatedJobDescription$: Observable<string>;

  loadJobDescriptionSuccessSubscription: Subscription;

  jobDescriptionSummary: JobDescriptionSummary;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    this.loadJobDescriptionSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobDescriptionActions.LOAD_JOB_DESCRIPTION_SUCCESS))
      .subscribe((action: fromJobDescriptionActions.LoadJobDescriptionSuccess) => {
        this.jobDescriptionSummary = action.payload;
      });

    this.loading$ = this.store.select(fromJobsPageReducer.getLoading);
    this.jobDescriptionSummary$ = this.store.select(fromJobsPageReducer.getJobDescriptionSummary);
    this.updatedJobDescription$ = this.store.select(fromJobsPageReducer.getUpdatedJobDescription);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.jobDescriptionSummary = null;
      const companyJobIdFilter = changes['filters'].currentValue.find(i => i.SourceName === 'CompanyJob_ID').Value;
      this.store.dispatch(new fromJobDescriptionActions.LoadJobDescription((<any>companyJobIdFilter) as number));
    }
  }

  jobDescriptionChanged(newJobDescription: string) {
    this.store.dispatch(new fromJobDescriptionActions.ChangeJobDescription(newJobDescription));
  }

  ngOnDestroy() {
    this.loadJobDescriptionSuccessSubscription.unsubscribe();
  }

  saveJobDescription() {
    if (this.jobDescriptionEditor.jobDescriptionForm.valid) {
      this.store.dispatch(new fromJobDescriptionActions.SaveJobDescription());
    }
  }

}
