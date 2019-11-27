import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Company } from 'libs/models/company/company.model';
import { AsyncStateObj } from 'libs/models';

import * as fromDefaultScopesPageActions from '../../../actions/yoy-default-scopes-page.actions';
import * as fromUtilitiesReducer from '../../../reducers';
import { DataListItem, MatchResult, SurveyScope } from '../../../models';

@Component({
  selector: 'pf-admin-utilities-yoy-default-scopes',
  templateUrl: './yoy-default-scopes.page.html',
  styleUrls: ['./yoy-default-scopes.page.scss']
})
export class YoyDefaultScopesPageComponent implements OnInit {
  company$: Observable<Company>;
  defaultScopeSurveys$: Observable<DataListItem[]>;
  defaultScopeSurveysLoading$: Observable<boolean>;
  defaultScopeSurveysLoadingError$: Observable<boolean>;
  matchResultsAsync$: Observable<AsyncStateObj<MatchResult[]>>;
  selectedMatchResult$: Observable<MatchResult>;
  filteredMatchResults$: Observable<MatchResult[]>;
  surveyScopesAsync$: Observable<AsyncStateObj<SurveyScope[]>>;
  selectedScope$: Observable<SurveyScope>;

  constructor(
    private store: Store<fromUtilitiesReducer.State>,
    private route: ActivatedRoute
  ) {
    this.company$ = this.store.pipe(select(fromUtilitiesReducer.getCompany));
    this.defaultScopeSurveys$ = this.store.pipe(select(fromUtilitiesReducer.getDefaultScopeSurveys));
    this.defaultScopeSurveysLoading$ = this.store.pipe(select(fromUtilitiesReducer.getLoadingDefaultScopeSurveys));
    this.defaultScopeSurveysLoadingError$ = this.store.pipe(select(fromUtilitiesReducer.getLoadingDefaultScopeSurveysError));
    this.matchResultsAsync$ = this.store.pipe(select(fromUtilitiesReducer.getMatchResultsAsync));
    this.selectedMatchResult$ = this.store.pipe(select(fromUtilitiesReducer.getSelectedMatchResult));
    this.filteredMatchResults$ = this.store.pipe(select(fromUtilitiesReducer.getFilteredMatchResults));
    this.surveyScopesAsync$ = this.store.pipe(select(fromUtilitiesReducer.getSurveyScopesAsync));
    this.selectedScope$ = this.store.pipe(select(fromUtilitiesReducer.getSelectedScope));
  }

  ngOnInit(): void {
    const companyIdPayload = { companyId: this.route.snapshot.params.id };
    this.store.dispatch(new fromDefaultScopesPageActions.Reset());
    this.store.dispatch(new fromDefaultScopesPageActions.LoadCompany(companyIdPayload));
    this.store.dispatch(new fromDefaultScopesPageActions.LoadDefaultScopeSurveys(companyIdPayload));
  }

  handleSurveyClicked(dataListItem: DataListItem) {
    this.store.dispatch(new fromDefaultScopesPageActions.SetSelectedSurvey(dataListItem));
  }

  handleMatchResultSelected(matchResult: MatchResult) {
    this.store.dispatch(new fromDefaultScopesPageActions.SetSelectedMatchResult(matchResult));
  }

  handleFilterMatchResultsClicked(type: string) {
    this.store.dispatch(new fromDefaultScopesPageActions.FilterMatchResults({ type }));
  }

  handleSurveyScopeSelected(surveyScope: SurveyScope) {
    this.store.dispatch(new fromDefaultScopesPageActions.SetSelectedSurveyScope(surveyScope));
  }

  handleApplyExactMatchClicked(matchResult: MatchResult) {
    this.store.dispatch(new fromDefaultScopesPageActions.ApplyMatch(matchResult));
  }

  handleApplyScopeClicked() {
    this.store.dispatch(new fromDefaultScopesPageActions.ApplyMatch());
  }
}
