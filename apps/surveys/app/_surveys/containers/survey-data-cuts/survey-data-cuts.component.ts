import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums';
import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { AsyncStateObj } from 'libs/models/state';
import { JobTypeEnum } from 'libs/models/survey';
import { GetJobMatchesRequest } from 'libs/models/payfactors-api/survey/request';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromSurveysPageActions from '../../actions/surveys-page.actions';
import * as fromSurveysPageReducer from '../../reducers';
import { SurveysPageConfig } from '../../models';

@Component({
  selector: 'pf-survey-data-cuts',
  templateUrl: './survey-data-cuts.component.html',
  styleUrls: ['./survey-data-cuts.component.scss']
})
export class SurveyDataCutsComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() surveyJobId: number;

  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('weightingTypeColumn') weightingTypeColumn: ElementRef;
  @ViewChild('numericColumn') numericColumn: ElementRef;
  @ViewChild('matchesColumn') matchesColumn: ElementRef;

  splitViewFilters$: Observable<PfDataGridFilter[]>;
  surveyDataMatches$: Observable<AsyncStateObj<string[]>>;

  splitViewFiltersSubscription: Subscription;
  surveyDataMatchesSubscription: Subscription;

  pageViewId = SurveysPageConfig.SurveyDataCutsPageViewId;
  pfThemeType = PfThemeType;
  defaultSort: SortDescriptor[] = [
    {
      dir: 'asc',
      field: 'SurveyData_SurveyDataCombinedScope'
    }
  ];
  surveyJobFilter: PfDataGridFilter;
  matchedFilter: PfDataGridFilter;
  countriesFilter: PfDataGridFilter;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  colTemplates = {};
  fieldsExcludedFromCellClick = ['SurveyData_SurveyDataMatchesCount'];
  jobType = JobTypeEnum;
  selectedDropdown: NgbDropdown;

  constructor(
    private store: Store<fromSurveysPageReducer.State>
  ) {
    this.surveyJobFilter = {
      SourceName: 'Survey_Job_ID',
      Operator: '=',
      Values: [''],
      ExcludeFromFilterSave: true
    };
    this.matchedFilter = {
      SourceName: 'SurveyDataMatchesCount',
      Operator: null,
      Values: null,
      ExcludeFromFilterSave: true
    };
    this.countriesFilter = {
      SourceName: 'Country_Code',
      Operator: '=',
      Values: null,
      ExcludeFromFilterSave: true
    };
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true,
      IsExpandedRowGrid: true
    };
    this.splitViewFilters$ = this.store.select(fromPfDataGridReducer.getSplitViewFilters, SurveysPageConfig.SurveysPageViewId);
    this.surveyDataMatches$ = this.store.select(fromSurveysPageReducer.getSurveyDataMatches);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.surveyJobId?.currentValue) {
      this.surveyJobFilter.Values = [changes.surveyJobId.currentValue];
    }
  }

  ngOnInit(): void {
    this.splitViewFiltersSubscription = this.splitViewFilters$.subscribe(filters => {
      if (filters?.length) {
        this.updateMatchedFilter(filters);
        this.updateCountriesFilter(filters);
      }
    });
    this.surveyDataMatchesSubscription = this.surveyDataMatches$.subscribe(sdm => {
      if (sdm?.obj?.length && !!this.selectedDropdown) {
        this.selectedDropdown.open();
      }
    });
    window.addEventListener('scroll', this.scroll, true);
    this.store.dispatch(new fromSurveysPageActions.OpenSurveyDataGrid(this.surveyJobId));
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'WeightingType': { Template: this.weightingTypeColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      ['numeric']: { Template: this.numericColumn},
      'SurveyDataMatchesCount': { Template: this.matchesColumn }
    };
  }

  ngOnDestroy(): void {
    this.splitViewFiltersSubscription.unsubscribe();
    this.surveyDataMatchesSubscription.unsubscribe();
  }
  scroll = (event): void => {
    if (!event || !event.target || event.target.classList.contains('matches-container')) {
      return;
    }
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  handleMatchesClicked(jobType: number, surveyId: number, jobCode: string, popover: any): void {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
    this.selectedDropdown = popover;
    const request: GetJobMatchesRequest = {
      JobType: jobType,
      SurveyId: surveyId,
      JobCode: jobCode
    };
    this.store.dispatch(new fromSurveysPageActions.GetSurveyDataMatches(request));
  }

  private updateMatchedFilter(filters: PfDataGridFilter[]): void {
    const surveyJobMatchedFilter: PfDataGridFilter = filters.find((x: PfDataGridFilter) => x.SourceName === 'SurveyJobMatchesCount');
    if (!surveyJobMatchedFilter) {
      return;
    }
    this.matchedFilter = {
      ...this.matchedFilter,
      Operator: surveyJobMatchedFilter.Operator,
      Values: surveyJobMatchedFilter.Values
    };
  }

  private updateCountriesFilter(filters: PfDataGridFilter[]): void {
    const dataCountriesFilter: PfDataGridFilter = filters.find((x: PfDataGridFilter) => x.SourceName === 'SurveyCountryFilter');
    if (!dataCountriesFilter) {
      return;
    }
    this.countriesFilter = {
      ...this.countriesFilter,
      Operator: dataCountriesFilter.Operator,
      Values: dataCountriesFilter.Values
    };
  }
}
