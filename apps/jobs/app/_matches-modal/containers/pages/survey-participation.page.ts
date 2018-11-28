import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';

import { Match, CompanyJob } from 'libs/models/company';

import * as fromCompanyJobReducer from '../../../_matches-modal/reducers';
import * as fromMatchesReducer from '../../../_matches-modal/reducers';
import * as fromCompanyJobActions from '../../../_matches-modal/actions/company-job.actions';
import * as fromMatchesActions from '../../../_matches-modal/actions/matches.actions';

@Component({
  selector: 'pf-survey-participation-page',
  templateUrl: './survey-participation.page.html',
  styleUrls: ['./survey-participation.page.scss']
})

export class SurveyParticipationPageComponent implements OnInit, OnDestroy {

  matches$: Observable<Match[]>;
  companyJob$: Observable<CompanyJob>;
  isDragging$: Observable<boolean>;
  dragStart$: Observable<boolean>;
  dragEnd$: Observable<boolean>;

  scroll: any;
  isDragging: boolean;
  dragMatches: Subscription;

  companyJob: CompanyJob;
  matches: Match[];
  matchesIncludedInParticipation: Match[];
  matchesExcludedFromParticipation: Match[];

  constructor(private companyJobStore: Store<fromCompanyJobReducer.State>, private matchesStore: Store<fromMatchesReducer.State>,
              private route: ActivatedRoute, private dragulaService: DragulaService) {

    this.matches$ = this.matchesStore.select(fromMatchesReducer.getMatches);
    this.companyJob$ = this.companyJobStore.select(fromCompanyJobReducer.getCompanyJob);

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
    const companyJobId = parseInt(this.route.snapshot.queryParams.companyJobId, 10);

    this.companyJobStore.dispatch(new fromCompanyJobActions.Loading(companyJobId));
    this.companyJob$.subscribe(companyJob => {
      if (companyJob) {
        this.companyJob = companyJob;
      }
    });

    this.matchesStore.dispatch(new fromMatchesActions.Loading(companyJobId));
    this.matches$.subscribe(matchesArray => {
      if (matchesArray) {
        this.matches = matchesArray;
        this.matchesIncludedInParticipation = matchesArray.filter(m => m.ExcludeFromParticipation === false);
        this.matchesExcludedFromParticipation = matchesArray.filter(m => m.ExcludeFromParticipation === true);
      }
    });
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

          this.companyJobStore.dispatch(new fromMatchesActions.UpdateExcludeFromParticipation({
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
  }
}
