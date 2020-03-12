import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {isEmpty, isString} from 'lodash';

import * as fromSsoConfigActions from '../../../actions/sso-config.actions';
import * as fromSsoConfigReducers from '../../../reducers';
import { AddSsoConfigModalComponent } from '../../add-sso-config-modal';

@Component({
  selector: 'pf-site-admin-sso-config-page',
  templateUrl: './sso-config.page.html',
  styleUrls: ['./sso-config.page.scss'],
  providers: [NgbModalConfig, NgbModal]
})

export class SsoConfigPageComponent implements OnInit {
  @ViewChild(AddSsoConfigModalComponent, { static: true }) public addSsoConfigModalComponent: AddSsoConfigModalComponent;

  errorMessage: boolean;
  file: any;


  constructor(
    private store: Store<fromSsoConfigReducers.State>,
    ) {

  }
  ngOnInit() {
    this.store.dispatch(new fromSsoConfigActions.GetSsoConfiguration());

  }

  OpenAddSsoModal(event: Event) {
    event.stopPropagation();
    this.store.dispatch(new fromSsoConfigActions.OpenAddSsoConfigModal());
  }
}
