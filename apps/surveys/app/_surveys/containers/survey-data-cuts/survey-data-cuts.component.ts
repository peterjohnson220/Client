import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromSurveysPageActions from '../../actions/surveys-page.actions';
import * as fromSurveysPageReducer from '../../reducers';
import { SurveysPageConfig } from '../../models';

@Component({
  selector: 'pf-survey-data-cuts',
  templateUrl: './survey-data-cuts.component.html'
})
export class SurveyDataCutsComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() surveyJobId: number;

  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('weightingTypeColumn') weightingTypeColumn: ElementRef;
  @ViewChild('numericColumn') numericColumn: ElementRef;

  splitViewFilters$: Observable<PfDataGridFilter[]>;

  splitViewFiltersSubscription: Subscription;

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
    this.store.dispatch(new fromSurveysPageActions.OpenSurveyDataGrid(this.surveyJobId));
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'WeightingType': { Template: this.weightingTypeColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      ['numeric']: { Template: this.numericColumn}
    };
  }

  ngOnDestroy(): void {
    this.splitViewFiltersSubscription.unsubscribe();
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
