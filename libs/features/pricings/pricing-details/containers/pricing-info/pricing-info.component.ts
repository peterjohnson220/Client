import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PricingInfo, PricingInfoDefaultField, CreateProjectRequest } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';

import * as fromPricingDetailsActions from '../../actions';
import * as fromPricingDetailsReducer from '../../reducers';

@Component({
  selector: 'pf-pricing-info',
  templateUrl: './pricing-info.component.html',
  styleUrls: ['./pricing-info.component.scss']
})
export class PricingInfoComponent implements OnInit, OnDestroy {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;

  categories: any;
  enableFileDownloadSecurityWarning = false;
  enableFileDownloadSecurityWarning$: Observable<boolean>;
  enableFileDownloadSecurityWarningSubscription: Subscription;
  permissions = Permissions;
  pricingInfo: PricingInfo;
  pricingInfoSubscription = new Subscription();
  status: string;

  constructor(private store: Store<fromPricingDetailsReducer.State>, private settingsService: SettingsService) {

    this.pricingInfoSubscription = this.store.select(fromPricingDetailsReducer.getPricingInfo).subscribe(pricingInfo => {
      this.pricingInfo = pricingInfo.obj;
      this.status = this.pricingInfo && this.pricingInfo.Status ?
        this.pricingInfo.Status : 'Not Reviewed';
    });

    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit() {
    this.enableFileDownloadSecurityWarningSubscription = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });
  }

  ngOnDestroy() {
    this.enableFileDownloadSecurityWarningSubscription.unsubscribe();
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

  handleExportToExcel() {
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.download();
    }
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.download();
    }
  }

  download() {
    const link = document.createElement('a');
    link.setAttribute('href', `/odata/CompanyJobPricing(${this.pricingInfo.PricingID})/Default.GetPricingModalExport`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
