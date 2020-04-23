import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import * as autoScroll from 'dom-autoscroller';

import { Match, CompanyJob } from 'libs/models/company';

import * as fromCompanyJobActions from '../../actions/company-job.actions';
import * as fromMatchesActions from '../../actions/matches.actions';
import * as fromMatchesModalAreaReducer from '../../reducers';

@Component({
  selector: 'pf-survey-participation-page',
  templateUrl: './survey-participation.page.html',
  styleUrls: ['./survey-participation.page.scss']
})

export class SurveyParticipationPageComponent implements OnInit, OnDestroy {
  @Input() jobId: number;
  companyJobLoading$: Observable<boolean>;
  matchesLoading$: Observable<boolean>;
  matches$: Observable<Match[]>;
  companyJob$: Observable<CompanyJob>;
  isDragging$: Observable<boolean>;
  dragStart$: Observable<boolean>;
  dragEnd$: Observable<boolean>;

  dragMatches: Subscription;

  scroll: any;
  isDragging: boolean;
  companyJob: CompanyJob;
  matches: Match[];
  matchesIncludedInParticipation: Match[];
  matchesExcludedFromParticipation: Match[];

  constructor(private matchesModalAreaStore: Store<fromMatchesModalAreaReducer.State>,
              private route: ActivatedRoute,
              private dragulaService: DragulaService) {

    this.companyJobLoading$ = this.matchesModalAreaStore.select(fromMatchesModalAreaReducer.getCompanyJobLoading);
    this.matchesLoading$ = this.matchesModalAreaStore.select(fromMatchesModalAreaReducer.getMatchesLoading);
    this.matches$ = this.matchesModalAreaStore.select(fromMatchesModalAreaReducer.getMatches);
    this.companyJob$ = this.matchesModalAreaStore.select(fromMatchesModalAreaReducer.getCompanyJob);

    this.dragMatches = new Subscription();
    this.configureDragEvents();

    dragulaService.createGroup('matches-bag', {
      revertOnSpill: true,
      moves: function (el) {
        return el.classList.contains('draggable');
      },
      accepts: function (el, target, source) {
        return source.id !== target.id;
      }
    });
  }

  ngOnInit() {
    let companyJobId = this.jobId;
    /// remove after old job page deprecated
    if (this.route.snapshot.queryParams.companyJobId) {
      companyJobId = parseInt(this.route.snapshot.queryParams.companyJobId, 10);
    }
    this.matchesModalAreaStore.dispatch(new fromCompanyJobActions.Loading(companyJobId));
    this.companyJob$.subscribe(companyJob => {
      if (companyJob) {
        this.companyJob = companyJob;
      }
    });

    this.matchesModalAreaStore.dispatch(new fromMatchesActions.Loading(companyJobId));
    this.matches$.subscribe(matchesArray => {
      if (matchesArray) {
        this.matches = matchesArray;
        this.matchesIncludedInParticipation = matchesArray.filter(m => m.ExcludeFromParticipation === false
          && (m.Type.toUpperCase() !== 'PEER' && m.Type.toUpperCase() !== 'SLOTTED'));
        this.matchesExcludedFromParticipation = matchesArray.filter(m => m.ExcludeFromParticipation === true
          || (m.Type.toUpperCase() === 'PEER' || m.Type.toUpperCase() === 'SLOTTED'));
      }
    });

    /// remove after old job page deprecated
    const that = this;
    if (document.querySelector('.matches-modal-container')) {
      this.scroll = autoScroll(
        document.querySelector('.matches-modal-container'),
        {
          margin: 30,
          maxSpeed: 25,
          scrollWhenOutside: true,
          autoScroll: function () {
            return this.down && that.isDragging;
          }
        });
    }
  }

  private configureDragEvents(): void {
    this.dragStart$ = this.dragulaService.drag('matches-bag').pipe(mapTo(true));
    this.dragEnd$ = this.dragulaService.dragend('matches-bag').pipe(mapTo(false));
    this.isDragging$ = merge(this.dragStart$, this.dragEnd$).pipe(startWith(false));

    this.dragMatches.add(this.dragulaService.over('matches-bag')
      .subscribe(({ el, container, source }) => {
        if (source.id !== container.id && container.classList.contains('dropzone')) {
          container.classList.add('highlight');
        }
      })
    );

    this.dragMatches.add(this.dragulaService.out('matches-bag')
      .subscribe(({ el, container }) => {
        if (container.classList.contains('dropzone')) {
          container.classList.remove('highlight');
        }
      })
    );

    this.dragMatches.add(this.dragulaService.drop('matches-bag')
      .subscribe(({ el, target }) => {
        target.classList.remove('highlight');

        const dataMatchJobIdAttribute = el.attributes['data-match-job-id'];

        if (dataMatchJobIdAttribute && dataMatchJobIdAttribute.value) {
          const dataMatchJobId = Number(dataMatchJobIdAttribute.value);
          const excludeFromParticipation = target.id === 'excludeFromParticipation' ? true : false;

          this.matchesModalAreaStore.dispatch(new fromMatchesActions.UpdateExcludeFromParticipation({
            CompanyJobPricingMatchIds: this.matches.find(m => m.JobId === dataMatchJobId).CompanyJobPricingMatchIds,
            ExcludeFromParticipation: excludeFromParticipation
          }));
        }
      })
    );

    this.isDragging$.subscribe(dragStatus => {
      this.isDragging = dragStatus;
    });
  }

  ngOnDestroy(): void {
    this.dragMatches.unsubscribe();
    this.dragulaService.destroy('matches-bag');
  }
}
