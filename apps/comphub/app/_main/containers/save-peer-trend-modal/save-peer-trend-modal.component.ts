import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';
import { PeerTrendsApiService } from 'libs/data/payfactors-api/peer/peer-trends-api.service';
import { PfValidators } from 'libs/forms/validators';

import * as fromTrendsSummaryCardActions from '../../actions/trends-summary-card.actions';
import * as fromComphubMainReducer from '../../reducers';

@Component({
  selector: 'pf-save-peer-trend-modal',
  templateUrl: './save-peer-trend-modal.component.html',
  styleUrls: ['./save-peer-trend-modal.component.scss']
})
export class SavePeerTrendModalComponent implements OnInit, OnDestroy {

  showModal$: Observable<boolean>;
  savingPeerTrend$: Observable<AsyncStateObj<boolean>>;
  trendsDomain$: Observable<any>;

  trendsDomainSubscription: Subscription;

  minDate: Date;
  maxDate: Date;
  savePeerTrendForm: FormGroup;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private fb: FormBuilder,
    private peerTrendsApiService: PeerTrendsApiService
  ) {
    this.createForm();
    this.showModal$ = this.store.select(fromComphubMainReducer.getDisplaySavePeerTrendModal);
    this.savingPeerTrend$ = this.store.select(fromComphubMainReducer.getSavingPeerTrend);
    this.trendsDomain$ = this.store.select(fromComphubMainReducer.getPeerTrendsDomain);
  }

  ngOnInit() {
    this.trendsDomainSubscription = this.trendsDomain$.subscribe(x => {
      this.minDate = x.minDate;
      this.maxDate = x.maxDate;
    });
  }

  ngOnDestroy(): void {
    this.trendsDomainSubscription.unsubscribe();
  }

  handleSaveModalDismissed(saveTrend: boolean) {
    if (saveTrend) {

      this.store.dispatch(new fromTrendsSummaryCardActions.SavePeerTrend({
        Name: this.peerTrendNameControl.value,
        MinDate: this.minDate,
        MaxDate: this.maxDate,
        RollForward: this.rollForwardControl.value
      }));
    } else {
      this.store.dispatch(new fromTrendsSummaryCardActions.ToggleSaveTrendModal({displayModal: false}));
    }
  }

  get peerTrendNameControl() { return this.savePeerTrendForm?.get('name'); }

  get rollForwardControl() { return this.savePeerTrendForm.get('rollForward'); }

  createForm() {
    this.savePeerTrendForm = this.fb.group({
      'name': [ '', [PfValidators.required, Validators.minLength(3)], [this.peerTrendNameValidator()] ],
      'rollForward': [ false ]
    });
  }

  peerTrendNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.peerTrendsApiService.checkPeerTrendNameUniqueness(control.value).pipe(
        map(isValid => {
          return isValid !== true ? {
            peerTrendNameExists: 'This peer trend name is already in use'
          } : null;
        })
      );
    };
  }
}
