import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { PayMarket, PayMarketCut } from 'libs/models/paymarket';
import { AsyncStateObj } from 'libs/models/state';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromPayMarketDefaultSettingsActions from '../../../actions/paymarket-default-settings.actions';

@Component({
  selector: 'pf-pay-market-cut',
  templateUrl: './pay-market-cut.component.html',
  styleUrls: ['./pay-market-cut.component.scss']
})
export class PayMarketCutComponent implements OnChanges, OnInit, OnDestroy {
  @Input() payMarket: PayMarket;

  payMarketCuts$: Observable<AsyncStateObj<PayMarketCut[]>>;

  payMarketCutsSubscription: Subscription;

  gridHeaderStyle = {
    'background-color': '#fff',
    'font-weight': '500'
  };

  isEditingCutValue: boolean;
  payMarketCuts: PayMarketCut[];
  defaultMarketCuts: PayMarketCut[];
  defaultSecondWeight = 0;
  defaultTopWeight = 100;
  defaultAdjustment = 0;

  constructor(
    private store: Store<fromUserSettingsReducer.State>
  ) {
    this.payMarketCuts$ = this.store.pipe(select(fromUserSettingsReducer.getPayMarketCuts));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.payMarket?.currentValue?.CompanyPayMarketId) {
      const payMarketId = changes.payMarket.currentValue.CompanyPayMarketId;
      this.store.dispatch(new fromPayMarketDefaultSettingsActions.GetPayMarketCuts({ payMarketId }));
    } else if (changes?.payMarket?.previousValue) {
      this.store.dispatch(new fromPayMarketDefaultSettingsActions.ClearPayMarketCuts());
    }
  }

  ngOnInit(): void {
    this.payMarketCutsSubscription = this.payMarketCuts$.subscribe(asyncObj => {
      if (!asyncObj?.loading && !asyncObj?.saving && asyncObj?.obj) {
        this.payMarketCuts = cloneDeep(asyncObj.obj);
        this.isEditingCutValue = false;
        this.buildDefaultPayMarketCuts();
      }
    });
  }

  ngOnDestroy(): void {
    this.payMarketCutsSubscription.unsubscribe();
  }

  handlePayMarketCutValueChange(value: number): void {
    this.isEditingCutValue = !!value;
  }

  onBlur(payMarketCut: PayMarketCut): void {
    if (!payMarketCut.Weight) {
      payMarketCut.Weight = 0;
    }
    if (!payMarketCut.Adjustment) {
      payMarketCut.Adjustment = 0;
    }
  }

  resetToDefault(): void {
    this.payMarketCuts = this.defaultMarketCuts;
    this.isEditingCutValue = true;
  }

  handleSaveClicked(): void {
    this.store.dispatch(new fromPayMarketDefaultSettingsActions.SavePayMarketCuts({
      payMarketId: this.payMarket.CompanyPayMarketId,
      dataCuts: this.payMarketCuts
    }));
    this.isEditingCutValue = false;
  }

  private buildDefaultPayMarketCuts(): void {
    if (!this.payMarketCuts?.length) {
      return;
    }
    const payMarketCutsClone: PayMarketCut[] = cloneDeep(this.payMarketCuts);
    const maxDisplayIndex = payMarketCutsClone.length - 1;
    this.buildDefaultWeights(payMarketCutsClone.length);
    this.defaultMarketCuts = payMarketCutsClone.map((cut) => {
      cut.Weight = cut.DisplayOrder === 0
        ? this.defaultTopWeight
        : cut.DisplayOrder < maxDisplayIndex ? this.defaultSecondWeight : 0;
      cut.Adjustment = 0;
      return cut;
    });
  }

  /* This function is migrated from usersettings ASP page with the comment below:
    [GL] This function will reset any user entered values for weight/adj back to the default of the pay market (based on scope)
    These values come from the table valued function GetMDCutRows and each default value is based on the number of MD cuts returned for the
    pay market (scope/industry/size/geo)*/
  private buildDefaultWeights(cutsCount: number): void {
    switch (cutsCount) {
      case 6: {
        this.defaultTopWeight = 80;
        this.defaultSecondWeight = 5;
        break;
      }
      case 5: {
        this.defaultTopWeight = 85;
        this.defaultSecondWeight = 5;
        break;
      }
      case 4: {
        this.defaultTopWeight = 80;
        this.defaultSecondWeight = 10;
        break;
      }
      case 3: {
        this.defaultTopWeight = 90;
        this.defaultSecondWeight = 10;
        break;
      }
      default: {
        this.defaultTopWeight = 100;
        this.defaultSecondWeight = 0;
        break;
      }
    }
  }
}
