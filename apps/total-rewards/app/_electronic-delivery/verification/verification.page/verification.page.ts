import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
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
export class VerificationPageComponent implements OnInit, OnDestroy {
  @ViewChildren('inputToFocus') inputToFocus: QueryList<ElementRef>;

  userContext$: Observable<UserContext>;
  employeeData$: Observable<EmployeeRewardsData>;
  statement$: Observable<Statement>;
  isValidating$: Observable<boolean>;
  resent$: Observable<boolean>;
  tokenStatus$: Observable<AsyncStateObj<TokenStatus>>;
  lockedUntil$: Observable<Date>;

  lockedUntilSub: Subscription;

  readonly VERIFICATION_CODE_LENGTH = 6;
  tokenStatus = TokenStatus;
  currentYear = new Date().getFullYear();
  lockedUntil: Date;
  verificationCode: string;

  constructor(private store: Store<fromPageReducer.State>) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.employeeData$ = this.store.select(fromPageReducer.getEmployeeData);
    this.statement$ = this.store.select(fromPageReducer.getStatement);
    this.tokenStatus$ = this.store.select(fromPageReducer.getTokenStatusAsync);
    this.isValidating$ = this.store.select(fromPageReducer.getIsValidating);
    this.resent$ = this.store.select(fromPageReducer.getResent);
    this.lockedUntil$ = this.store.select(fromPageReducer.getLockedUntil);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromPageActions.RequestToken({resend: false, suppressEmail: false}));
    this.lockedUntilSub = this.lockedUntil$.subscribe(x => {
      if (!!x) {
        this.lockedUntil = new Date(x);
      }
    });
  }

  ngOnDestroy() {
    this.lockedUntilSub.unsubscribe();
  }

  validateCode(): void {
    this.store.dispatch(new fromPageActions.ValidateToken(this.verificationCode));
  }

  resend(): void {
    this.store.dispatch(new fromPageActions.RequestToken({resend: true, suppressEmail: false}));
  }

  get lockedUntilTimeLeft(): number {
    const currentDate = new Date();
    return this.differenceInMinutes(currentDate, this.lockedUntil) !== 0 ?
    this.differenceInMinutes(currentDate, this.lockedUntil) : 1;
  }

  private differenceInMinutes(firstDate: Date, secondDate: Date): number {
    let diff = (secondDate.getTime() - firstDate.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }
}
