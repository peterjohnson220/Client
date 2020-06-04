import { Component } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromSharedReducer from '../../../../shared/reducers';

@Component({
  selector: 'pf-hospitality-signup-success-page',
  templateUrl: './hospitality-signup-success.page.html',
  styleUrls: ['./hospitality-signup-success.page.scss']
})
export class HospitalitySignupSuccessPageComponent {
  payfactorsLogo = './assets/payfactors-transparent.png';

  submitFormIsError$: Observable<boolean>;
  submitFormMessage$: Observable<string>;

  constructor(private store: Store<fromSharedReducer.State>) {
    this.submitFormIsError$ = this.store.pipe(
      select(fromSharedReducer.getSubmittingFormAsyncObj),
      map(asyncObj => !!asyncObj.obj ? asyncObj.obj.IsError : false)
    );
    this.submitFormMessage$ = this.store.pipe(
      select(fromSharedReducer.getSubmittingFormAsyncObj),
      map(asyncObj => !!asyncObj.obj ? asyncObj.obj.Message : null)
    );
  }
}
