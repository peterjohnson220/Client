import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';


import * as fromSsoConfigActions from '../../../actions/sso-config.actions';
import * as fromSsoConfigReducers from '../../../reducers';

@Component({
  selector: 'pf-site-admin-sso-config-page',
  templateUrl: './sso-config.page.html',
  styleUrls: ['./sso-config.page.scss'],
  providers: [NgbModalConfig, NgbModal]
})

export class SsoConfigPageComponent implements OnInit, OnDestroy {

  errorMessage: boolean;
  file: any;
  editButtonDisabled: boolean;
  modalType: string;

  public customerConnectionSelected$: Observable<boolean>;

  public customerConnectionSelectedSubscription: Subscription;

  constructor(
    private store: Store<fromSsoConfigReducers.State>,
    ) {
    this.customerConnectionSelected$ = this.store.pipe(select(fromSsoConfigReducers.getCustomerConnectionSelected));
  }

  ngOnInit() {
    this.modalType = 'Add';
    this.store.dispatch(new fromSsoConfigActions.GetSsoConfiguration());

    this.editButtonDisabled = true;

    this.customerConnectionSelectedSubscription = this.customerConnectionSelected$.subscribe( isSelected => {
      this.editButtonDisabled = isSelected ? false : true;
    });
  }

  ngOnDestroy() {
    this.customerConnectionSelectedSubscription.unsubscribe();
  }

  OpenSsoModal() {
    this.store.dispatch(new fromSsoConfigActions.OpenSsoConfigModal());
  }

  SetAddSsoModal(event: Event) {
    event.stopPropagation();
    this.modalType = 'Add';
    this.OpenSsoModal();
  }

  SetEditSsoModal(event: Event) {
    event.stopPropagation();
    this.modalType = 'Edit';
    this.OpenSsoModal();
  }
}
