import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as fromJobsPageReducer from '../../reducers';
import * as fromJobDescriptionActions from '../../actions';
import {Store} from '@ngrx/store';
import {JobsHelpers} from '../../helpers/jobs.helpers';
import * as cloneDeep from 'lodash.clonedeep';
import {DataViewFilter} from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit, OnChanges {
  @Input() filters: DataViewFilter[];
  currentJobId: number;
  jobDescription$: Observable<string>;
  refinedFilters: DataViewFilter[];
  jobDescriptionUpdated$: Observable<boolean>;
  jobDescriptionManagementEnabled$: Observable<boolean>;
  saving$: Observable<boolean>;
  updatedJobDescription: string = null;
  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.jobDescriptionManagementEnabled$ = store.select(fromJobsPageReducer.getJobDescriptionManagementEnabled);
    this.jobDescription$ = store.select(fromJobsPageReducer.getJobDescription);
    this.jobDescriptionUpdated$ = store.select(fromJobsPageReducer.getJobDescriptionUpdated);
    this.saving$ = store.select(fromJobsPageReducer.getSavingState);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.refinedFilters = cloneDeep(changes['filters'].currentValue);
      const companyJobIdFilter = this.refinedFilters.find(i => i.SourceName === 'CompanyJob_ID').Values[0];
      this.currentJobId = (<any>companyJobIdFilter) as number;
      this.store.dispatch(new fromJobDescriptionActions.LoadJobDescription(this.currentJobId));
    }
  }

  changeJobDescription(event) {
    this.updatedJobDescription = event.currentTarget.value;
    this.store.dispatch(new fromJobDescriptionActions.ChangeJobDescription(this.updatedJobDescription));
  }
  saveJobDescription() {
    this.store.dispatch(new fromJobDescriptionActions.SaveJobDescription( {jobId: this.currentJobId, jobDescription: this.updatedJobDescription}));
  }

}
