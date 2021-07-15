import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import * as fromJobsCardActions from '../../../../_shared/actions/jobs-card.actions';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import { CountryDataSet, WorkflowContext } from '../../../../_shared/models';

@Component({
  selector: 'pf-crowd-sourced-jobs-card',
  templateUrl: './crowd-sourced-jobs.card.component.html',
  styleUrls: ['./crowd-sourced-jobs.card.component.scss']
})
export class CrowdSourcedJobsCardComponent implements OnInit, OnDestroy {
  countryDataSets$: Observable<CountryDataSet[]>;
  workflowContext$: Observable<WorkflowContext>;
  selectedJob$: Observable<string>;

  workflowContextSub: Subscription;
  selectedJobSub: Subscription;

  workflowContext: WorkflowContext;
  selectedJob: string;

  clearSearch = new BehaviorSubject<boolean>(false);
  clearSearch$ = this.clearSearch.asObservable();

  constructor(
    private store: Store<fromComphubSharedReducer.State>
  ) {
    this.countryDataSets$ = this.store.select(fromComphubSharedReducer.getCountryDataSets);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.selectedJob$ = this.store.select(fromComphubSharedReducer.getSelectedJob);
  }

  handleCountryDataSetChanged(countryCode: string) {
    this.store.dispatch(new fromComphubPageActions.UpdateActiveCountryDataSet(countryCode));
  }

  handleJobSearchValueChanged(searchTerm: string): void {
    if (searchTerm?.length > 0) {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob({ jobTitle: searchTerm }));
      this.store.dispatch(new fromJobGridActions.SearchCrowdSourcedJobsByTitle(searchTerm));
    } else if (this.selectedJob) {
      this.store.dispatch(new fromJobsCardActions.ClearSelectedJob());
    }
  }

  ngOnInit(): void {
    this.selectedJobSub = this.selectedJob$.subscribe(sj => {
      this.selectedJob = sj;
      this.clearSearch.next(this.selectedJob == null);
    });
    this.workflowContextSub = this.workflowContext$.subscribe(wfc => {
      if (!!wfc) {
        this.workflowContext = wfc;
      }
    });
  }

  ngOnDestroy(): void {
    this.workflowContextSub.unsubscribe();
    this.selectedJobSub.unsubscribe();
  }
}
