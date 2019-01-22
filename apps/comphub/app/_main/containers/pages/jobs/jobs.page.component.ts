import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AutoCompleteComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromJobsPageActions from '../../../actions/jobs-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { TrendingJobGroup } from '../../../models/trending-job.model';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.component.html',
  styleUrls: ['./jobs.page.component.scss']
})
export class JobsPageComponent implements OnInit, AfterViewInit {
  @ViewChild('list') list: AutoCompleteComponent;

  popupSettings: PopupSettings;
  // observables
  trendingJobGroups$: Observable<TrendingJobGroup[]>;
  jobSearchOptions$: Observable<string[]>;
  loadingJobSearchOptions$: Observable<boolean>;

  // subscriptions
  filterChangeSubscription: Subscription;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.trendingJobGroups$ = this.store.select(fromComphubMainReducer.getTrendingJobGroups);
    this.jobSearchOptions$ = this.store.select(fromComphubMainReducer.getJobSearchOptions);
    this.loadingJobSearchOptions$ = this.store.select(fromComphubMainReducer.getLoadingJobSearchOptions);
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.GetTrendingJobs());
  }

  ngAfterViewInit(): void {
    this.filterChangeSubscription = this.list.filterChange.asObservable().pipe(
      debounceTime(50),
      distinctUntilChanged())
      .subscribe(searchTerm => {
        if (searchTerm) {
          this.store.dispatch(new fromJobsPageActions.GetJobSearchOptions(searchTerm));
        }
      });
  }
}
