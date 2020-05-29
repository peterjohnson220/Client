import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { AsyncStateObj } from 'libs/models/state';
import { PfConstants } from 'libs/models';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromDefaultScopesActions from '../../actions/default-scopes.actions';
import { CompanySurvey, DefaultScope, CombinedScope } from '../../models';
import { GetCompanySurveysRequest } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-default-scopes',
  templateUrl: './default-scopes.component.html',
  styleUrls: ['./default-scopes.component.scss']
})
export class DefaultScopesComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() reset = false;

  @ViewChild('surveyCombobox', { static: true }) public surveyCombobox: ComboBoxComponent;

  surveys$: Observable<AsyncStateObj<CompanySurvey[]>>;
  hasMoreSurveys$: Observable<boolean>;
  combinedScopes$: Observable<AsyncStateObj<CombinedScope[]>>;
  selectedDefaultScopes$: Observable<DefaultScope[]>;

  surveysSubscription: Subscription;
  combinedScopeSubscription: Subscription;
  selectedDefaultScopesSubscription: Subscription;
  surveyFilterChangeSubscription: Subscription;

  surveys: CompanySurvey[];
  combinedScopes: CombinedScope[];
  selectedDefaultScopes: DefaultScope[];
  surveySearchTerm = '';
  surveyId: number;
  combinedScopeValue: string;
  duplicateError = false;

  readonly SURVEYS_COUNT = 20;

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>
  ) {
    this.surveys$ = this.store.select(fromPayMarketManagementReducer.getCompanySurveys);
    this.hasMoreSurveys$ = this.store.select(fromPayMarketManagementReducer.getHasMoreCompanySurveys);
    this.combinedScopes$ = this.store.select(fromPayMarketManagementReducer.getCombinedScopes);
    this.selectedDefaultScopes$ = this.store.select(fromPayMarketManagementReducer.getSelectedDefaultScopes);
  }

  ngOnInit(): void {
    this.initSubscriptions();
    this.loadSurveys();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.reset && changes.reset.currentValue) {
      this.resetDefaultScopes();
    }
  }

  ngAfterViewInit(): void {
    this.surveyFilterChangeSubscription = this.surveyCombobox.filterChange.asObservable().pipe(
      debounceTime(PfConstants.DEBOUNCE_DELAY),
      distinctUntilChanged())
      .subscribe(searchTerm => {
        this.surveySearchTerm = searchTerm;
        this.loadSurveys();
      });
  }

  ngOnDestroy(): void {
    this.surveysSubscription.unsubscribe();
    this.combinedScopeSubscription.unsubscribe();
    this.surveyFilterChangeSubscription.unsubscribe();
  }

  loadSurveys(loadMore?: boolean): void {
    const request: GetCompanySurveysRequest = {
      PagingOptions: {
        From: this.surveys && loadMore ? this.surveys.length : 0,
        Count: this.SURVEYS_COUNT
      },
      Query: this.surveySearchTerm
    };
    this.store.dispatch(new fromDefaultScopesActions.LoadCompanySurveys(request));
  }

  loadCombinedScopes(): void {
    this.combinedScopeValue = null;
    this.duplicateError = false;
    if (!!this.surveyId) {
      this.store.dispatch(new fromDefaultScopesActions.LoadCombinedScopes({ surveyId: this.surveyId }));
    }
  }

  addDefaultScope(): void {
    const selectedSurvey = this.surveys.find(s => s.Id === this.surveyId);
    const selectedCombinedScope = this.combinedScopes.find(s => s.Value === this.combinedScopeValue);
    if (!selectedSurvey || !selectedCombinedScope) {
      return;
    }
    this.duplicateError = this.selectedDefaultScopes.some(s =>
      s.Survey.Id === selectedSurvey.Id &&
      s.Scope.Value === selectedCombinedScope.Value);
    if (this.duplicateError) {
      return;
    }
    const defaultScope: DefaultScope = {
      Survey: selectedSurvey,
      Scope: selectedCombinedScope
    };
    this.store.dispatch(new fromDefaultScopesActions.AddDefaultScope(defaultScope));
  }

  removeDefaultScope(index: number): void {
    this.duplicateError = false;
    this.store.dispatch(new fromDefaultScopesActions.RemoveDefaultScope({ defaultScopeIndex: index }));
  }

  private initSubscriptions(): void {
    this.surveysSubscription = this.surveys$.subscribe(asyncObj => {
      if (!!asyncObj && !asyncObj.loading && !!asyncObj.obj) {
        this.surveys = asyncObj.obj;
      }
    });
    this.combinedScopeSubscription = this.combinedScopes$.subscribe(asyncObj => {
      if (!!asyncObj && !asyncObj.loading && !!asyncObj.obj) {
        this.combinedScopes = asyncObj.obj;
      }
    });
    this.selectedDefaultScopesSubscription = this.selectedDefaultScopes$.subscribe(scopes => this.selectedDefaultScopes = scopes);
  }

  private resetDefaultScopes(): void {
    this.duplicateError = false;
    this.surveyId = null;
    this.combinedScopeValue = null;
    this.surveySearchTerm = '';
    this.loadSurveys();
    this.store.dispatch(new fromDefaultScopesActions.ResetDefaultScopes());
  }
}
