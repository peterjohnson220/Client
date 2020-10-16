import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PermissionService } from 'libs/core';
import { Permissions, PermissionCheckEnum } from 'libs/constants';
import { UpdatePricingRequest } from 'libs/models/payfactors-api';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { PageViewIds } from '../../../constants';
import * as fromJobsPageActions from '../../../actions';
import * as fromJobsPageReducer from '../../../reducers';

import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';

@Component({
  selector: 'pf-pricing-details-adj-pct-column',
  templateUrl: './pricing-details-adj-pct-column.component.html',
  styleUrls: ['./pricing-details-adj-pct-column.component.scss']
})
export class PricingDetailsAdjPctColumnComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dataRow: any;

  adjPct = 0;

  canModifyPricings: boolean;

  isActiveJob = true;
  isActiveJobSubscription: Subscription;

  constructor(private store: Store<fromJobsPageReducer.State>, public permissionService: PermissionService) { }

  ngOnInit(): void {
    this.canModifyPricings = this.permissionService.CheckPermission([Permissions.MODIFY_PRICINGS], PermissionCheckEnum.Single);

    this.isActiveJobSubscription = this.store
      .select(fromPfDataGridReducer.getFields, PageViewIds.Jobs)
      .pipe(filter(f => !isEmpty(f)))
      .subscribe(fields => {
        // TODO: The JobStatus field filter can have a value of 'true' or true.
        // This is because of the way the active/inactive slider sets the filter value
        // This  quick fix needs to be converted to a more robust solution
        const statusFieldFilter: any = fields.find(f => f.SourceName === 'JobStatus').FilterValue;
        this.isActiveJob = statusFieldFilter === 'true' || statusFieldFilter === true;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataRow && changes.dataRow.currentValue) {
      const dataRowadjPct = changes.dataRow.currentValue.CompanyJobs_Pricings_Composite_Adjustment;
      this.adjPct = dataRowadjPct ? dataRowadjPct : 0;
    }
  }

  ngOnDestroy() {
    this.isActiveJobSubscription.unsubscribe();
  }

  updatePricingMatch() {
    const pricingId = this.dataRow.CompanyJobs_Pricings_CompanyJobPricing_ID;

    const request: UpdatePricingRequest = {
      PricingId: pricingId,
      CompositeAdjsPct: this.adjPct,
      UpdateRelatedPricings: false
    };

    this.store.dispatch(new fromJobsPageActions.UpdatingPricing(request, PageViewIds.PayMarkets));

  }

}
