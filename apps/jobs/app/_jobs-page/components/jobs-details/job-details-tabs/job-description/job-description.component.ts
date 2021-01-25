import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';

import { Store, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { JobDescriptionSummaryEditorComponent } from 'libs/forms';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { JobDescriptionSummary, AsyncStateObj } from 'libs/models';
import * as fromJobManagementActions from 'libs/features/jobs/job-management/actions';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';

import * as fromJobsPageReducer from '../../../../reducers';
import * as fromJobDescriptionActions from '../../../../actions';

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
  updatedJobDescription$: Observable<string>;

  loadJobDescriptionSuccessSubscription: Subscription;

  jobDescriptionSummary: JobDescriptionSummary;

  jobDescriptionSummaryAsyncObjSubscription: Subscription;
  jobDescriptionSummaryAsyncObj: AsyncStateObj<JobDescriptionSummary>;
  pfThemeType = PfThemeType;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    this.loadJobDescriptionSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobDescriptionActions.LOAD_JOB_DESCRIPTION_SUCCESS))
      .subscribe((action: fromJobDescriptionActions.LoadJobDescriptionSuccess) => {
        this.jobDescriptionSummary = action.payload;
      });

    this.jobDescriptionSummaryAsyncObjSubscription = this.store.select(fromJobsPageReducer.getJobDescriptionSummary).subscribe((o) => {
      this.jobDescriptionSummaryAsyncObj = o;
    });

    this.loading$ = this.store.select(fromJobsPageReducer.getLoading);
    this.updatedJobDescription$ = this.store.select(fromJobsPageReducer.getUpdatedJobDescription);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']?.currentValue) {
      this.jobDescriptionSummary = null;
      const companyJobIdFilter: PfDataGridFilter = this.filters.find(i => i.SourceName === 'CompanyJob_ID');
      if (companyJobIdFilter?.Values?.length > 0) {
        this.store.dispatch(new fromJobDescriptionActions.LoadJobDescription((<any>companyJobIdFilter.Values[0]) as number));
      }
    }
  }

  jobDescriptionChanged(newJobDescription: string) {
    this.store.dispatch(new fromJobDescriptionActions.ChangeJobDescription(newJobDescription));
  }

  ngOnDestroy() {
    this.store.dispatch(new fromJobManagementActions.ResetState());
    this.loadJobDescriptionSuccessSubscription.unsubscribe();
    this.jobDescriptionSummaryAsyncObjSubscription.unsubscribe();
  }

  saveJobDescription() {
    if (this.jobDescriptionEditor.jobDescriptionForm.valid) {
      this.store.dispatch(new fromJobDescriptionActions.SaveJobDescription());
    }
  }

}
