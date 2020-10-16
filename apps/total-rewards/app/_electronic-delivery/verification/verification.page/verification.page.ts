import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { KeyboardKeys } from 'libs/constants';
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

  tokenStatus = TokenStatus;
  verificationInputForm: FormGroup;
  maxInputLength: number[];
  focusNextInput: boolean;
  currentYear = new Date().getFullYear();
  specialKeys = [
    KeyboardKeys.SHIFT,
    KeyboardKeys.ESCAPE,
  ];

  constructor(private fb: FormBuilder, private store: Store<fromPageReducer.State>) {
    this.maxInputLength = Array(6).fill(0).map((x, i) => i);
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.employeeData$ = this.store.select(fromPageReducer.getEmployeeData);
    this.statement$ = this.store.select(fromPageReducer.getStatement);
    this.tokenStatus$ = this.store.select(fromPageReducer.getTokenStatusAsync);
    this.isValidating$ = this.store.select(fromPageReducer.getIsValidating);
    this.resent$ = this.store.select(fromPageReducer.getResent);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.store.dispatch(new fromPageActions.RequestToken({resend: false, suppressEmail: false}));
  }

  initializeForm(): void {
    this.verificationInputForm = this.fb.group({
      inputs: this.fb.group({
        input0: '',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
      })
    });
  }

  highlightValue(index: number): void {
    if (index <= this.maxInputLength.length - 1) {
      this.inputToFocus.toArray()[index].nativeElement?.select();
    }
  }

  handleKeyUp(e: KeyboardEvent, index: number): void {
    this.focusNextInput = this.handleFocusNextInput(e);
    if (this.inputToFocus.toArray().length - 1 !== index && this.focusNextInput && index <= this.maxInputLength.length - 1) {
      this.inputToFocus.toArray()[index + 1].nativeElement.focus();
      this.inputToFocus.toArray()[index + 1].nativeElement.select();
    }
  }

  validateCode(): void {
    this.store.dispatch(new fromPageActions.ValidateToken(this.getCodeInput()));
  }

  private getCodeInput(): string {
    // lol. Will be removed after inputs are put together
    const inputDetails = this.verificationInputForm.getRawValue().inputs;
    return `${inputDetails.input0}${inputDetails.input1}${inputDetails.input2}${inputDetails.input3}${inputDetails.input4}${inputDetails.input5}`;
  }

  get disableButton(): boolean {
    const inputs = this.verificationInputForm.value.inputs;
    return Object.keys(inputs).map(i => inputs[i]).includes('');
  }

  private handleFocusNextInput(e: KeyboardEvent): boolean {
    const hasValue = !!(e.target as HTMLInputElement).value;
    const containsSpecialKey = this.specialKeys.findIndex(x => x.toString() === e.key) !== -1;
    return hasValue && !containsSpecialKey;
  }
}
