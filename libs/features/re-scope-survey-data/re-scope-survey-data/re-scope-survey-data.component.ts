import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges,
  ViewChild
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import uniq from 'lodash/uniq';
import cloneDeep from 'lodash/cloneDeep';

import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import * as fromGridActions from 'libs/features/pf-data-grid/actions';
import * as fromGridReducer from 'libs/features/pf-data-grid/reducers';

import { ViewField } from 'libs/models/payfactors-api/reports/request';

import { ReScopeSurveyDataModalConfiguration, ReScopeSurveyDataContext } from '../models';
import { ReScopeSurveyDataPageViewIds } from '../constants';
import * as fromReScopeReducer from '../reducers';

@Component({
  selector: 'pf-re-scope-survey-data',
  templateUrl: './re-scope-survey-data.component.html',
  styleUrls: ['./re-scope-survey-data.component.scss']
})

export class ReScopeSurveyDataComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() modalConfiguration: ReScopeSurveyDataModalConfiguration;
  @Output() reScopeSubmitted = new EventEmitter();
  @Output() cancelChanges = new EventEmitter();

  pageViewId = ReScopeSurveyDataPageViewIds.ReScopeSurveyDataResults;
  reScopeSurveyDataFilters = [];
  columnTemplates = {};
  selectedSurveyDataIdSubscription: Subscription;
  selectedSurveyDataId: number;
  reScopeContextSubscription: Subscription;
  reScopeContext: ReScopeSurveyDataContext;

  actionBarConfig: ActionBarConfig;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'SurveyData_ScopeSearch'
  }];

  @ViewChild('scopeSearchColumn') scopeSearchColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('scopeSearchFilter') scopeSearchFilter: ElementRef;

  constructor(private store: Store<fromGridReducer.State>) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig()
    };

    this.selectedSurveyDataIdSubscription = this.store.select(fromGridReducer.getSelectedRecordId, this.pageViewId).subscribe(sd => {
      this.selectedSurveyDataId = sd;
    });

    this.reScopeContextSubscription = this.store.select(fromReScopeReducer.getReScopeContext).subscribe(c => {
      if (c) {
        const currentCountry = this.reScopeContext?.CountryCode;
        this.reScopeContext = c.obj;

        const countryCodeFilter = cloneDeep(this.reScopeSurveyDataFilters.find(x => x.SourceName === 'Country_Code'));
        if (currentCountry !== c.obj.CountryCode || !currentCountry || !countryCodeFilter) {
          if (countryCodeFilter) {
            countryCodeFilter.Value = c.obj.CountryCode;
          } else {
            const clonedFilters = cloneDeep(this.reScopeSurveyDataFilters);
            clonedFilters.push({
              SourceName: 'Country_Code',
              Operator: '=',
              Value: c.obj.CountryCode
            });
            this.reScopeSurveyDataFilters = clonedFilters;
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalConfiguration'] &&
      changes['modalConfiguration'].currentValue['SurveyJobId'] &&
      changes['modalConfiguration'].currentValue['SurveyDataId']) {

      const clonedFilters = cloneDeep(this.reScopeSurveyDataFilters);

      const surveyJobFilter = clonedFilters.find(x => x.SourceName === 'Survey_Job_ID');

      if (surveyJobFilter) {
        surveyJobFilter.Value = changes['modalConfiguration'].currentValue['SurveyJobId'];
      } else {
        clonedFilters.push({
          SourceName: 'Survey_Job_ID',
          Operator: '=',
          Value: changes['modalConfiguration'].currentValue['SurveyJobId']
        });
      }

      const surveyDataFilter = clonedFilters.find(x => x.SourceName === 'Survey_Data_ID');

      if (surveyDataFilter) {
        surveyDataFilter.Value = changes['modalConfiguration'].currentValue['SurveyDataId'];
      } else {
        clonedFilters.push({
          SourceName: 'Survey_Data_ID',
          Operator: '<>',
          Value: changes['modalConfiguration'].currentValue['SurveyDataId']
        });
      }

      this.reScopeSurveyDataFilters = clonedFilters;
    }
  }

  ngAfterViewInit() {
    this.columnTemplates = {
      'ScopeSearch': { Template: this.scopeSearchColumn},
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'ScopeSearch': this.scopeSearchFilter
      }
    };
  }

  ngOnDestroy() {
    this.reScopeContextSubscription.unsubscribe();
    this.selectedSurveyDataIdSubscription.unsubscribe();
  }

  resetModal(cancel: boolean) {
    this.store.dispatch(new fromGridActions.UpdateSelectedRecordId(this.pageViewId, null, null));
    this.store.dispatch(new fromGridActions.UpdateSortDescriptorNoDataRetrieval(this.pageViewId, this.defaultSort));
    if (cancel) {
      this.cancelChanges.emit();
    }
  }

  getClonedField(field: ViewField) {
    return cloneDeep(field);
  }

  handleScopeSearch(field: ViewField, filterValue: string) {
    const newField = cloneDeep(field);
    newField.FilterOperator = 'contains';
    newField.FilterValue = filterValue;
    this.store.dispatch(new fromGridActions.UpdateFilter(this.pageViewId, newField));
  }

  // TODO: The feature these functions belong to was deferred for initial deploy (default scopes checkbox). Will be revisited
  handleDefaultScopes(event: any) {
    const applyDefaultScopes = event.target.checked;

    let clonedFilters = cloneDeep(this.reScopeSurveyDataFilters);
    if (applyDefaultScopes) {
      const defaultScopeFilter = clonedFilters.find(x => x.SourceName === 'ScopeSearch' && x.Operator === '=');

      if (defaultScopeFilter) {
        defaultScopeFilter.Values = this.getConcatenatedDefaultScopes();
      } else {
        clonedFilters.push({
          SourceName: 'ScopeSearch',
          Operator: '=',
          Values: this.getConcatenatedDefaultScopes()
        });
      }
    } else {
      clonedFilters = clonedFilters.filter(x => !(x.SourceName === 'ScopeSearch' && x.Operator === '='));
    }

    this.reScopeSurveyDataFilters = clonedFilters;
  }

  getConcatenatedDefaultScopes() {
    return uniq(this.reScopeContext.DefaultScopes.map(ds => {
      return `${(ds.Scope1 || '').trim()}${(ds.Scope2 || '').trim()}${(ds.Scope3 || '').trim()}`;
    }));
  }
}
