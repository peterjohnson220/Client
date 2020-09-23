import { Component, OnDestroy, ViewChildren, QueryList, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription, merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import * as autoScroll from 'dom-autoscroller';

import { JobMatchCut } from 'libs/models/payfactors-api';

import { JobToPriceComponent } from '../../components';
import * as fromMultiMatchReducer from '../../reducers';
import * as fromJobsToPriceActions from '../../actions/jobs-to-price.actions';

import {DataCutDetails, PricingMatchDataSearchContext} from '../../../survey-search/models';
import { JobToPrice } from '../../models';
import { LEGACY_PROJECTS, MODIFY_PRICINGS } from '../../constants';

import * as fromSurveySearchReducer from '../../../survey-search/reducers';
import * as fromSurveySearchResultsActions from '../../../survey-search/actions/survey-search-results.actions';


@Component({
  selector: 'pf-jobs-to-price-container',
  templateUrl: './jobs-to-price-container.component.html',
  styleUrls: ['./jobs-to-price-container.component.scss']
})
export class JobsToPriceContainerComponent implements OnDestroy {
  @ViewChildren(JobToPriceComponent) jobsToPriceComponents !: QueryList<JobToPriceComponent>;
  @Input() featureImplementation = LEGACY_PROJECTS;

  // Observables
  jobsToPrice$: Observable<JobToPrice[]>;
  selectedCuts$: Observable<DataCutDetails[]>;
  pricingMatchDataSearchContext$: Observable<PricingMatchDataSearchContext>;
  loadingJobs$: Observable<boolean>;
  error$: Observable<boolean>;
  isDragging$: Observable<boolean>;
  dragStart$: Observable<boolean>;
  dragEnd$: Observable<boolean>;

  // Subscriptions
  dragSubs: Subscription;
  selectedDataCutsSubscription: Subscription;

  selectedCuts: DataCutDetails[];
  scroll: any;
  isDragging: boolean;

  spinnerType = 'GIF';

  constructor(
    private store: Store<fromMultiMatchReducer.State>,
    private dragulaService: DragulaService
  ) {
    this.selectedCuts = [];
    this.dragSubs = new Subscription();
    this.selectedDataCutsSubscription = new Subscription();
    this.selectedCuts$ = this.store.select(fromSurveySearchReducer.getSelectedDataCuts);
    this.jobsToPrice$ = this.store.select(fromMultiMatchReducer.getJobsToPrice);
    this.loadingJobs$ = this.store.select(fromMultiMatchReducer.getLoadingJobsToPrice);
    this.error$ = this.store.select(fromMultiMatchReducer.getLoadingJobsToPriceError);
    this.pricingMatchDataSearchContext$ = this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext);

    this.selectedDataCutsSubscription = this.selectedCuts$.subscribe(dataCuts => {
     this.selectedCuts = dataCuts;
      // TODO: come up with a better solution to initialize the auto scroll.
      // These elements are not on the DOM until the multi match modal opens in Client implementations
     if (!this.scroll && dataCuts.length) {
       this.initializeScroll();
     }
    });
    this.configureDragEvents();
  }

  trackByJobId(index, item: JobToPrice) {
    return item.Id;
  }

  handleLoadDataCuts(job: JobToPrice): void {
    if (!job.TotalDataCuts || this.dataCutsLoaded(job)) {
      return;
    }

    // TODO: Set feature implementation in the state, refactor this to the effect and let the effect make the right API calls
    // Will handle as part of ENG-319
    switch (this.featureImplementation) {
      case MODIFY_PRICINGS:
        let rate;
        this.pricingMatchDataSearchContext$.subscribe(x => {
          rate = x.Rate;
        }).unsubscribe();

        this.store.dispatch(new fromJobsToPriceActions.GetPricingMatches(job.Id, rate));
        break;
      default:
        this.store.dispatch(new fromJobsToPriceActions.GetMatchJobCuts(job));
        break;
    }
  }

  handleCutDeleted(deletedObj: { jobCut: JobMatchCut, job: JobToPrice }): void {
    this.store.dispatch(new fromJobsToPriceActions.RemoveJobCut({JobId: deletedObj.job.Id, DataCut: deletedObj.jobCut}));
  }

  private initializeScroll() {
    const that = this;
    this.scroll = autoScroll(
      document.querySelector('.jobs-to-price-container'),
      {
        margin: 30,
        maxSpeed: 25,
        scrollWhenOutside: true,
        autoScroll: function() {
          return this.down && that.isDragging;
        }
      });
  }

  private dataCutsLoaded(job: JobToPrice): boolean {
    return job.JobMatchCuts && job.JobMatchCuts.length > 0;
  }

  private configureDragEvents(): void {
    this.dragStart$ = this.dragulaService.drag('data-cuts-bag').pipe(mapTo(true));
    this.dragEnd$ = this.dragulaService.dragend('data-cuts-bag').pipe(mapTo(false));
    this.isDragging$ = merge(this.dragStart$, this.dragEnd$).pipe(startWith(false));
    this.dragSubs.add(this.dragulaService.over('data-cuts-bag')
      .subscribe(({ el, container }) => {
        if (container.classList.contains('dropzone')) {
          container.parentElement.classList.add('highlight');
        }
      })
    );
    this.dragSubs.add(this.dragulaService.out('data-cuts-bag')
      .subscribe(({ el, container }) => {
        if (container.classList.contains('dropzone')) {
          container.parentElement.classList.remove('highlight');
        }
      })
    );
    this.dragSubs.add(this.dragulaService.drop('data-cuts-bag')
        .subscribe(({ el, target }) => {
          target.parentElement.classList.remove('highlight');
          const jobIdAttribute = target.attributes['data-job-id'];
          const companyJobIdAttribute = target.attributes['data-company-job-id'];
          const paymarketIdAttribute = target.attributes['data-paymarket-id'];
          if (jobIdAttribute && jobIdAttribute.value) {
            const jobId = Number(jobIdAttribute.value);
            const companyJobId = Number(companyJobIdAttribute?.value);
            const paymarketId = Number(paymarketIdAttribute?.value);
            this.store.dispatch(new fromJobsToPriceActions.AddNewDataCuts(
              {JobId: jobId, CompanyJobId: companyJobId, PaymarketId: paymarketId, DataCuts: this.selectedCuts}));
            this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
            this.showDataCutsOnJob(jobId);
          }
        el.innerHTML = '';
        })
    );

    this.isDragging$.subscribe(dragStatus => {
      this.isDragging = dragStatus;
    });
  }

  ngOnDestroy(): void {
    this.dragSubs.unsubscribe();
    this.selectedDataCutsSubscription.unsubscribe();
  }

  showDataCutsOnJob(jobId: number) {
    const jobComponents = this.jobsToPriceComponents.toArray();
    const matchingComponent = jobComponents.find(c => c.job.Id === jobId);
    if (matchingComponent) {
      matchingComponent.showDataCutsDisplay();
    }
  }
}

