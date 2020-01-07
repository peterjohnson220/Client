import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { CompanyStructureRangeGroup, generateMockCompanyStructureRangeGroup } from 'libs/models/structures/company-structure-range-group.model';
import { CompanyStructure, generateMockCompanyStructure } from 'libs/models/structures/company-structure.model';
import { JobBasedRangesAddJobsModalComponent } from 'libs/features/add-jobs/components';

import * as fromStructuresMainReducer from '../../../reducers';
import * as fromJobRangeModelingActions from '../../../actions/job-range-modeling-page.actions';
import * as fromJobBasedRangesAddJobsModalActions from '../../../actions/job-based-ranges-add-jobs-modal.actions';
import { JobRangeModelingConstants } from '../../../constants/structures.constants';
import { EditGridColumnsModalComponent } from '../../../components/modals';

@Component({
  selector: 'pf-job-range-modeling-page',
  templateUrl: './job-range-modeling.page.html',
  styleUrls: ['./job-range-modeling.page.scss']
})
export class JobRangeModelingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(EditGridColumnsModalComponent, {static: true}) public editGridColumnsModalComponent: EditGridColumnsModalComponent;
  @ViewChild(JobBasedRangesAddJobsModalComponent, {static: false}) public jobsBasedRangesAddJobsModalComponent: JobBasedRangesAddJobsModalComponent;

  // todo: replace temp Ids with routing parameters
  private readonly temp_companyStructureRangeGroupId = 609;
  private readonly routeCompanyStructureId: number;

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

  public companyStructuresAsyncSubscription: Subscription;

  public addJobsModalIsSaving$: Observable<boolean>;
  public addJobsModalOpen$: Observable<boolean>;
  public routeStructureName: string;
  public routeModelName: string;
  public routePayMarketId: number;

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

    this.currentStructureSubscription = this.store.select(fromStructuresMainReducer.getCurrentStructure).pipe(
      filter(s => !!s)
    ).subscribe(
      emittedStructure => {
        this.currentStructure = emittedStructure;
        if (this.currentStructure
          && this.currentStructure.StructureName
          && this.currentStructure.StructureName !== this.currentStructureName) {
          this.currentStructureName = this.currentStructure.StructureName;
        }
      }
    );

    this.routeCompanyStructureId = this.route.snapshot.params.id ? +this.route.snapshot.params.id as number : null;

    this.companyStructuresAsyncSubscription = this.store.select(fromStructuresMainReducer.getCompanyStructuresAsync).subscribe(
      emittedStructures => {
        const currentStructure = emittedStructures.obj.find(s => s.CompanyStructuresId === this.routeCompanyStructureId);
        if (currentStructure) {
          this.store.dispatch(new fromJobRangeModelingActions.SetCurrentStructure(currentStructure));
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

    this.addJobsModalOpen$ = this.store.select(fromStructuresMainReducer.getAddJobsModalOpen);

    this.routeStructureName = this.route.snapshot.queryParams['structure-name'] as string;
    this.routeModelName = this.route.snapshot.queryParams['model-name'] as string;
    // tslint:disable-next-line:no-bitwise
    this.routePayMarketId = (+this.route.snapshot.queryParams['paymarket']) | 0;
  }

  editColumnsClicked() {
    this.editGridColumnsModalComponent.open();
  }

  ngOnInit(): void {
    const modelId: number = this.temp_companyStructureRangeGroupId;
    const structureId: number = this.routeCompanyStructureId;

    if (modelId) {
      this.store.dispatch(new fromJobRangeModelingActions.GetModelData(modelId));
    }

    if (structureId) {
      this.store.dispatch(new fromJobRangeModelingActions.GetStructureData(structureId));
    }

    if (this.routeStructureName && this.routeModelName) {
      const currentModel = generateMockCompanyStructureRangeGroup();
      currentModel.RangeGroupName = this.routeModelName;
      const currentStructure = generateMockCompanyStructure();
      currentStructure.StructureName = this.routeStructureName;

      this.store.dispatch(new fromJobRangeModelingActions.SetCurrentModel(currentModel));
      this.store.dispatch(new fromJobRangeModelingActions.SetCurrentStructure(currentStructure));
      this.updateModelName(currentModel.RangeGroupName);
      this.updateNewModelName(currentModel.RangeGroupName);
    }
  }

  ngAfterViewInit() {
    if (this.routeStructureName && this.routeModelName && this.routePayMarketId > 0) {
      this.showAddJobsModal();
    }
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

  // modal functions
  showAddJobsModal() {
    this.store.dispatch(new fromJobBasedRangesAddJobsModalActions.OpenAddJobsModal());
  }

  addJobsModalSaveHandler(data) {
    console.log(`saving add jobs structures modeling modal ${data}`);
  }

  closeAddJobsModal() {
    this.store.dispatch(new fromJobBasedRangesAddJobsModalActions.CloseAddJobsModal());
  }

  ngOnDestroy(): void {
    this.currentModelSubscription.unsubscribe();
    this.currentStructureSubscription.unsubscribe();
    this.companyStructuresAsyncSubscription.unsubscribe();
  }
}
