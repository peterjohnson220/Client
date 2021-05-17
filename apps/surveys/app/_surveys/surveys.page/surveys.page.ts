import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';

import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import {
  ActionBarConfig,
  getDefaultActionBarConfig,
  GridConfig,
  PfDataGridCustomFilterDisplayOptions,
  PfDataGridCustomFilterOptions,
  PfDataGridFilter
} from 'libs/features/grids/pf-data-grid/models';
import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';
import { SurveyDataField } from 'libs/features/surveys/survey-data-fields-management/models';
import { AsyncStateObj } from 'libs/models/state';
import { SurveyDataCountryAccessDto } from 'libs/models/survey/survey-data-country-access-dto.model';
import { GroupedListItem } from 'libs/models/list';

import * as fromSurveysPageReducer from '../reducers';
import * as fromSurveysPageActions from '../actions/surveys-page.actions';
import { SurveysPageConfig } from '../models';


@Component({
  selector: 'pf-surveys-page',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveysPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matchedFilter') matchedFilter: ElementRef;
  @ViewChild('countriesFilter') countriesFilter: ElementRef;
  @ViewChild('historyFilter') historyFilter: ElementRef;

  loading$: Observable<boolean>;
  surveyDataFieldsModalOpen$: Observable<boolean>;
  savingSurveyFields$: Observable<boolean>;
  countries$: Observable<AsyncStateObj<SurveyDataCountryAccessDto[]>>;
  surveyYears$: Observable<AsyncStateObj<PfDataGridCustomFilterDisplayOptions[]>>;

  gridFieldSubscription: Subscription;
  surveyDataGridSubscription: Subscription;
  savingSurveyFieldSubscription: Subscription;
  countriesSubscription: Subscription;
  surveyYearsSubscription: Subscription;

  inboundFilters: PfDataGridFilter[];
  pageViewId = SurveysPageConfig.SurveysPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'SurveyJob_Job_Title'
  }];
  matchedFilterDisplayOptions: PfDataGridCustomFilterDisplayOptions[] = [
    { Display: '', Value: null },
    { Display: 'Yes', Value: '1' },
    { Display: 'No', Value: '0' }
  ];
  countryDisplayOptions: PfDataGridCustomFilterDisplayOptions[];
  customFilterOptions: PfDataGridCustomFilterOptions[] = [
    {
      EntitySourceName: 'CompanySurveys',
      SourceName: 'SurveyJobMatchesCount',
      DisplayName: 'Matched',
      DataType: DataViewFieldDataType.Bit,
      FilterOperator: '=',
      FilterDisplayOptions: this.matchedFilterDisplayOptions
    },
    {
      EntitySourceName: 'CompanySurveys',
      SourceName: 'SurveyCountryFilter',
      DisplayName: 'Country',
      DataType: DataViewFieldDataType.String,
      FilterOperator: '=',
      FilterDisplayOptions: [{Display: 'All', Value: null}]
    }
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  filterTemplates = {};
  matchedFilterSelectedOption: PfDataGridCustomFilterDisplayOptions;
  countriesFilterSelectedOption: string;
  matchedFilterField: ViewField;
  countriesFilterField: ViewField;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  activeSurveyDataGridPageViewId: string;
  surveyDataViewFields: ViewField[];
  surveyDataFields: SurveyDataField[];
  surveyTitle: string;
  countries: GroupedListItem[];
  historyFilterSelectedItem: PfDataGridCustomFilterDisplayOptions;
  surveyYearFilterField: ViewField;
  surveyYearOptions: PfDataGridCustomFilterDisplayOptions[];
  filteredSurveyYearOptions: PfDataGridCustomFilterDisplayOptions[];

  constructor(
    private store: Store<fromSurveysPageReducer.State>
  ) {
    this.inboundFilters = [
      {
        SourceName: 'Survey_ID',
        Operator: 'notnull',
        ExcludeFromFilterSave: true
      },
      {
        SourceName: 'Survey_Job_ID',
        Operator: 'notnull',
        ExcludeFromFilterSave: true
      }
    ];
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true,
      SelectAllPanelItemName: 'jobs'
    };
    this.loading$ = this.store.select(fromPfDataGridReducer.getLoading, this.pageViewId);
    this.surveyDataFieldsModalOpen$ = this.store.select(fromSurveysPageReducer.getSurveyFieldsModalOpen);
    this.countries$ = this.store.select(fromSurveysPageReducer.getSurveyCountries);
    this.surveyYears$ = this.store.select(fromSurveysPageReducer.getSurveyYears);
  }

  ngOnInit(): void {
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.updateMatchedFilter(fields);
        this.updateCountriesFilter(fields);
        this.updateHistoryFilter(fields);
      }
    });
    this.countriesSubscription = this.countries$.subscribe(results => {
      if (results && !results.loading && !!results.obj.length) {
        this.populateCountriesFilter(results.obj);
      }
    });
    this.surveyYearsSubscription = this.surveyYears$.subscribe(asyncObj => {
      if (!asyncObj?.loading && asyncObj?.obj?.length) {
        this.surveyYearOptions = asyncObj.obj;
        this.filteredSurveyYearOptions = asyncObj.obj;
      }
    });
    this.store.dispatch(new fromSurveysPageActions.GetSurveyCountries());
    this.store.dispatch(new fromSurveysPageActions.GetSurveyYears());
  }

  ngAfterViewInit(): void {
    this.filterTemplates = {
      'SurveyYearFilter': { Template: this.historyFilter },
      'SurveyJobMatchesCount': { Template: this.matchedFilter },
      'SurveyCountryFilter': {Template: this.countriesFilter}
    };
  }

  ngOnDestroy(): void {
    this.gridFieldSubscription.unsubscribe();
    this.countriesSubscription.unsubscribe();
    this.surveyYearsSubscription.unsubscribe();
  }

  handleMatchedFilterChanged(option: PfDataGridCustomFilterDisplayOptions): void {
    const field: ViewField = cloneDeep(this.matchedFilterField);
    field.FilterValues = option.Value === null ? null : [option.Value];
    field.FilterOperator = option.Value === null
      ? null
      : option.Value === '1' ? '>=' : '=';
    this.updateField(field);
  }

  handleCountriesFilterChanged(countryCode: string): void {
    const field: ViewField = cloneDeep(this.countriesFilterField);
    field.FilterValues = countryCode === null ? null : [countryCode];
    field.FilterOperator = '=';
    this.updateField(field);
  }

  populateCountriesFilter(options: SurveyDataCountryAccessDto[]): void {
    const flags = {};

    const distinctOptions = options.filter(function(entry) {
      if (flags[entry.CountryCode]) {
        return false;
      }
      flags[entry.CountryCode] = true;
      return true;
    });

    this.countries = distinctOptions.map(r => {
      return {
        Name: `${r.CountryName} (${r.CountryCode})`,
        Value: r.CountryCode
      };
    });
    this.countryDisplayOptions = distinctOptions.map(r => {
      return {
        Display: `${r.CountryName} (${r.CountryCode})`,
        Value: r.CountryCode
      };
    });

    const customFilterOptionsClone: PfDataGridCustomFilterOptions[] = cloneDeep(this.customFilterOptions);

    const filterOption: PfDataGridCustomFilterOptions = customFilterOptionsClone
      .find(p => p.SourceName === 'SurveyCountryFilter');

    this.countryDisplayOptions.forEach(option => {
      if (filterOption.FilterDisplayOptions.indexOf(option.Value) === -1) {
        filterOption.FilterDisplayOptions.push(option);
      }
    });

    this.customFilterOptions = customFilterOptionsClone;

  }

  closeExpandedRow(id: string, idValue: number): void {
    this.store.dispatch(new fromPfDataGridActions.CollapseRowById(this.pageViewId, id, idValue));
  }

  openSurveyFieldsModal(surveyJobId: number): void {
    this.activeSurveyDataGridPageViewId = `${SurveysPageConfig.SurveyDataCutsPageViewId}_${surveyJobId}`;
    this.surveyDataGridSubscription = this.store.select(fromPfDataGridReducer.getFields, this.activeSurveyDataGridPageViewId)
      .subscribe(fields => {
        if (fields) {
          this.createSurveyDataFields(fields);
        }
      });
    this.store.dispatch(new fromSurveysPageActions.OpenSurveyFieldsModal());
  }

  closeSurveyFieldsModal(): void {
    this.store.dispatch(new fromSurveysPageActions.CloseSurveyFieldsModal());
    this.surveyDataGridSubscription.unsubscribe();
    if (this.savingSurveyFieldSubscription) {
      this.savingSurveyFieldSubscription.unsubscribe();
    }
  }

  updateSurveyFields(fields: SurveyDataField[]): void {
    fields.forEach(field => {
      const updatedViewField = this.surveyDataViewFields.find(f => f.EntitySourceName === field.EntitySourceName && f.SourceName === field.SourceName);
      if (updatedViewField) {
        updatedViewField.IsSelected = field.IsSelected;
      }
    });
    this.savingSurveyFields$ = this.store.select(fromPfDataGridReducer.getViewIsSaving, this.activeSurveyDataGridPageViewId);
    this.savingSurveyFieldSubscription = this.savingSurveyFields$.subscribe((saving) => {
      if (saving === false) {
        this.closeSurveyFieldsModal();
        this.store.dispatch(new fromPfDataGridActions.LoadData(this.pageViewId));
        this.store.dispatch(new fromPfDataGridActions.ResetGridScrolled(this.pageViewId));
      }
    });
    this.store.dispatch(new fromPfDataGridActions.UpdateFields(this.activeSurveyDataGridPageViewId, this.surveyDataViewFields));
    this.store.dispatch(new fromPfDataGridActions.CollapseAllRows(this.pageViewId));
  }

  viewParticipantsList(surveyId: number, surveyTitle: string): void {
    this.surveyTitle = surveyTitle;
    this.store.dispatch(new fromSurveysPageActions.GetSurveyParticipants(surveyId));
    this.store.dispatch(new fromSurveysPageActions.OpenParticipantsModal());
  }

  handleHistoryValueChanged(option: PfDataGridCustomFilterDisplayOptions): void {
    const field: ViewField = cloneDeep(this.surveyYearFilterField);
    field.FilterValues = option.Value === null ? null : [option.Value];
    field.FilterOperator = '=';
    this.updateField(field);
  }

  handleHistoryFilterChanged(searchTerm: string): void {
    this.filteredSurveyYearOptions = this.surveyYearOptions.filter(o => o.Value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
  }

  private updateField(field: ViewField) {
    if (field?.FilterValues?.length > 0) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  private updateMatchedFilter(fields: ViewField[]): void {
    this.matchedFilterField = fields.find(f => f.SourceName === 'SurveyJobMatchesCount');

    if (!this.matchedFilterField) {
      return;
    }
    const matchedFilterValue = this.matchedFilterField.FilterValues === null
      ? null
      : this.matchedFilterField.FilterOperator === '>=' ? '1' : '0';
    this.matchedFilterSelectedOption = this.matchedFilterDisplayOptions.find(x => x.Value === matchedFilterValue);
  }

  private updateCountriesFilter(fields: ViewField[]): void {
    this.countriesFilterField = fields.find(f => f.SourceName === 'SurveyCountryFilter');

    if (this.countriesFilterField) {
      this.countriesFilterSelectedOption = this.countriesFilterField?.FilterValues?.length > 0 ? this.countriesFilterField.FilterValues[0] : null;
    }
  }

  private createSurveyDataFields(fields: ViewField[]): void {
    this.surveyDataViewFields = cloneDeep(fields);
    this.surveyDataFields = [];
    const fieldsWithGroup = this.surveyDataViewFields.filter(f => !!f.Group ||
      (f.EntitySourceName === 'CompanySurveys' && f.SourceName === 'Aging_Factor'));
    fieldsWithGroup.forEach(field => {
      this.surveyDataFields.push({
        EntitySourceName: field.EntitySourceName,
        SourceName: field.SourceName,
        DisplayName: field.DisplayName,
        Group: field.Group,
        GroupOrder: field.GroupOrder,
        Order: field.Order,
        IsSelected: field.IsSelected
      });
    });
  }

  private updateHistoryFilter(fields: ViewField[]): void {
    this.surveyYearFilterField = fields.find(f => f.SourceName === 'SurveyYearFilter');
    if (!this.surveyYearFilterField) {
      return;
    }
    this.historyFilterSelectedItem = this.surveyYearFilterField.FilterValues === null
      ? null
      : { Value: this.surveyYearFilterField.FilterValues[0], Display: this.surveyYearFilterField.FilterValues[0] };
  }
}

