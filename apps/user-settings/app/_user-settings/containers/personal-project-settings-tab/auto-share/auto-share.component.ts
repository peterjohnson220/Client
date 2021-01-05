import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAutoShareReducer from 'libs/features/users/user-settings/reducers/auto-share.reducer';
import * as fromAutoShareActions from 'libs/features/users/user-settings/actions/auto-share.actions';

@Component({
  selector: 'pf-auto-share',
  templateUrl: './auto-share.component.html',
  styleUrls: ['./auto-share.component.scss']
})
export class AutoShareComponent implements OnInit {

  constructor(private store: Store<fromAutoShareReducer.State>) { }

  ngOnInit(): void {
  }

  handleAddClicked() {
    this.store.dispatch(new fromAutoShareActions.OpenAutoShareModal());
  }
}
