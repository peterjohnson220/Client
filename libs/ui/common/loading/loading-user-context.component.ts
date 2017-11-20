import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromAppState from '../../../../libs/state/state';

@Component({
  selector: 'pf-loading-user-context',
  templateUrl: './loading-user-context.component.html'
})
export class LoadingUserContextComponent {
  gettingUserContext$: Observable<boolean>;

  constructor(
    private store: Store<fromAppState.AppState>
  ) {
    this.gettingUserContext$ = store.select(fromAppState.getGettingUserContext);
  }
}
