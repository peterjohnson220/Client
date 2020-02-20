import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { StructureRangeGroupResponse, generateMockCompanyStructureRangeGroup } from 'libs/models/payfactors-api/structures';
import { AsyncStateObj } from 'libs/models/state';
import { CurrencyDto } from 'libs/models/common';
import { ADD_JOB_PAGE } from 'libs/features/add-jobs/constants/add-jobs-modal.constants';

import * as fromStructuresMainReducer from '../../../reducers';
import { RATE_FIELDS } from '../../../constants/modeling-settings.constants';
import * as fromJobBasedRangesAddJobsModalPageActions from '../../../actions/job-based-ranges-add-jobs-modal-page.actions';
import * as fromModelingSettingsPageActions from '../../../actions/modeling-settings-page.actions';
import { ModelingSettingsFormData } from '../../../models';

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
    private store: Store<fromStructuresMainReducer.State>
  ) {
    this.CurrencyOptions$ = this.store.select(fromStructuresMainReducer.getCurrenciesAsync);
    this.StandardPayElements$ = this.store.select(fromStructuresMainReducer.getStandardPayElementsAsync);
    this.Percentiles$ = this.store.select(fromStructuresMainReducer.getPercentilesAsync);
    this.CreateModelAsync$ = this.store.select(fromStructuresMainReducer.getCreateModelAsync);
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
    this.store.dispatch(new fromJobBasedRangesAddJobsModalPageActions.CloseAddJobsModalPage(ADD_JOB_PAGE.MODEL_SETTINGS));
  }
}
