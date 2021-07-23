import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';

@Component({
  selector: 'pf-communication-preferences',
  templateUrl: './communication-preferences.component.html',
  styleUrls: ['./communication-preferences.component.scss']
})
export class CommunicationPreferencesComponent implements OnInit {
  userContext$: Observable<UserContext>;

  constructor(private store: Store<fromRootReducer.State>) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  ngOnInit(): void {
  }
}
