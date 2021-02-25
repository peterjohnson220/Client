import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { RangeGroupMetadata } from 'libs/models/structures';
import { AsyncStateObj } from 'libs/models/state';

import { ControlPoint, Currency } from '../../../../shared/models';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';

@Component({
  selector: 'pf-grade-based-model-settings-modal-content',
  templateUrl: './model-settings-modal-content.component.html',
  styleUrls: ['./model-settings-modal-content.component.scss']
})
export class ModelSettingsModalContentComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() modelSettingsForm: FormGroup;
  @Input() modalOpen: boolean;
  @Input() isNewModel: boolean;

  metaData$: Observable<RangeGroupMetadata>;
  modelNameExistsFailure$: Observable<boolean>;
  controlPointsAsyncObj$: Observable<AsyncStateObj<ControlPoint[]>>;
  currenciesAsyncObj$: Observable<AsyncStateObj<Currency[]>>;

  metadataSub: Subscription;
  modelNameExistsFailureSub: Subscription;
  controlPointsAsyncObjSub: Subscription;
  currenciesAsyncObjSub: Subscription;

  metadata: RangeGroupMetadata;
  modelNameExistsFailure: boolean;
  attemptedSubmit: boolean;
  activeRangeTypeTab: string;
  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  currenciesAsyncObj: AsyncStateObj<Currency[]>;
  controlPoints: ControlPoint[];
  controlPointSelection: ControlPoint;
  currencies: Currency[];

  constructor(
    public store: Store<any>,
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.modelNameExistsFailure$ = this.store.pipe(select(fromSharedStructuresReducer.getModelNameExistsFailure));
    this.controlPointsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getControlPointsAsyncObj));
    this.currenciesAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getCurrenciesAsyncObj));
  }

  get formControls() {
    return this.modelSettingsForm.controls;
  }

  clearModelNameExistsFailure() {
    if (this.modelNameExistsFailure) {
      this.store.dispatch(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
    }
  }


  handleRangeTypeChange(event) {
    this.activeRangeTypeTab = event.Type;
  }

  handlePayTypeFilterChange(value: string) {
    this.controlPoints = this.controlPoints.filter(cp => {
      return cp.Display.toLowerCase().startsWith(value.toLowerCase()) ||
        cp.Category.toLowerCase().startsWith(value.toLowerCase());
    });
  }

  handlePayTypeSelectionChange() {
    this.controlPoints = this.controlPointsAsyncObj.obj.filter((ctrlPt, i, arr) => {
      return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
    });
  }

  handleRateSelectionChange(value: string) {
    const roundingPoint = value.toLowerCase() === 'hourly' ? 2 : 0;
    this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingPoints({ RoundingPoint: roundingPoint }));
  }

  handleCurrencyFilterChange(value: string) {
    this.currencies = this.currenciesAsyncObj.obj.filter(cp => {
      return cp.CurrencyCode.toLowerCase().startsWith(value.toLowerCase()) ||
        cp.CurrencyName.toLowerCase().startsWith(value.toLowerCase());
    });
  }

  handleCurrencySelectionChange() {
    this.currencies = this.currenciesAsyncObj.obj;
  }

  // LifeCycle
  ngOnInit(): void {
    this.store.dispatch(new fromModelSettingsModalActions.GetCurrencies());
    this.store.dispatch(new fromModelSettingsModalActions.GetControlPoints());

    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private subscribe() {
    this.metadataSub = this.metaData$.subscribe(md => {
      if (md) {
        this.metadata = md;
        this.activeRangeTypeTab = this.metadata.RangeDistributionTypes.find(t => t.Id === this.metadata.RangeDistributionTypeId).Type;
      }
    });

    this.controlPointsAsyncObjSub = this.controlPointsAsyncObj$.subscribe(cp => {
      this.controlPointsAsyncObj = cp;
      this.controlPoints = cp.obj.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
      });
      this.controlPointSelection = !!this.metadata.ControlPoint ? this.controlPoints.find(point => point.FieldName === this.metadata.ControlPoint) :
        this.controlPoints.find(point => point.FieldName === 'BaseMRP');
    });

    this.currenciesAsyncObjSub = this.currenciesAsyncObj$.subscribe(c => {
      this.currenciesAsyncObj = c;
      this.currencies = c.obj;
    });

    this.modelNameExistsFailureSub = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
  }

  private unsubscribe() {
    this.metadataSub.unsubscribe();
    this.modelNameExistsFailureSub.unsubscribe();
    this.controlPointsAsyncObjSub.unsubscribe();
    this.currenciesAsyncObjSub.unsubscribe();
  }

  private reset() {
    this.attemptedSubmit = false;
  }

}