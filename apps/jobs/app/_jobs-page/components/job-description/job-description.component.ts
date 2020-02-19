import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import * as fromJobsPageReducer from '../../reducers';
import * as fromJobDescriptionActions from '../../actions';

@Component({
  selector: 'pf-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filters: PfDataGridFilter[];
  currentJobId: number;
  jobDescription$: Observable<string>;
  jobDescriptionUpdated$: Observable<boolean>;
  jobDescriptionManagementEnabled$: Observable<boolean>;
  saving$: Observable<boolean>;
  jobDescriptionLoaded$: Observable<boolean>;
  updatedJobDescription: string = null;
  jobDescriptionId: number;
  jobDescriptionIdSubscription: Subscription;

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.jobDescriptionManagementEnabled$ = store.select(fromJobsPageReducer.getJobDescriptionManagementEnabled);
    this.jobDescription$ = store.select(fromJobsPageReducer.getJobDescription);
    this.jobDescriptionUpdated$ = store.select(fromJobsPageReducer.getJobDescriptionUpdated);
    this.jobDescriptionLoaded$ = store.select(fromJobsPageReducer.getJobDescriptionLoaded);
    this.saving$ = store.select(fromJobsPageReducer.getSavingState);
    this.jobDescriptionIdSubscription = store.select(fromJobsPageReducer.getJobDescriptionId).subscribe(id => {
      this.jobDescriptionId = id;
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      const companyJobIdFilter = changes['filters'].currentValue.find(i => i.SourceName === 'CompanyJob_ID').Value;
      this.currentJobId = (<any>companyJobIdFilter) as number;
      this.store.dispatch(new fromJobDescriptionActions.LoadJobDescription(this.currentJobId));
    }
  }

  ngOnDestroy() {
    this.jobDescriptionIdSubscription.unsubscribe();
  }

  changeJobDescription(event) {
    this.updatedJobDescription = event.currentTarget.value;
    this.store.dispatch(new fromJobDescriptionActions.ChangeJobDescription(this.updatedJobDescription));
  }

  saveJobDescription() {
    this.store.dispatch(new fromJobDescriptionActions.SaveJobDescription({ jobId: this.currentJobId, jobDescription: this.updatedJobDescription }));
  }

  exportJobDescription(docType: string) {
    const htmlDocument: any = document;

    htmlDocument.exportForm.elements['export-uid'].value = Date.now();
    htmlDocument.exportForm.elements['export-type'].value = docType;
    htmlDocument.exportForm.submit();
  }

}
