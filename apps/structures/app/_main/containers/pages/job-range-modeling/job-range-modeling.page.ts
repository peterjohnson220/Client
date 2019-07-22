import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { CompanyStructureRangeGroup } from 'libs/models/structures/company-structure-range-group.model';
import { CompanyStructure } from 'libs/models/structures/company-structure.model';

import * as fromStructuresMainReducer from '../../../reducers';
import * as fromJobRangeModelingActions from '../../../actions/job-range-modeling-page.actions';
import { JobRangeModelingConstants } from '../../../constants/structures.constants';

@Component({
  selector: 'pf-job-range-modeling-page',
  templateUrl: './job-range-modeling.page.html',
  styleUrls: ['./job-range-modeling.page.scss']
})
export class JobRangeModelingPageComponent implements OnInit, OnDestroy {
  // todo: replace temp Ids with routing parameters
  private readonly temp_companyStructureId = 121;
  private readonly temp_companyStructureRangeGroupId = 609;

  public inEditModelNameMode = false;
  public currentModel: CompanyStructureRangeGroup;
  public currentStructure: CompanyStructure;
  public currentModelName: string;
  public currentStructureName: string;
  public newModelName: string;
  public isEditModelNameLoading$: Observable<boolean>;
  public currentModelSubscription: Subscription;
  public currentStructureSubscription: Subscription;
  public editModelNameErrorSubscription: Subscription;
  public editModelNameError: string;

  constructor(public route: ActivatedRoute,
              private store: Store<fromStructuresMainReducer.State>) {
    this.currentModelSubscription = this.store.select(fromStructuresMainReducer.getCurrentModel).subscribe(
      emittedModel => {
        this.currentModel = emittedModel;
        if (this.currentModel
          && this.currentModel.RangeGroupName
          && this.currentModel.RangeGroupName !== this.currentModelName) {
          this.updateCurrentModelName(this.currentModel.RangeGroupName);
          this.updateNewModelName(this.currentModel.RangeGroupName);
        }
      });

    this.currentStructureSubscription = this.store.select(fromStructuresMainReducer.getCurrentStructure).subscribe(
      emittedStructure => {
        this.currentStructure = emittedStructure;
        if (this.currentStructure
          && this.currentStructure.StructureName
          && this.currentStructure.StructureName !== this.currentStructureName) {
          this.currentStructureName = this.currentStructure.StructureName;
        }
      }
    );

    this.isEditModelNameLoading$ = this.store.select(fromStructuresMainReducer.getIsEditModelNameLoading);

    this.editModelNameErrorSubscription = this.store.select(fromStructuresMainReducer.getEditModelNameError).subscribe(
      emittedEditModelNameError => {
        this.editModelNameError = emittedEditModelNameError;
        if (this.currentModel && this.currentModel.RangeGroupName) {
          this.updateCurrentModelName(this.currentModel.RangeGroupName);
          this.updateNewModelName(this.currentModel.RangeGroupName);
        }

        if (emittedEditModelNameError) {
          timer(JobRangeModelingConstants.MODEL_NAME_UPDATE_ERROR_TIMEOUT).pipe(
            take(1)
          ).subscribe(tick => {
            this.store.dispatch(new fromJobRangeModelingActions.ClearEditModelNameError());
          });
        }
      }
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id ? this.route.snapshot.params.id : 'No ID Passed';

    const modelId: number = this.temp_companyStructureRangeGroupId;
    const structureId: number = this.temp_companyStructureId;

    this.store.dispatch(new fromJobRangeModelingActions.GetModelData(modelId));
    this.store.dispatch(new fromJobRangeModelingActions.GetStructureData(structureId));
  }

  updateModelName(modelName: string) {
    this.store.dispatch(new fromJobRangeModelingActions.UpdateCurrentCompanyStructureRangeGroupName(
      {
        CompanyStructuresRangeGroupId: this.currentModel.CompanyStructuresRangeGroupId,
        RangeGroupName: modelName
      }
    ));
  }

  updateNewModelName(modelName: string) {
    this.newModelName = modelName;
  }

  updateCurrentModelName(modelName: string) {
    if (modelName) {
      this.currentModelName = modelName;
    }
  }

  ngOnDestroy(): void {
    this.currentModelSubscription.unsubscribe();
    this.currentStructureSubscription.unsubscribe();
  }
}
