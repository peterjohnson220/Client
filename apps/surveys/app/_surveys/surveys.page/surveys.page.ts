import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import orderBy from 'lodash/orderBy';

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
import { DataViewFieldDataType, GetJobMatchesRequest, ViewField } from 'libs/models/payfactors-api';
import { SurveyDataField } from 'libs/features/surveys/survey-data-fields-management/models';
import { AsyncStateObj } from 'libs/models/state';
import { SurveyDataCountryAccessDto } from 'libs/models/survey/survey-data-country-access-dto.model';
import { GroupedListItem } from 'libs/models/list';
import { SurveyInfoByCompanyDto } from 'libs/models/survey';
import { JobTypeEnum } from 'libs/models/survey/job-type.enum';

import * as fromSurveysPageReducer from '../reducers';
import * as fromSurveysPageActions from '../actions/surveys-page.actions';
import * as fromSurveyParticipationActions from '../actions/survey-participation.actions';
import { SurveyDataGrid, SurveysPageConfig } from '../models';

@Component({
  selector: 'pf-surveys-page',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss']
})
export class SurveysPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matchedFilter') matchedFilter: ElementRef;
  @ViewChild('countriesFilter') countriesFilter: ElementRef;
  @ViewChild('historyFilter') historyFilter: ElementRef;
  @ViewChild('surveyTitleFilter') surveyTitleFilter: ElementRef;
  @ViewChild('vendorFilter') vendorFilter: ElementRef;
  @ViewChild('matchesColumn') matchesColumn: ElementRef;
  @ViewChild('p') dropdown: NgbDropdown;
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;

  loading$: Observable<boolean>;
  surveyDataFieldsModalOpen$: Observable<boolean>;
  savingSurveyFields$: Observable<boolean>;
  countries$: Observable<AsyncStateObj<SurveyDataCountryAccessDto[]>>;
  surveyYears$: Observable<AsyncStateObj<PfDataGridCustomFilterDisplayOptions[]>>;
  openedSurveyDataGrids$: Observable<SurveyDataGrid[]>;
  expandedRows$: Observable<number[]>;
  surveyInfo$: Observable<AsyncStateObj<SurveyInfoByCompanyDto[]>>;
  surveyJobMatches$: Observable<AsyncStateObj<string[]>>;

  gridFieldSubscription: Subscription;
  surveyDataGridSubscription: Subscription;
  savingSurveyFieldSubscription: Subscription;
  countriesSubscription: Subscription;
  openedSurveyDataGridsSubscription: Subscription;
  expandedRowsSubscription: Subscription;
  loadViewConfigSuccessSubscription: Subscription;
  surveyInfoSubscription: Subscription;
  surveyJobMatchesSubscription: Subscription;

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
  colTemplates = {};
  filterTemplates = {};
  matchedFilterSelectedOption: PfDataGridCustomFilterDisplayOptions;
  countriesFilterSelectedOption: string;
  matchedFilterField: ViewField;
  countriesFilterField: ViewField;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  activeSurveyDataGridPageViewId: string;
  activeSurveyJobId: number;
  surveyDataViewFields: ViewField[];
  surveyDataFields: SurveyDataField[];
  surveyTitle: string;
  countries: GroupedListItem[];
  historyFilterSelectedItem: PfDataGridCustomFilterDisplayOptions;
  surveyYearFilterField: ViewField;
  openedSurveyDataGrids: SurveyDataGrid[];
  fieldsExcludedFromExport = ['Survey_Job_ID', 'Survey_ID', 'SurveyJobMatchesCount'];
  fieldsExcludedFromCellClick = ['CompanySurveys_SurveyJobMatchesCount'];
  defaultHistoryFilterSelectedItem: PfDataGridCustomFilterDisplayOptions = {Value: 'Most Recent', Display: 'Most Recent'};
  surveyTitleField: ViewField;
  vendorField: ViewField;
  surveyTitleOptions: GroupedListItem[];
  vendorOptions: GroupedListItem[];
  selectedSurveyTitles: string[];
  selectedVendors: string[];
  jobType = JobTypeEnum;
  selectedDropdown: NgbDropdown;

  constructor(
    private store: Store<fromSurveysPageReducer.State>,
    private actionsSubject: ActionsSubject,
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
      ShowFilterChooser: true,
      AllowExport: true,
      ExportSourceName: 'Survey Report',
      CustomExportType: 'SurveyJobs',
      ExportSelectionRequired: true,
      ExportSelectionRequiredTooltip: 'Please select at least 1 survey job'
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
    this.openedSurveyDataGrids$ = this.store.select(fromSurveysPageReducer.getOpenedSurveyDataGrids);
    this.expandedRows$ = this.store.select(fromPfDataGridReducer.getExpandedRows, this.pageViewId);
    this.surveyInfo$ = this.store.select(fromSurveysPageReducer.getSurveyInfo);
    this.surveyJobMatches$ = this.store.select(fromSurveysPageReducer.getSurveyJobMatches);
  }

  ngOnInit(): void {
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.updateMatchedFilter(fields);
        this.updateCountriesFilter(fields);
        this.updateHistoryFilter(fields);
        this.surveyTitleField = fields.find(f => f.SourceName === 'Survey_Name');
        this.vendorField = fields.find(f => f.SourceName === 'Survey_Publisher');
        this.selectedSurveyTitles = this.surveyTitleField.FilterValues === null ? [] : this.surveyTitleField.FilterValues;
        this.selectedVendors = this.vendorField.FilterValues === null ? [] : this.vendorField.FilterValues;
      }
    });
    this.countriesSubscription = this.countries$.subscribe(results => {
      if (results && !results.loading && !!results.obj.length) {
        this.populateCountriesFilter(results.obj);
      }
    });
    this.expandedRowsSubscription = this.expandedRows$.subscribe(expandedRows => {
      if (!expandedRows?.length && this.openedSurveyDataGrids?.length) {
        this.store.dispatch(new fromSurveysPageActions.ResetOpenedSurveyDataGrids());
      }
    });
    this.loadViewConfigSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromPfDataGridActions.LOAD_VIEW_CONFIG_SUCCESS))
      .subscribe((action: fromPfDataGridActions.LoadViewConfigSuccess) => {
        if (action.pageViewId === SurveysPageConfig.SurveysPageViewId) {
          const historyField = action.payload.Fields.find(f => f.SourceName === 'SurveyYearFilter');
          if (!!historyField) {
            this.surveyYearFilterField = cloneDeep(historyField);
            this.handleHistoryValueChanged(this.defaultHistoryFilterSelectedItem);
          }
        }
      });
    this.surveyInfoSubscription = this.surveyInfo$.subscribe(si => {
      if (si?.obj?.length) {
        this.surveyTitleOptions = this.buildGroupedListItems(si.obj.map(o => o.SurveyNameShort));
        this.vendorOptions = this.buildGroupedListItems(si.obj.map(o => o.SurveyPublisher));
      }
    });
    this.surveyJobMatchesSubscription = this.surveyJobMatches$.subscribe(sjm => {
      if (sjm?.obj?.length && !!this.selectedDropdown) {
        this.selectedDropdown.open();
      }
    });
    window.addEventListener('scroll', this.scroll, true);
    this.openedSurveyDataGridsSubscription = this.openedSurveyDataGrids$.subscribe(grids => this.openedSurveyDataGrids = grids);
    this.store.dispatch(new fromSurveysPageActions.GetSurveyCountries());
    this.store.dispatch(new fromSurveysPageActions.GetSurveyYears());
    this.store.dispatch(new fromSurveyParticipationActions.GetSurveyInfo({withSurveyCountryAssociation: true}));
  }

  ngAfterViewInit(): void {
    this.filterTemplates = {
      'SurveyJobMatchesCount': { Template: this.matchedFilter },
      'SurveyCountryFilter': {Template: this.countriesFilter},
      'Survey_Name': {Template: this.surveyTitleFilter},
      'Survey_Publisher': {Template: this.vendorFilter}
    };
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate,
      GlobalFiltersTemplates: {
        'SurveyYearFilter': this.historyFilter
      }
    };
    this.colTemplates = {
      'SurveyJobMatchesCount': {Template: this.matchesColumn}
    };
  }

  ngOnDestroy(): void {
    this.gridFieldSubscription.unsubscribe();
    this.countriesSubscription.unsubscribe();
    this.openedSurveyDataGridsSubscription.unsubscribe();
    this.expandedRowsSubscription.unsubscribe();
    this.surveyInfoSubscription.unsubscribe();
    this.surveyJobMatchesSubscription.unsubscribe();
  }

  scroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  handleTreeViewFilterChanged(item: GroupedListItem[], filterField: ViewField): void {
    const field: ViewField = cloneDeep(filterField);
    field.FilterValues = item?.length > 0 ? item.map(x => x.Value) : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  viewSurveyParticipantsModal() {
    this.store.dispatch(new fromSurveyParticipationActions.OpenSurveyParticipationModal());
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
    this.store.dispatch(new fromSurveysPageActions.GetSurveyJobMatches(request));
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
    this.activeSurveyJobId = surveyJobId;
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
        this.store.dispatch(new fromSurveysPageActions.UpdateSurveyDataGridFields(this.activeSurveyJobId));
        this.store.dispatch(new fromPfDataGridActions.LoadData(this.activeSurveyDataGridPageViewId));
      }
    });
    this.store.dispatch(new fromPfDataGridActions.UpdateFields(this.activeSurveyDataGridPageViewId, this.surveyDataViewFields));
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

  surveyDataGridRefreshed(surveyJobId: number): boolean {
    const surveyDataGrid = this.openedSurveyDataGrids.find(x => x.SurveyJobId === surveyJobId);
    if (surveyDataGrid) {
      return surveyDataGrid.GridRefreshed;
    }
    return true;
  }

  surveyDataGridReloading(surveyJobId: number): boolean {
    const surveyDataGrid = this.openedSurveyDataGrids.find(x => x.SurveyJobId === surveyJobId);
    if (surveyDataGrid) {
      return surveyDataGrid.Reloading;
    }
    return false;
  }

  refreshSurveyDataGrid(surveyJobId: number): void {
    this.store.dispatch(new fromSurveysPageActions.ReloadSurveyDataGrid(surveyJobId));
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

  private buildGroupedListItems(list: string[]): GroupedListItem[] {
    const distinctList = uniq(orderBy(list, [l => l.toLowerCase()], 'asc'));
    return distinctList.map(dl => ({Name: dl, Value: dl}));
  }
}

