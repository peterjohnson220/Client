import { Component, OnDestroy, OnInit } from '@angular/core';
import { PercentPipe } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';
import { PayRateDate } from 'libs/models/payfactors-api/peer/exchange-data-search/response';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { SearchFilterOption } from 'libs/models/payfactors-api/search/response';
import { SidebarGroup, SidebarItem } from 'libs/features/side-bar-info/models/side-bar-info-models';

import { ComphubPages } from '../../../../data';
import { WorkflowContext } from '../../../../models';
import { TrendsSummaryDetails } from '../../../../models/trends-summary-details.model';
import * as fromComphubMainReducer from '../../../../reducers';
import * as fromTrendsSummaryCardActions from '../../../../actions/trends-summary-card.actions';



@Component ({
  selector: 'pf-trends-summary-card',
  templateUrl: './trends-summary.card.component.html',
  styleUrls: ['./trends-summary.card.component.scss']
})
export class TrendsSummaryCardComponent implements OnInit, OnDestroy {

  workflowContext: WorkflowContext;
  workflowContext$: Observable<WorkflowContext>;
  workflowContextSubscription: Subscription;

  peerTrends: PayRateDate[];
  peerTrends$: Observable<AsyncStateObj<PayRateDate[]>>;
  peerTrendsSubscription: Subscription;

  filterContext$: Observable<BaseExchangeDataSearchRequest>;
  filterContext: BaseExchangeDataSearchRequest;
  filterContextSubscription: Subscription;
  filterContextHasFilters: boolean;

  jobSalaryTrend: PayRateDate[];

  comphubPages = ComphubPages;

  trendsSummaryDetails$: Observable<TrendsSummaryDetails>;
  trendsSummaryDetailsSubscription: Subscription;
  trendsSummaryDetails: TrendsSummaryDetails;

  constructor(
    private store: Store<fromComphubMainReducer.State>, private exchangeExplorerContextService: ExchangeExplorerContextService,
    private percentPipe: PercentPipe) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.peerTrends$ = this.store.select(fromComphubMainReducer.getPeerTrends);
    this.trendsSummaryDetails$ = this.store.select(fromComphubMainReducer.getPeerTrendsSummaryDetails);
  }

  ngOnInit(): void {

    this.workflowContextSubscription = this.workflowContext$.subscribe( wfc => {
      if (!!wfc && wfc.selectedPageId === ComphubPages.TrendsSummary) {
        this.workflowContext = wfc;
        this.getPeerTrends();
      }
    });

    this.peerTrendsSubscription = this.peerTrends$.subscribe(pt => {
      if ( !!pt.obj ) {
        if (pt.obj.length > 0) {
          this.peerTrends = pt.obj;
          this.jobSalaryTrend =  this.peerTrends.map(x =>
              ({
                BasePay: x.BasePay,
                EffectiveDate: new Date(Date.parse(x.EffectiveDate + 'Z')),
                Incs: x.Incs,
                Orgs: x.Orgs,
                ExchangeJobCount: x.ExchangeJobCount,
                CompanyJobCount: x.CompanyJobCount
              })
            );
        } else {
          this.peerTrends = pt.obj;
          this.jobSalaryTrend =  [];

        }
      }
    });

    this.filterContext$ = this.exchangeExplorerContextService.selectFilterContext();
    this.filterContextSubscription = this.filterContext$.subscribe(fc => {
      this.filterContext = fc;
      this.filterContextHasFilters = fc.Filters.filter(x => x.Options.length > 0).length > 0;
    });

    this.trendsSummaryDetailsSubscription = this.trendsSummaryDetails$.subscribe(x =>
      this.trendsSummaryDetails = x
    );
  }

  ngOnDestroy(): void {
    this.workflowContextSubscription.unsubscribe();
    this.trendsSummaryDetailsSubscription.unsubscribe();
  }

  private getPeerTrends() {
    this.store.dispatch(new fromTrendsSummaryCardActions.GetPeerTrends());
  }

  getFilterString(options: SearchFilterOption[]): string {
    let optionsStr = '';
    for (const option of options) {
      optionsStr += option.Name + ', ';
    }
    return optionsStr.replace(/,\s*$/, '');
  }

  getSidebarGroups(): SidebarGroup[] {
    return [
      // regular group
      {
        Name: '',
        Items: [
          {
            Name: 'Peer Network',
            Value: this.workflowContext?.activeExchangeDataSet?.ExchangeName
          },
          {
            Name: 'Currency',
            Value: 'USD'
          },
          {
            Name: 'Weighting Type',
            Value: 'Job Weighted'
          }
        ],
        DisplayEmptySetMessage: false,
        EmptySetMessage: ''
      },

      // chart group
      {
        Name: 'Chart Information',
        Items: [
          {
            Name: 'Average Base Change',
            Value: this.percentPipe.transform(this.trendsSummaryDetails?.BasePayPctChange, '1.0-2')
          },
          {
            Name: 'Company Count Change',
            Value: this.percentPipe.transform(this.trendsSummaryDetails?.OrgsPctChange, '1.0-2')
          },
          {
            Name: 'Incumbent Count Change',
            Value: this.percentPipe.transform(this.trendsSummaryDetails?.IncsPctChange, '1.0-2')
          }
        ],
        DisplayEmptySetMessage: false,
        EmptySetMessage: ''
      },

      // filter group
      {
        Name: 'Filters',
        Items: this.filterContext.Filters.map( x => {return {
            Name: x.DisplayName,
            Value: this.getFilterString(x.Options)
          };
        }),
        DisplayEmptySetMessage: !this.filterContextHasFilters,
        EmptySetMessage: 'No Filters Selected'
      }
    ];
  }
}
