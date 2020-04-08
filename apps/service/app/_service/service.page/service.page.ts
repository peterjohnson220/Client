import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import { ServicePageConfig } from '../models';
import * as fromServicePageActions from '../actions/service-page.actions';
import * as fromServicePageReducer from '../reducers';

@Component({
  selector: 'pf-service-page',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss']
})
export class ServicePageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('statusColumn', { static: false }) statusColumn: ElementRef;
  @ViewChild('ticketType', { static: false }) ticketType: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;

  ticketTypes$: Observable<string[]>;

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'UserTickets_Create_Date'
  }];
  actionBarConfig: ActionBarConfig;
  pageViewId = ServicePageConfig.ServicePageViewId;
  colTemplates = {};
  filterTemplates = {};
  ticketTypeField: ViewField;
  selectedTicketTypeFilterValue: string;

  gridFieldSubscription: Subscription;

  constructor(private store: Store<fromServicePageReducer.State>) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      AllowSaveFilter: false,
      ShowFilterChooser: true
    };
    this.ticketTypes$ = this.store.pipe(select(fromServicePageReducer.getTicketTypeNames));
  }

  ngOnInit(): void {
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.ticketTypeField = fields.find(f => f.SourceName === 'UserTicket_Type');
        this.selectedTicketTypeFilterValue = this.ticketTypeField.FilterValue;
      }
    });
    this.store.dispatch(new fromServicePageActions.LoadTicketTypes());
    this.store.dispatch(new fromServicePageActions.GetTicketStates());
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'UserTicket_State': { Template: this.statusColumn }
    };
    this.filterTemplates = {
      'UserTicket_Type': { Template: this.ticketType }
    };
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }

  handleTicketTypeFilterChanged(value: string) {
    const field = cloneDeep(this.ticketTypeField);
    field.FilterValue = value !== 'All' ? value : null;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
  }

  addNewTicket() {
    this.store.dispatch(new fromServicePageActions.ShowNewTicketModal(true));
  }
}
