import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
import { ControlPoint, RangeGroupMetadata } from '../../models';

@Component({
  selector: 'pf-range-distribution-type',
  templateUrl: './range-distribution-type.component.html',
  styleUrls: ['./range-distribution-type.component.scss']
})
export class RangeDistributionTypeComponent implements OnInit, OnDestroy {
  metaData$: Observable<RangeGroupMetadata>;
  controlPointsAsyncObj$: Observable<AsyncStateObj<ControlPoint[]>>;
  savingModelSettingsAsyncObj$: Observable<AsyncStateObj<null>>;
  enableJobRangeTypes$: Observable<boolean>;

  controlPointsAsyncObjSub: Subscription;
  metadataSub: Subscription;

  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  controlPoints: ControlPoint[];
  metadata: RangeGroupMetadata;
  rangeTypeForm: FormGroup;
  enableJobRangeTypes: boolean;
  activeRangeTypeTab: string;
  attemptedSubmit = false;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private settingService: SettingsService
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.controlPointsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getControlPointsAsyncObj));
    this.savingModelSettingsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getSavingModelSettingsAsyncObj));
    this.enableJobRangeTypes$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.EnableJobRangeStructureRangeTypes
    );
  }

  get formControls() {
    return this.rangeTypeForm.controls;
  }

  buildForm() {
    this.rangeTypeForm = new FormGroup({
      'ControlPoint': new FormControl(this.metadata.ControlPoint, [Validators.required]),
      'Minimum': new FormControl(this.metadata.SpreadMin, [Validators.required]),
      'Maximum': new FormControl(this.metadata.SpreadMax, [Validators.required]),
      'RangeDistributionType': new FormControl(this.metadata.RangeDistributionTypeId, [Validators.required])
    });
    this.activeRangeTypeTab = this.metadata.RangeDistributionTypes.find(t => t.Id === this.metadata.RangeDistributionTypeId).Type;
  }

  handleControlPointFilterChange(value: string) {
    this.controlPoints = this.controlPointsAsyncObj.obj.filter(cp => cp.Display.toLowerCase().startsWith(value.toLowerCase()));
  }

  handleControlPointSelectionChange() {
    this.controlPoints = this.controlPointsAsyncObj.obj;
  }

  handleRangeTypeChange(event) {
    this.activeRangeTypeTab = event.Type;
    this.store.dispatch(new fromSharedJobBasedRangeActions.UpdateRangeDistributionType({RangeDistributionTypeId: event.Id}));
  }

  validate() {
    this.attemptedSubmit = true;
  }

  reset() {
    this.attemptedSubmit = false;
  }

  // Lifecycle
  ngOnInit(): void {
    this.store.dispatch(new fromModelSettingsModalActions.GetControlPoints());

    this.subscribe();
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private subscribe() {
    this.controlPointsAsyncObjSub = this.controlPointsAsyncObj$.subscribe(cp => {
      this.controlPointsAsyncObj = cp;
      this.controlPoints = cp.obj;
    });

    this.metadataSub = this.metaData$.subscribe(md => this.metadata = md);
  }

  private unsubscribe() {
    this.controlPointsAsyncObjSub.unsubscribe();
    this.metadataSub.unsubscribe();
  }

}
