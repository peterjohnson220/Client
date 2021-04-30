import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
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
  PfDataGridCustomFilterOptions, PfDataGridFilter
} from 'libs/features/grids/pf-data-grid/models';
import { DataViewFieldDataType, ViewField } from 'libs/models/payfactors-api';
import { SurveyDataField } from 'libs/features/surveys/survey-data-fields-management/models';

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

  loading$: Observable<boolean>;
  surveyDataFieldsModalOpen$: Observable<boolean>;
  savingSurveyFields$: Observable<boolean>;

  gridFieldSubscription: Subscription;
  surveyDataGridSubscription: Subscription;
  savingSurveyFieldSubscription: Subscription;

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
  customFilterOptions: PfDataGridCustomFilterOptions[] = [
    {
      EntitySourceName: 'CompanySurveys',
      SourceName: 'SurveyJobMatchesCount',
      DisplayName: 'Matched',
      DataType: DataViewFieldDataType.Bit,
      FilterOperator: '=',
      FilterDisplayOptions: this.matchedFilterDisplayOptions
    }
  ];
  filterTemplates = {};
  matchedFilterSelectedOption: PfDataGridCustomFilterDisplayOptions;
  matchedFilterField: ViewField;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  activeSurveyDataGridPageViewId: string;
  surveyDataViewFields: ViewField[];
  surveyDataFields: SurveyDataField[];

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
      ScrollToTop: true
    };
    this.loading$ = this.store.select(fromPfDataGridReducer.getLoading, this.pageViewId);
    this.surveyDataFieldsModalOpen$ = this.store.select(fromSurveysPageReducer.getSurveyFieldsModalOpen);
  }

  ngOnInit(): void {
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.updateMatchedFilter(fields);
      }
    });
  }

  ngAfterViewInit(): void {
    this.filterTemplates = {
      'SurveyJobMatchesCount': { Template: this.matchedFilter },
    };
  }

  ngOnDestroy(): void {
    this.gridFieldSubscription.unsubscribe();
  }

  handleMatchedFilterChanged(option: PfDataGridCustomFilterDisplayOptions): void {
    const field: ViewField = cloneDeep(this.matchedFilterField);
    field.FilterValues = option.Value === null ? null : [option.Value];
    field.FilterOperator = option.Value === null
      ? null
      : option.Value === '1' ? '>=' : '=';
    this.updateField(field);
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
      const updatedVieField = this.surveyDataViewFields.find(f => f.EntitySourceName === field.EntitySourceName && f.SourceName === field.SourceName);
      if (updatedVieField) {
        updatedVieField.IsSelected = field.IsSelected
      }
    });
    this.savingSurveyFields$ = this.store.select(fromPfDataGridReducer.getViewIsSaving, this.activeSurveyDataGridPageViewId);
    this.savingSurveyFieldSubscription = this.savingSurveyFields$.subscribe((saving) => {
      if (saving === false) {
        this.closeSurveyFieldsModal();
        this.store.dispatch(new fromPfDataGridActions.LoadData(this.pageViewId));
        this.store.dispatch(new fromPfDataGridActions.ResetGridScrolled(this.pageViewId));
      }
    })
    this.store.dispatch(new fromPfDataGridActions.UpdateFields(this.activeSurveyDataGridPageViewId, this.surveyDataViewFields));
    this.store.dispatch(new fromPfDataGridActions.CollapseAllRows(this.pageViewId));
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
}

