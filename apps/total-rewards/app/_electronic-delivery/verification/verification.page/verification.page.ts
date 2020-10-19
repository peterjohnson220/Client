import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserContext } from 'libs/models/security';
import { AsyncStateObj } from 'libs/models/state';
import { EmployeeRewardsData, TokenStatus } from 'libs/models/payfactors-api/total-rewards';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import * as fromRootState from 'libs/state/state';

import * as fromPageReducer from '../../verification/reducers';
import * as fromPageActions from '../actions/verification.page.actions';

@Component({
  selector: 'pf-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss']
})
export class VerificationPageComponent implements OnInit {
  @ViewChildren('inputToFocus') inputToFocus: QueryList<ElementRef>;

  userContext$: Observable<UserContext>;
  employeeData$: Observable<EmployeeRewardsData>;
  statement$: Observable<Statement>;
  isValidating$: Observable<boolean>;
  resent$: Observable<boolean>;
  tokenStatus$: Observable<AsyncStateObj<TokenStatus>>;

  readonly VERIFICATION_CODE_LENGTH = 6;
  tokenStatus = TokenStatus;
  currentYear = new Date().getFullYear();
  verificationCode: string;

  constructor(private store: Store<fromPageReducer.State>) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.employeeData$ = this.store.select(fromPageReducer.getEmployeeData);
    this.statement$ = this.store.select(fromPageReducer.getStatement);
    this.tokenStatus$ = this.store.select(fromPageReducer.getTokenStatusAsync);
    this.isValidating$ = this.store.select(fromPageReducer.getIsValidating);
    this.resent$ = this.store.select(fromPageReducer.getResent);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromPageActions.RequestToken({resend: false, suppressEmail: false}));
  }

  validateCode(): void {
    this.store.dispatch(new fromPageActions.ValidateToken(this.verificationCode));
  }

  resend(): void {
    this.store.dispatch(new fromPageActions.RequestToken({resend: true, suppressEmail: false}));
  }
}
