import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import isEmpty from 'lodash/isEmpty';

import { AsyncStateObj } from 'libs/models';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';
import * as fromMultiMatchActions from 'libs/features/pricings/multi-match/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { BasicDataViewField, DataViewFilter, ViewField } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants/permissions';

import * as fromJobsPageReducer from '../../reducers';
import * as fromModifyPricingsActions from '../../actions/modify-pricings.actions';
import { DeleteMatchModalData, MarketDataConfig, MarketDataJobPricing } from '../../models';
import { PageViewIds } from '../../constants';

@Component({
  selector: 'pf-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss']
})
export class MarketDataComponent implements OnChanges, OnInit, OnDestroy {
  @Input() jobPricing: MarketDataJobPricing;

  pricingMatches$: Observable<AsyncStateObj<any[]>>;

  showMatchDetailsModal: BehaviorSubject<boolean>;
  showMatchDetailsModal$: Observable<boolean>;

  modifyPricingsSubscription: Subscription;
  pricingMatchesSubscription: Subscription;
  isActiveJobSubscription: Subscription;

  marketDataId = MarketDataConfig.marketDataGridId;
  baseEntity = MarketDataConfig.baseEntity;
  fields = MarketDataConfig.fields;
  fieldGroups = ['Base', 'TCC'];
  permissions = Permissions;
  rate: string;
  selectedPricingMatch: any;
  pricingMatchesCount: number;
  isActiveJob = true;

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private jobsPageStore: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    this.pricingMatches$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, this.marketDataId);
    this.showMatchDetailsModal = new BehaviorSubject<boolean>(false);
    this.showMatchDetailsModal$ = this.showMatchDetailsModal.asObservable();

    this.initGrid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.jobPricing?.currentValue && changes.jobPricing.currentValue.Id !== 0
        && changes.jobPricing.currentValue.Id !== changes.jobPricing.previousValue?.Id) {
      this.updateFilters();
      this.rate = this.jobPricing.Rate;
    }
  }

  ngOnInit(): void {
    this.modifyPricingsSubscription = this.actionsSubject.pipe(
      ofType(fromModifyPricingsActions.UPDATING_PRICING_MATCH_SUCCESS,
        fromModifyPricingsActions.DELETING_PRICING_MATCH_SUCCESS,
        fromModifyPricingsActions.UPDATING_PRICING_SUCCESS,
        fromMultiMatchActions.MODIFY_PRICINGS_SUCCESS)
    ).subscribe(data => {
      this.getData();
    });
    this.pricingMatchesSubscription = this.pricingMatches$.subscribe(data => {
      if (!data?.loading && data?.obj) {
        this.pricingMatchesCount = data.obj.length;
      }
    });
    this.isActiveJobSubscription = this.jobsPageStore
      .select(fromPfDataGridReducer.getFields, PageViewIds.Jobs)
      .pipe(filter(f => !isEmpty(f)))
      .subscribe(fields => {
        const statusFieldFilter: ViewField = fields.find(f => f.SourceName === 'JobStatus');
        this.isActiveJob = statusFieldFilter?.FilterValues?.length > 0
          ? statusFieldFilter.FilterValues[0] === 'true'
          : true;
      });
  }

  ngOnDestroy(): void {
    this.modifyPricingsSubscription.unsubscribe();
    this.pricingMatchesSubscription.unsubscribe();
    this.isActiveJobSubscription.unsubscribe();
  }

  trackByField(index, field: BasicDataViewField) {
    return field.KendoGridField;
  }

  openMatchDetailsModal(pricingMatch: any): void {
    this.selectedPricingMatch = pricingMatch;
    this.showMatchDetailsModal.next(true);
  }

  closeMatchDetailsModal(): void {
    this.selectedPricingMatch = null;
    this.showMatchDetailsModal.next(false);
  }

  openDeleteMatchModal(pricingMatch: any): void {
    const deleteModalData: DeleteMatchModalData = {
      PricingMatchId: pricingMatch['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
      JobTitle: this.jobPricing.JobTitle,
      JobCode: this.jobPricing.JobCode,
      JobId: this.jobPricing.JobId,
      MatchJobTitle: pricingMatch['vw_PricingMatchesJobTitlesMerged_Job_Title'],
      MatchJobCode: pricingMatch['vw_PricingMatchesJobTitlesMerged_Job_Code'],
      PayMarket: this.jobPricing.PayMarket,
      PayMarketId: this.jobPricing.PayMarketId,
      EffectiveDate: this.jobPricing.JobPricingEffectiveDate,
      PricingMatchesCount: this.pricingMatchesCount
    };
    this.jobsPageStore.dispatch(new fromModifyPricingsActions.SetDeleteMatchModalData(deleteModalData));
  }

  public modifyMatchPermissionMessage(isDelete: boolean = false): string {
    if (!this.isActiveJob) {
      return isDelete ? 'You cannot delete matches for inactive jobs.' : 'You cannot modify matches for inactive jobs.';
    } else if (!!this.jobPricing?.LinkedPayMarketId) {
      return isDelete ? 'You cannot delete matches for linked Pay Markets.' : 'You cannot modify matches for linked Pay Markets.';
    } else {
      return '';
    }
  }

  private initGrid(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      this.marketDataId,
      {
        BaseEntity: this.baseEntity,
        ApplyDefaultFilters: false,
        Fields: this.fields,
        Filters: [],
        Distinct: true
      }
    ));
  }

  private updateFilters(): void {
    const filters: DataViewFilter[] = MarketDataConfig.getFilters(this.jobPricing.Id);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.UpdateFilters(this.marketDataId, filters));
  }

  private getData(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(this.marketDataId));
  }
}
