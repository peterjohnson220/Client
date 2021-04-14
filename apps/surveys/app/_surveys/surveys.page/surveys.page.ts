import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
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

import * as fromSurveysPageReducer from '../reducers';
import { SurveysPageConfig } from '../models';

@Component({
  selector: 'pf-surveys-page',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss']
})
export class SurveysPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matchedFilter') matchedFilter: ElementRef;

  gridFieldSubscription: Subscription;

  filter: PfDataGridFilter;
  pageViewId = SurveysPageConfig.SurveysPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'Surveys_Survey_Publisher'
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

  constructor(
    private store: Store<fromSurveysPageReducer.State>
  ) {
    this.filter = {
      SourceName: 'Survey_ID',
      Operator: 'notnull'
    };
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
}

