import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges,
  ViewChild
} from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { cloneDeep, uniq } from 'lodash';

import { PfDataGridColType } from '../../pf-data-grid/enums';
import * as fromGridReducer from '../../pf-data-grid/reducers';

import { ReScopeSurveyDataModalConfiguration, ReScopeSurveyDataContext } from '../models';
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

  pageViewId = 'ECE8522C-CAE0-43C6-82DC-209CB24AC027';
  reScopeSurveyDataFilters = [];
  columnTemplates = {};
  selectedSurveyDataIdSubscription: Subscription;
  selectedSurveyDataId: number;
  reScopeContextSubscription: Subscription;
  reScopeContext: ReScopeSurveyDataContext;

  @ViewChild('scopeSearchColumn') scopeSearchColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;

  constructor(private store: Store<fromGridReducer.State>) {
    this.selectedSurveyDataIdSubscription = this.store.select(fromGridReducer.getSelectedRecordId, this.pageViewId).subscribe(sd => {
      this.selectedSurveyDataId = sd;
    });

    this.reScopeContextSubscription = this.store.select(fromReScopeReducer.getReScopeContext).subscribe(c => {
      if (c) {
        const currentCountry = this.reScopeContext?.CountryCode;
        this.reScopeContext = c.obj;

        if (currentCountry !== c.obj.CountryCode || !currentCountry) {
          const countryCodeFilter = cloneDeep(this.reScopeSurveyDataFilters.find(x => x.SourceName === 'Country_Code'));
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
  }

  ngOnDestroy() {
    this.reScopeContextSubscription.unsubscribe();
    this.selectedSurveyDataIdSubscription.unsubscribe();
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
