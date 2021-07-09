import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { forkJoin, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { delay, filter, take } from 'rxjs/operators';

import { RangeGroupMetadata } from 'libs/models';

import * as fromSharedStructuresReducer from '../../reducers';
import * as fromModelSettingsModalActions from '../../actions/model-settings-modal.actions';
import { JobBasedModelSettingsContentComponent } from './job-based-model-settings-content';
import { SelectedPeerExchangeModel } from '../../models';

@Component({
  selector: 'pf-job-based-model-settings-modal',
  templateUrl: './job-based-model-settings-modal.component.html'
})
export class JobBasedModelSettingsModalComponent implements OnInit {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() isNewModel = true;

  @ViewChild(JobBasedModelSettingsContentComponent, { static: false }) public modelContentComponent: JobBasedModelSettingsContentComponent;

  modalOpen$: Observable<boolean>;
  metaData$: Observable<RangeGroupMetadata>;
  selectedPeerExchange$: Observable<SelectedPeerExchangeModel>;

  metaData: RangeGroupMetadata;
  selectedExchange: SelectedPeerExchangeModel;

  modelSettingsForm: FormGroup;

  constructor(
    public sharedStore: Store<fromSharedStructuresReducer.State>
  ) {
    this.modalOpen$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getJobModelSettingsModalOpen), delay(0));
    this.metaData$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.selectedPeerExchange$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getSelectedPeerExchange));
  }

  ngOnInit(): void {
    forkJoin([this.getMetaDataLoaded(), this.getSelectedPeerExchangeLoaded()]).subscribe(([metaData, selectedExchange]) => {
      this.metaData = metaData;
      this.selectedExchange = selectedExchange;
      this.buildForm();
    });
  }

  handleModalSubmit() {
    this.modelContentComponent.handleModalSubmit();
  }

  handleModelAttemptedSubmit() {
    this.modelContentComponent.handleModalSubmitAttempt();
  }

  handleModalDismissed() {
    this.modelContentComponent.handleModalDismiss();
  }

  handleAdjustMidpointRadioButtonChanged(event: any) {
    this.clearValidators('AdjustMidpointSetting.Percentage');
    if (event.target.id === 'AdjustMidpointMoveBy') {
      this.setValidators('AdjustMidpointSetting.Percentage', 0.01, 300);
    }
  }

  private getMetaDataLoaded(): Observable<RangeGroupMetadata> {
    return this.metaData$.pipe(
      filter(md => !!md),
      take(1)
    );
  }

  private getSelectedPeerExchangeLoaded(): Observable<SelectedPeerExchangeModel> {
    return this.selectedPeerExchange$.pipe(
      filter(spe => !!spe),
      take(1)
    );
  }

  buildForm() {
    this.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl(this.metaData.StructureName, [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl(!this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'PayMarket': new FormControl(this.metaData.Paymarket, [Validators.required]),
      'Rate': new FormControl(this.metaData.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metaData.Currency || 'USD', [Validators.required]),
      'PeerExchange': new FormControl(this.selectedExchange?.ExchangeName || 'Global Network', [Validators.required]),
      'RangeDistributionSetting': new FormControl(this.metaData.RangeDistributionSetting),
      'RangeAdvancedSetting': new FormControl(this.metaData.RangeAdvancedSetting)
    });

    this.sharedStore.dispatch(new fromModelSettingsModalActions.SetActiveTab('modelTab'));
  }

  private setValidators(controlName: string, min: number, max: number) {
    this.modelSettingsForm.get(controlName).enable();
    this.modelSettingsForm.get(controlName).setValidators([Validators.required, Validators.min(min), Validators.max(max)]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  private clearValidators(controlName: string) {
    this.modelSettingsForm.get(controlName).disable();
    this.modelSettingsForm.get(controlName).clearValidators();
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }
}
