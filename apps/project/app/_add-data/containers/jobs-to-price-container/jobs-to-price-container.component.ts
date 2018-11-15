import {  Component, OnDestroy, OnInit, ViewChildren, QueryList } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs/index';
import { merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

import { DragulaService } from 'ng2-dragula';
import * as autoScroll from 'dom-autoscroller';

import { DataCut, JobMatchCut } from 'libs/models/survey-search';

import * as fromAddDataReducer from '../../reducers';
import * as fromJobsToPriceActions from '../../actions/jobs-to-price.actions';
import * as fromSurveyResultsActions from '../../actions/search-results.actions';
import { JobToPrice, ProjectSearchContext } from '../../models';
import { JobToPriceComponent } from '../../components/job-to-price/job-to-price.component';



@Component({
  selector: 'pf-jobs-to-price-container',
  templateUrl: './jobs-to-price-container.component.html',
  styleUrls: ['./jobs-to-price-container.component.scss']
})
export class JobsToPriceContainerComponent implements OnInit, OnDestroy {
  @ViewChildren(JobToPriceComponent) jobsToPriceComponents !: QueryList<JobToPriceComponent>;
  // Observables
  jobsToPrice$: Observable<JobToPrice[]>;
  selectedCuts$: Observable<DataCut[]>;
  searchContext$: Observable<ProjectSearchContext>;
  loadingJobs$: Observable<boolean>;
  error$: Observable<boolean>;
  isDragging$: Observable<boolean>;
  dragStart$: Observable<boolean>;
  dragEnd$: Observable<boolean>;

  // Subscriptions
  dragSubs: Subscription;
  selectedDataCutsSubscription: Subscription;

  selectedCuts: DataCut[];
  scroll: any;
  isDragging: boolean;

  spinnerType = 'GIF';

  constructor(
    private store: Store<fromAddDataReducer.State>,
    private dragulaService: DragulaService
  ) {
    this.selectedCuts = [];
    this.dragSubs = new Subscription();
    this.selectedDataCutsSubscription = new Subscription();
    this.selectedCuts$ = this.store.select(fromAddDataReducer.getSelectedDataCuts);
    this.jobsToPrice$ = this.store.select(fromAddDataReducer.getJobsToPrice);
    this.loadingJobs$ = this.store.select(fromAddDataReducer.getLoadingJobsToPrice);
    this.error$ = this.store.select(fromAddDataReducer.getLoadingJobsToPriceError);
    this.searchContext$ = this.store.select(fromAddDataReducer.getProjectSearchContext);
    this.selectedDataCutsSubscription = this.selectedCuts$.subscribe(dataCuts => {
     this.selectedCuts = dataCuts;
    });
    this.configureDragEvents();
  }

  ngOnInit() {
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

  trackByJobId(index, item: JobToPrice) {
    return item.Id;
  }

  handleLoadDataCuts(job: JobToPrice): void {
    if (!job.TotalDataCuts || this.dataCutsLoaded(job)) {
      return;
    }
    this.store.dispatch(new fromJobsToPriceActions.GetMatchJobCuts(job));
  }

  handleCutDeleted(deletedObj: { jobCut: JobMatchCut, job: JobToPrice }): void {
    this.store.dispatch(new fromJobsToPriceActions.RemoveJobCut({JobId: deletedObj.job.Id, DataCut: deletedObj.jobCut}));
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
          if (jobIdAttribute && jobIdAttribute.value) {
            const jobId = Number(jobIdAttribute.value);
            this.store.dispatch(new fromJobsToPriceActions.AddNewDataCuts({JobId: jobId, DataCuts: this.selectedCuts}));
            this.store.dispatch(new fromSurveyResultsActions.ClearDataCutSelections());
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

