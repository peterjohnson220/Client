import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromPricingDetailsActions from '../../actions';
import * as fromPricingDetailsReducer from '../../reducers';
import { PricingInfo, PricingInfoDefaultField, CreateProjectRequest } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';

@Component({
  selector: 'pf-pricing-info',
  templateUrl: './pricing-info.component.html',
  styleUrls: ['./pricing-info.component.scss']
})
export class PricingInfoComponent {

  pricingInfo: PricingInfo;

  pricingInfoSubscription = new Subscription();

  permissions = Permissions;

  categories: any;
  status: string;

  constructor(private store: Store<fromPricingDetailsReducer.State>) {

    this.pricingInfoSubscription = this.store.select(fromPricingDetailsReducer.getPricingInfo).subscribe(pricingInfo => {
      this.pricingInfo = pricingInfo.obj;
      this.status = this.pricingInfo && this.pricingInfo.Status ?
        this.pricingInfo.Status : 'Not Reviewed';
    });

  }

  onStatusChanged(event) {
    this.store.dispatch(new fromPricingDetailsActions.StatusChanged(event));
  }

  addToNewProject() {
    const payload: CreateProjectRequest = {
      JobIds: [],
      PricingIds: [this.pricingInfo.PricingID],
      JobPayMarketSelections: []
    };
    this.store.dispatch(new fromPricingDetailsActions.AddingToNewProject(payload));
  }

  getCountWithCategory(fields: PricingInfoDefaultField[], category: string) {
    return fields.filter(d => d.Category === category).length;
  }

  replaceMrpWithValue(category: string) {
    let mrp = '';
    let returnVal = '';
    let refPt = '';
    switch (category) {
      case 'TCC + Allow excl. Car':
        refPt = 'TCCPlusAllowNoCarReferencePoint';
        break;
      case 'TCC + Allow':
        refPt = 'TCCPlusAllowReferencePoint';
        break;
      case 'TCC Target + Allow excl. Car':
        refPt = 'TCCTargetPlusAllowNoCarReferencePoint';
        break;
      case 'TCC Target + Allow':
        refPt = 'TCCTargetPlusAllowReferencePoint';
        break;
      default:
        refPt = category.replace(' ', '').replace('Amt', '') + 'ReferencePoint';
        break;
    }
    mrp = this.pricingInfo.PricingDetails[refPt];
    mrp = mrp ? mrp : '';
    returnVal = mrp + this.addMrpSuffix(mrp);
    return returnVal;
  }

  addMrpSuffix(mrp: string) {

    if (mrp.length === 0) {
      return '';
    }
    let suffix = '';

    switch (mrp[mrp.length - 1]) {
      case '1':
        suffix = 'st';
        break;
      case '2':
        suffix = 'nd';
        break;
      case '3':
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }

    return suffix;
  }

}
