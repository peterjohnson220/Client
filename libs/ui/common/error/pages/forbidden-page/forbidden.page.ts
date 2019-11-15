import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';

import * as fromRootState from 'libs/state/state';



@Component({
  selector: 'pf-forbidden-page',
  templateUrl: './forbidden.page.html',
  styleUrls: ['./forbidden.page.scss']
})
export class ForbiddenPageComponent {
  errorMessage$: Observable<string>;

  constructor(
    private userContextStore: Store<fromRootState.State>
  ) {
    this.errorMessage$ = userContextStore.select(fromRootState.getErrorMessage);
  }
}
