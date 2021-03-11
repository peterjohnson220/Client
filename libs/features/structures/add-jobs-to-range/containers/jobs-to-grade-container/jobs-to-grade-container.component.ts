import { Component, OnDestroy, ViewChildren, QueryList, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription, merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import * as autoScroll from 'dom-autoscroller';

import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';
import * as fromAddJobsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';

import { JobToGradeComponent } from '../../components';
import * as fromJobsToGradeReducer from '../../reducers';
import * as fromJobsToGradeActions from '../../actions';
import { Grade, GradeRangeGroupDetails } from '../../models';

@Component({
  selector: 'pf-jobs-to-grade-container',
  templateUrl: './jobs-to-grade-container.component.html',
  styleUrls: ['./jobs-to-grade-container.component.scss']
})
export class JobsToGradeContainerComponent implements OnDestroy, OnInit {
  @ViewChildren(JobToGradeComponent) jobsToGradeComponents !: QueryList<JobToGradeComponent>;
  @Input() gradeRangeGroupDetails: GradeRangeGroupDetails;
  @Input() rate: string;
  @Input() controlPoint: string;
  // Observables
  grades$: Observable<Grade[]>;
  selectedJobs$: Observable<string[]>;
  loadingGrades$: Observable<boolean>;
  error$: Observable<boolean>;
  isDragging$: Observable<boolean>;
  dragStart$: Observable<boolean>;
  dragEnd$: Observable<boolean>;

  // Subscriptions
  dragSubs: Subscription;
  selectedJobsSubscription: Subscription;

  selectedJobs: number[];
  scroll: any;
  isDragging: boolean;

  spinnerType = 'GIF';

  constructor(
    private store: Store<fromJobsToGradeReducer.State>,
    private dragulaService: DragulaService
  ) {
    this.selectedJobs = [];
    this.dragSubs = new Subscription();
    this.selectedJobsSubscription = new Subscription();
    this.selectedJobs$ = this.store.select(fromAddJobsReducer.getSelectedJobIds);
    this.grades$ = this.store.select(fromJobsToGradeReducer.getGrades);
    this.loadingGrades$ = this.store.select(fromJobsToGradeReducer.getLoadingGrades);
    this.error$ = this.store.select(fromJobsToGradeReducer.getLoadingGradesError);

    this.selectedJobsSubscription = this.selectedJobs$.subscribe(jobs => {
     this.selectedJobs = jobs.map(Number);
      // TODO: come up with a better solution to initialize the auto scroll.
      // These elements are not on the DOM until the multi match modal opens in Client implementations
     if (!this.scroll && jobs.length) {
       this.initializeScroll();
     }
    });
    this.configureDragEvents();
  }

  trackByGradeId(index, item: Grade) {
    return item.CompanyStructuresGradesId;
  }

  handleLoadJobs(grade: Grade): void {
    this.store.dispatch(new fromJobsToGradeActions.GetGradeJobs(
      { CompanyStructuresGradesId: grade.CompanyStructuresGradesId, ControlPoint: this.controlPoint,
        CompanyStructuresRangeGroupId: grade.CompanyStructuresRangeGroupId, JobIds: [] }));
  }

  private initializeScroll() {
    const that = this;
    this.scroll = autoScroll(
      document.querySelector('.jobs-to-grade-container'),
      {
        margin: 30,
        maxSpeed: 25,
        scrollWhenOutside: true,
        autoScroll: function() {
          return this.down && that.isDragging;
        }
      });
  }

  private configureDragEvents(): void {
    this.dragStart$ = this.dragulaService.drag('jobs-grade-bag').pipe(mapTo(true));
    this.dragEnd$ = this.dragulaService.dragend('jobs-grade-bag').pipe(mapTo(false));
    this.isDragging$ = merge(this.dragStart$, this.dragEnd$).pipe(startWith(false));
    this.dragSubs.add(this.dragulaService.over('jobs-grade-bag')
      .subscribe(({ el, container }) => {
        if (container.classList.contains('dropzone')) {
          container.classList.add('highlight');
        }
      })
    );
    this.dragSubs.add(this.dragulaService.out('jobs-grade-bag')
      .subscribe(({ el, container }) => {
        if (container.classList.contains('dropzone')) {
          container.classList.remove('highlight');
        }
      })
    );
    this.dragSubs.add(this.dragulaService.drop('jobs-grade-bag')
        .subscribe(({ el, target }) => {
          target.classList.remove('highlight');
          const gradeIdAttribute = target.attributes['data-grade-id'];
          if (gradeIdAttribute && gradeIdAttribute.value) {
            const gradeId = Number(gradeIdAttribute.value);
            this.store.dispatch(new fromJobsToGradeActions.AddJobsToGrade(
              { CompanyStructuresRangeGroupId: this.gradeRangeGroupDetails.RangeGroupId,
                CompanyStructuresGradesId: gradeId, JobIds: this.selectedJobs, ControlPoint: this.controlPoint }));
            this.store.dispatch(new fromAddJobsActions.ClearSelectedJobs());
            this.showJobsOnGrade(gradeId);
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
    this.selectedJobsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsToGradeActions.GetGrades(this.gradeRangeGroupDetails));
  }

  showJobsOnGrade(gradeId: number) {
    const gradeComponents = this.jobsToGradeComponents.toArray();
    const matchingComponent = gradeComponents.find(c => c.grade.CompanyStructuresGradesId === gradeId);
    if (matchingComponent) {
      matchingComponent.showJobsDisplay();
    }
  }
}

