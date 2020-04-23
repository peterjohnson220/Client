import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { SortDescriptor } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromNotesManagerActions from 'libs/features/notes-manager/actions';

import * as fromJobsPageActions from '../../../../actions';
import * as fromJobsPageReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants';

@Component({
  selector: 'pf-pricing-details-grid',
  templateUrl: './pricing-details-grid.component.html',
  styleUrls: ['./pricing-details-grid.component.scss']
})
export class PricingDetailsGridComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() filters: PfDataGridFilter[];
  @Input() unPricedCount: number;
  @ViewChild('pricedDataPayMarketFilter', { static: false }) pricedDataPayMarketFilter: ElementRef;
  @ViewChild('changeView', { static: false }) changeView: ElementRef;
  @ViewChild('payMarketColumn', { static: false }) payMarketColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;
  @ViewChild('genericMrpColumn', { static: false }) genericMrpColumn: ElementRef;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket'];
  mrpFields = ['AllowMRP', 'BaseMRP', 'BonusMRP', 'BonusPctMRP', 'BonusTargetMRP', 'BonusTargetPctMRP', 'FixedMRP', 'LTIPMRP', 'LTIPPctMRP', 'RemunMRP',
    'SalesIncentiveActualMRP', 'SalesIncentiveActualPctMRP', 'SalesIncentiveTargetMRP', 'SalesIncentiveTargetPctMRP',
    'TargetLTIPMRP', 'TargetTDCMRP', 'TCCMRP', 'TCCPlusAllowMRP', 'TCCPlusAllowNoCarMRP', 'TCCTargetMRP', 'TCCTargetPlusAllowMRP',
    'TCCTargetPlusAllowNoCarMRP', 'TDCMRP', 'TGPMRP'];
  payMarketOptions: any;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  selectedKeys: number[];
  actionBarConfig: ActionBarConfig;
  viewMode = 'Priced';
  companyPayMarketsSubscription: Subscription;

  pricedDataPageViewId = PageViewIds.PricingDetails;
  pricedDataGlobalFilterTemplates = {};
  pricedDataColTemplates = {};
  pricedDataGridFieldSubscription: Subscription;
  pricedDataPayMarketField: ViewField;
  pricedDataFilteredPayMarketOptions: any;
  pricedDataSelectedPayMarket: any;

  selectedRow: any = {};
  getNotesSuccessSubscription: Subscription;
  showNotesManager = new BehaviorSubject<boolean>(false);
  showNotesManager$ = this.showNotesManager.asObservable();

  selectedRow$: Observable<any>;

  constructor(private store: Store<fromJobsPageReducer.State>, private actionsSubject: ActionsSubject) {
    this.selectedRow$ = this.store.select(fromPfGridReducer.getSelectedRow, PageViewIds.Jobs);

    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.pricedDataFilteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });

    this.pricedDataGridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pricedDataPageViewId).subscribe(fields => {
      if (fields) {
        this.pricedDataPayMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.pricedDataSelectedPayMarket = this.pricedDataPayMarketField.FilterValue !== null ?
          { Value: this.pricedDataPayMarketField.FilterValue, Id: this.pricedDataPayMarketField.FilterValue } : null;
      }
    });

    // We show the NotesModal only after the Notes have loaded. This way we ensure the modal height doesn't jump around but is dynamic
    this.getNotesSuccessSubscription = actionsSubject
      .pipe(ofType(fromNotesManagerActions.GET_NOTES_SUCCESS) || ofType(fromNotesManagerActions.GET_NOTES_ERROR))
      .subscribe(data => {
        this.showNotesManager.next(true);
      });

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'ml-0 mt-1'
    };
  }

  ngAfterViewInit() {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.pricedDataPayMarketFilter
      },
      GlobalActionsTemplate: this.changeView
    };
    this.pricedDataGlobalFilterTemplates = {
      'PayMarket': { Template: this.pricedDataPayMarketFilter }
    };

    this.pricedDataColTemplates = {
      'PayMarket': { Template: this.payMarketColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };

    this.mrpFields.forEach(mrp => {
      this.pricedDataColTemplates[mrp] = { Template: this.genericMrpColumn };
    });
  }

  ngOnDestroy() {
    this.companyPayMarketsSubscription.unsubscribe();
    this.pricedDataGridFieldSubscription.unsubscribe();
    this.getNotesSuccessSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.filters = cloneDeep(changes['filters'].currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);
    }
  }

  handleFilter(value) {
    this.pricedDataFilteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.pricedDataPayMarketField);
    field.FilterOperator = '=';
    field.FilterValue = value.Id;

    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pricedDataPageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pricedDataPageViewId, field));
    }
  }

  switchViewToNotPriced() {
    this.store.dispatch(new fromJobsPageActions.ChangePricingDetailsView('Not Priced'));
  }

  openNotesManager(event: any, selectedRow: any) {
    this.selectedRow = selectedRow;
    event.stopPropagation();
  }
}
