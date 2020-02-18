import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { StructureRangeGroupResponse, generateMockCompanyStructureRangeGroup } from 'libs/models/payfactors-api/structures';
import { AsyncStateObj } from 'libs/models/state';
import { CurrencyDto } from 'libs/models/common';
import * as fromAddJobsModalActions from 'libs/features/add-jobs/actions/modal.actions';

import { RATE_FIELDS } from '../../constants/modeling-settings.constants';
import { ModelingSettingsFormData } from '../../models';
import * as fromJobBasedRangeReducer from '../../reducers';
import * as fromModelingSettingsPageActions from '../../actions/modeling-settings-page.actions';

@Component({
  selector: 'pf-modeling-settings-modal-page',
  templateUrl: './modeling-settings-modal-page.component.html',
  styleUrls: ['./modeling-settings-modal-page.component.scss']
})
export class ModelingSettingsModalPageComponent implements OnInit {
  _RATE_FIELDS = RATE_FIELDS;
  currentModel: StructureRangeGroupResponse;
  currentModelingSettingsData: ModelingSettingsFormData = {};
  submitting = false;
  submitDisabled = false;
  CurrencyOptions$: Observable<AsyncStateObj<CurrencyDto[]>>;
  StandardPayElements$: Observable<AsyncStateObj<string[]>>;
  Percentiles$: Observable<AsyncStateObj<string[]>>;
  CreateModelAsync$: Observable<AsyncStateObj<StructureRangeGroupResponse>>;

  constructor(
    private store: Store<fromJobBasedRangeReducer.State>
  ) {
    this.CurrencyOptions$ = this.store.select(fromJobBasedRangeReducer.getCurrenciesAsync);
    this.StandardPayElements$ = this.store.select(fromJobBasedRangeReducer.getStandardPayElementsAsync);
    this.Percentiles$ = this.store.select(fromJobBasedRangeReducer.getPercentilesAsync);
    this.CreateModelAsync$ = this.store.select(fromJobBasedRangeReducer.getCreateModelAsync);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromModelingSettingsPageActions.GetModelingSettingsOptions());
  }

  handleModel(): void {
    this.submitting = true;
    const mockModel = generateMockCompanyStructureRangeGroup();
    this.store.dispatch(new fromModelingSettingsPageActions.CreateModel(mockModel));
  }

  handleClose(): void {
    this.store.dispatch(new fromAddJobsModalActions.CloseAddJobsModal());
  }
}
