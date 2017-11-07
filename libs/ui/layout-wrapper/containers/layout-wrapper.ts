import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromIdentityActions from '../../../security/app-context/actions/identity.actions';
import * as fromAppContextReducer from '../../../security/app-context/reducers';

@Component({
  selector: 'pf-layout-wrapper',
  templateUrl: './layout-wrapper.html',
  styleUrls: ['./layout-wrapper.scss']
})
export class LayoutWrapperComponent implements OnInit {

  constructor(
    private store: Store<fromAppContextReducer.State>
  ) {}

  ngOnInit() {
    this.store.dispatch(new fromIdentityActions.GetIdentity());
  }
}
