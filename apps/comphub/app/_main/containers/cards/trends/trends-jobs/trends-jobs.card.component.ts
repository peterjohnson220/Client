import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AutoCompleteComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import * as fromLibsPeerRelationalExchangeJobSearchReducer from 'libs/features/peer/relational-exchange-job-search/reducers';

import { ComphubPages } from '../../../../../_shared/data';
import * as fromComphubSharedReducers from '../../../../../_shared/reducers';
import * as fromJobsCardActions from '../../../../../_shared/actions/jobs-card.actions';

import * as fromComphubMainReducer from '../../../../reducers/';
import * as fromTrendsJobsCardActions from '../../../../actions/trends-jobs.actions';

@Component({
  selector: 'pf-trends-jobs-card',
  templateUrl: './trends-jobs.card.component.html',
  styleUrls: ['./trends-jobs.card.component.scss']
})

// NOTE: There's a lot of duplicate code between this and the Quick Price Jobs card, but this page is temporary
// and will be replaced by smart job code picker [PJ]
export class TrendsJobsCardComponent implements OnInit, OnDestroy {
  @ViewChild('exchangeJobSearch') exchangeJobSearch: AutoCompleteComponent;
  exchangeJobSearchOptions$: Observable<ExchangeJobSearchOption[]>;
  activeExchangeId$: Observable<number>;
  selectedPageId$: Observable<string>;

  selectedExchangeJobResults$: Observable<any[]>;

  potentialOptions: string[];
  selectedJob: string;
  popupSettings: PopupSettings;
  exchangeJobSearchOptions: ExchangeJobSearchOption[];

  exchangeJobSearchOptionsSub: Subscription;
  selectedExchangeJobResultsSub: Subscription;
  selectedPageIdSub: Subscription;

  comphubPages = ComphubPages;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.potentialOptions = [];
    this.popupSettings = {
      appendTo: 'component'
    };
    this.exchangeJobSearchOptions$ = this.store.select(fromComphubSharedReducers.getExchangeJobSearchOptions);
    this.activeExchangeId$ = this.store.select(fromComphubSharedReducers.getActiveExchangeId);
    this.selectedExchangeJobResults$ = this.store.select(fromLibsPeerRelationalExchangeJobSearchReducer.getSelectedExchangeJobs);
    this.selectedPageId$ = this.store.select(fromComphubSharedReducers.getSelectedPageId);
  }

  ngOnInit(): void {
    this.exchangeJobSearchOptionsSub = this.exchangeJobSearchOptions$.subscribe(o => {
      this.potentialOptions = o.map(x => x.JobTitle);
      this.exchangeJobSearchOptions = o;
    });

    this.selectedExchangeJobResultsSub = this.selectedExchangeJobResults$.subscribe(ejs => {
      if (!!ejs?.length) {
        this.store.dispatch(new fromTrendsJobsCardActions.SetSelectedJobs(ejs.map(ej => <ExchangeJobSearchOption>{
          ExchangeJobId: ej.ExchangeJobId, JobTitle: ej.JobTitle
        })));
      } else {
        this.store.dispatch(new fromTrendsJobsCardActions.ClearSelectedJobs());
      }
    });

    this.selectedPageIdSub = this.selectedPageId$.subscribe((pageId) => {
      // TODO: [JP] We should do this better/differently. Also, why are there two SetSearchFeatureId actions?
      if (pageId === ComphubPages.TrendsJobs) {
        this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.PeerExchangeJob));
      } else {
        this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.ExchangeExplorer));
      }
    });
  }

  handleSearchClosed(): void {
    // after the search is closed, make sure we trigger the job change if there is a mismatch
    setTimeout(() => {
      const searchField =  this.exchangeJobSearch;
      if (searchField?.value && searchField.value !== this.selectedJob) {
        this.handleJobSearchValueChanged(searchField.value);
      }
    }, 0);
  }

  handleJobSearchValueChanged(selectedTerm: string): void {
    if (this.potentialOptions.some(x => x.toLowerCase() === selectedTerm.toLowerCase())) {

      const selectedExchangeJob = this.exchangeJobSearchOptions.filter(x => x.JobTitle.toLowerCase() === selectedTerm.toLowerCase())[0];

      this.store.dispatch(new fromTrendsJobsCardActions.SetSelectedJobs([ selectedExchangeJob ]));

    } else if (this.selectedJob) {
      this.store.dispatch(new fromTrendsJobsCardActions.ClearSelectedJobs());
    }
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    if (searchTerm?.length > 0) {
       this.store.dispatch(new fromJobsCardActions.GetExchangeJobSearchOptions(searchTerm));
    } else if (this.selectedJob) {
       this.store.dispatch(new fromTrendsJobsCardActions.ClearSelectedJobs());
    }
  }

  ngOnDestroy(): void {
    this.exchangeJobSearchOptionsSub.unsubscribe();
  }
}
