import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import cloneDeep from 'lodash/cloneDeep';

import { PfValidators } from 'libs/forms';
import { AsyncStateObj, CompanyStructure, PayMarket, StructureForm } from 'libs/models';
import { RangeDistributionType } from 'libs/models/payfactors-api';
import { RangeType } from 'libs/constants/structures/range-type';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';

import * as fromStructuresPageReducer from '../../reducers';
import * as fromStructuresPageActions from '../../actions/structures-page.actions';

@Component({
  selector: 'pf-structure-form',
  templateUrl: './structure-form.component.html',
  styleUrls: ['./structure-form.component.scss']
})
export class StructureFormComponent implements OnInit, OnDestroy {
  showStructureForm$: Observable<boolean>;
  saving$: Observable<boolean>;
  savingErrorMessage$: Observable<string>;
  payMarkets$: Observable<AsyncStateObj<PayMarket[]>>;
  structures$: Observable<AsyncStateObj<CompanyStructure[]>>;
  rangeDistributionTypes$: Observable<AsyncStateObj<RangeDistributionType[]>>;

  showStructureFormSubscription: Subscription;
  rangeDistributionTypesSubscription: Subscription;

  structureForm: FormGroup;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  rangeTypes = RangeType;
  isGradeBasedRangeDistributionTypesEnabled: boolean;
  defaultRangeDistributionType: RangeDistributionType;
  selectedRangeDistributionType: RangeDistributionType;

  constructor(
    private structuresStore: Store<fromStructuresPageReducer.State>,
    private formBuilder: FormBuilder,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.showStructureForm$ = this.structuresStore.select(fromStructuresPageReducer.getShowStructureForm);
    this.saving$ = this.structuresStore.select(fromStructuresPageReducer.getSavingStructure);
    this.savingErrorMessage$ = this.structuresStore.select(fromStructuresPageReducer.getSavingStructureErrorMessage);
    this.payMarkets$ = this.structuresStore.select(fromStructuresPageReducer.getCompanyPayMarkets);
    this.structures$ = this.structuresStore.select(fromStructuresPageReducer.getCompanyStructures);
    this.rangeDistributionTypes$ = this.structuresStore.select(fromStructuresPageReducer.getRangeDistributionTypes);
    this.isGradeBasedRangeDistributionTypesEnabled = this.featureFlagService.enabled(FeatureFlags.StructuresGradeBasedRangeDistributionTypes, false);
  }

  ngOnInit(): void {
    this.structuresStore.dispatch(new fromStructuresPageActions.LoadCompanyStructures());
    this.structuresStore.dispatch(new fromStructuresPageActions.LoadRangeDistributionTypes());
    this.showStructureFormSubscription = this.showStructureForm$.subscribe(isOpen => {
      if (!isOpen) {
        this.resetForm();
      }
    });
    this.rangeDistributionTypesSubscription = this.rangeDistributionTypes$.subscribe(asyncObj => {
      if (!asyncObj?.loading && asyncObj?.obj?.length) {
        this.defaultRangeDistributionType = asyncObj.obj[0];
        this.selectedRangeDistributionType = asyncObj.obj[0];
      }
    });
    this.createForm();
  }

  ngOnDestroy(): void {
    this.showStructureFormSubscription.unsubscribe();
    this.rangeDistributionTypesSubscription.unsubscribe();
  }

  get f() { return this.structureForm.controls; }

  onDismiss(): void {
    this.structuresStore.dispatch(new fromStructuresPageActions.ShowStructureForm(false));
  }

  onSubmit(): void {
    const formData: StructureForm = cloneDeep(this.structureForm.getRawValue());
    formData.RangeDistributionTypeId = this.selectedRangeDistributionType?.Id ?? 1;
    this.structuresStore.dispatch(new fromStructuresPageActions.CreateStructure(formData));
  }

  private createForm(): void {
    this.structureForm = this.formBuilder.group({
      RangeTypeId: [null, [Validators.required]],
      StructureName: ['', [
        PfValidators.required,
        PfValidators.maxLengthTrimWhitespace(500)]],
      ModelName: ['', [Validators.required]],
      PaymarketId: [null, [Validators.required]]
    });
  }

  private resetForm(): void {
    if (!this.structureForm) {
      return;
    }
    this.structureForm.reset({
      RangeTypeId: null,
      StructureName: '',
      ModelName: '',
      PaymarketId: null
    });
    this.selectedRangeDistributionType = this.defaultRangeDistributionType;
  }
}
