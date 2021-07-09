import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromComphubPageActions from '../../../../_main/actions/comphub-page.actions';
import * as fromJobsCardActions from '../../../../_main/actions/jobs-card.actions';
import { CountryDataSet, WorkflowContext } from '../../../../_main/models';
import * as fromComphubMainReducer from '../../../../_main/reducers';
import * as fromJobGridActions from '../../../../_main/actions/job-grid.actions';

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
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.countryDataSets$ = this.store.select(fromComphubMainReducer.getCountryDataSets);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.selectedJob$ = this.store.select(fromComphubMainReducer.getSelectedJob);
  }

  handleCountryDataSetChanged(countryCode: string) {
    this.clearSearch.next(true);
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
    this.selectedJobSub = this.selectedJob$.subscribe(sj => this.selectedJob = sj);
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
