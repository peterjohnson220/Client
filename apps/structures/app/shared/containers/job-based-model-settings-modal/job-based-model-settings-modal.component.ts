import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { PfValidators } from 'libs/forms';

import * as fromSharedStructuresReducer from '../../reducers';
import { SelectedPeerExchangeModel } from '../../models';
import { AbstractModelSettingsModalComponent } from '../model-settings-modal';
import { JobBasedModelSettingsContentComponent } from './job-based-model-settings-content';

@Component({
  selector: 'pf-job-based-model-settings-modal',
  templateUrl: './job-based-model-settings-modal.component.html'
})
export class JobBasedModelSettingsModalComponent extends AbstractModelSettingsModalComponent implements OnInit, OnDestroy {
  @ViewChild(JobBasedModelSettingsContentComponent, { static: false }) protected modelContentComponent: JobBasedModelSettingsContentComponent;

  selectedPeerExchange$: Observable<SelectedPeerExchangeModel>;

  selectedPeerExchangeSubscription: Subscription;

  selectedExchange: SelectedPeerExchangeModel;

  constructor(
    public sharedStore: Store<fromSharedStructuresReducer.State>,
    protected formBuilder: FormBuilder
  ) {
    super(sharedStore);
    this.modalOpen$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getJobModelSettingsModalOpen));
    this.selectedPeerExchange$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getSelectedPeerExchange));
    this.buildForm();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedPeerExchangeSubscription = this.selectedPeerExchange$.subscribe(exchange => this.selectedExchange = exchange);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.selectedPeerExchangeSubscription.unsubscribe();
  }

  protected buildForm() {
    this.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl('', [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl('', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(50)]),
      'PayMarket': new FormControl('', [Validators.required]),
      'Rate': new FormControl('', [Validators.required]),
      'Currency': new FormControl('', [Validators.required]),
      'RangeDistributionSetting': new FormControl(),
      'RangeAdvancedSetting': new FormControl()
    });
  }

  protected updateForm(): void {
    if (!this.metaData || !this.modelSettingsForm) {
      return;
    }
    this.modelSettingsForm.patchValue({
      StructureName: this.metaData.StructureName,
      ModelName: !this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '',
      PayMarket: this.metaData.Paymarket,
      Rate: this.metaData.Rate || 'Annual',
      Currency: this.metaData.Currency || 'USD',
      RangeDistributionSetting: this.metaData.RangeDistributionSetting,
      RangeAdvancedSetting: this.metaData.RangeAdvancedSetting
    });
  }

  protected resetForm(): void {
    this.modelSettingsForm.reset({
      StructureName: this.metaData.StructureName,
      ModelName: !this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '',
      PayMarket: this.metaData.Paymarket,
      Rate: this.metaData.Rate || 'Annual',
      Currency: this.metaData.Currency || 'USD',
      RangeDistributionSetting: this.metaData.RangeDistributionSetting,
      RangeAdvancedSetting: this.metaData.RangeAdvancedSetting
    });
  }
}
