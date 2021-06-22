import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AutoCompleteComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';

import { UserContext } from 'libs/models/security';
import * as fromRootReducer from 'libs/state/state';

import * as fromComphubPageActions from '../../../../_main/actions/comphub-page.actions';
import * as fromJobsCardActions from '../../../../_main/actions/jobs-card.actions';
import { CountryDataSet, WorkflowContext } from '../../../../_main/models';
import * as fromComphubMainReducer from '../../../../_main/reducers';

@Component({
  selector: 'pf-crowd-sourced-jobs-card',
  templateUrl: './crowd-sourced-jobs.card.component.html',
  styleUrls: ['./crowd-sourced-jobs.card.component.scss']
})
export class CrowdSourcedJobsCardComponent implements OnInit, OnDestroy {
  @ViewChild('jobSearch') jobSearch: AutoCompleteComponent;

  countryDataSets$: Observable<CountryDataSet[]>;
  workflowContext$: Observable<WorkflowContext>;
  jobSearchOptions$: Observable<string[]>;
  jobPricingBlocked$: Observable<boolean>;
  selectedJob$: Observable<string>;
  loadingJobSearchOptions$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  jobSearchOptionsSub: Subscription;
  workflowContextSub: Subscription;
  selectedJobSub: Subscription;

  potentialOptions: string[];
  workflowContext: WorkflowContext;
  selectedJob: string;
  popupSettings: PopupSettings;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.countryDataSets$ = this.store.select(fromComphubMainReducer.getCountryDataSets);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.loadingJobSearchOptions$ = this.store.select(fromComphubMainReducer.getLoadingJobSearchOptions);
    this.jobSearchOptions$ = this.store.select(fromComphubMainReducer.getJobSearchOptions);
    this.jobPricingBlocked$ = this.store.select(fromComphubMainReducer.getJobPricingBlocked);
    this.selectedJob$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  handleCountryDataSetChanged(countryCode: string) {
    this.jobSearch.reset();
    this.store.dispatch(new fromComphubPageActions.UpdateActiveCountryDataSet(countryCode));
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    if (searchTerm?.length > 0) {
      this.store.dispatch(new fromJobsCardActions.GetJobSearchOptions(searchTerm));
    } else if (this.selectedJob) {
      this.store.dispatch(new fromJobsCardActions.ClearSelectedJob());
    }
  }

  handleJobSearchValueChanged(selectedTerm: string): void {
    if (this.potentialOptions.some(x => x.toLowerCase() === selectedTerm.toLowerCase())) {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob({jobTitle: selectedTerm }));
    } else if (this.selectedJob) {
      this.store.dispatch(new fromJobsCardActions.ClearSelectedJob());
    }
  }

  handleSearchClosed(): void {
    // after the search is closed, make sure we trigger the job change if there is a mismatch
    setTimeout(() => {
      const searchField = this.jobSearch;
      if (searchField?.value && searchField.value !== this.selectedJob) {
        this.handleJobSearchValueChanged(searchField.value);
      }
    }, 0);
  }


  ngOnInit(): void {
    this.jobSearchOptionsSub = this.jobSearchOptions$.subscribe(o => this.potentialOptions = o);
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
    this.jobSearchOptionsSub.unsubscribe();
  }

}
