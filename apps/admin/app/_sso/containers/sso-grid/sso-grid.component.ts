import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SsoUrl } from 'libs/constants';
import { SsoConfigModel } from 'libs/models/sso/sso-config.model';
import { SelectedCustomerConnection } from 'libs/models/sso';

import * as fromSsoConfigReducers from '../../reducers';
import * as fromSsoConfigActions from '../../actions';

@Component({
  selector: 'pf-sso-grid',
  templateUrl: './sso-grid.component.html',
  styleUrls: ['./sso-grid.component.scss'],

})

export class SsoGridComponent implements OnInit, OnDestroy {
  @ViewChild('ssoUrlModal', {static: true}) ssoUrlModal: any;

  gridData = [];
  ssoUrl;
  public info: any;
  public modalRef: NgbModalRef;
  selectedCustomerConnection: SelectedCustomerConnection;
  public selectableSettings = { mode: 'single'};

  getSsoGridData$: Observable<SsoConfigModel[]>;

  getSsoGridDataSubscription: Subscription;

  constructor(
    private store: Store<fromSsoConfigReducers.State>,
    private modalService: NgbModal
  ) {

    this.getSsoGridData$ = this.store.select(fromSsoConfigReducers.getSsoConfigList);
  }

  ngOnInit(): void {
    this.getSsoGridDataSubscription = this.getSsoGridData$.subscribe(listData => {
      this.gridData = listData;
    });
  }

  ngOnDestroy(): void {
  this.getSsoGridDataSubscription.unsubscribe();
  }

  displaySsoUrl({dataItem}) {
    const idpId = dataItem.IdpId;
    this.ssoUrl = `${SsoUrl.SSO_URL}${idpId}`;
    this.open();
  }

  gridSelectionChange(event) {
    if (event.selectedRows.length > 0) {
      const selectedDataItem = event.selectedRows[0].dataItem;
      this.selectedCustomerConnection = {
        CompanyName: selectedDataItem.CompanyName,
        CompanyId: selectedDataItem.CompanyId,
        EmailDomain: selectedDataItem.EmailDomain,
        IdpId: selectedDataItem.IdpId,
        MetadataFile: null,
        SsoLogOutUrl: selectedDataItem.SsoLogOutUrl,
        Certificate: null
      };
      this.store.dispatch(new fromSsoConfigActions.CustomerConnectionSelected(this.selectedCustomerConnection));
    } else {
      this.store.dispatch(new fromSsoConfigActions.CustomerConnectionUnselected());
    }
  }

  open() {
    this.modalRef = this.modalService.open(this.ssoUrlModal, { backdrop: 'static', size: 'lg' });

  }

}
