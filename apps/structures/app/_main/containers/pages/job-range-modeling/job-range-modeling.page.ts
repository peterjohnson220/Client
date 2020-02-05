import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, take } from 'rxjs/operators';

// import { CompanyStructureRangeGroup, generateMockCompanyStructureRangeGroup } from 'libs/models/structures/company-structure-range-group.model';
import { CompanyStructure, generateMockCompanyStructure } from 'libs/models/structures/company-structure.model';

import * as fromStructuresMainReducer from '../../../reducers';
import * as fromJobRangeModelingActions from '../../../actions/job-range-modeling-page.actions';
import * as fromJobRangeModelingModalActions from '../../../actions/job-range-modeling-modal.actions';
import * as fromJobBasedRangesAddJobsModalPageActions from '../../../actions/job-based-ranges-add-jobs-modal-page.actions';
import { JobRangeModelingConstants, JobRangeModelingModalPage } from '../../../constants/structures.constants';
import { EditGridColumnsModalComponent } from '../../../components/modals';

@Component({
  selector: 'pf-job-range-modeling-page',
  templateUrl: './job-range-modeling.page.html',
  styleUrls: ['./job-range-modeling.page.scss']
})
export class JobRangeModelingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(EditGridColumnsModalComponent, {static: true}) public editGridColumnsModalComponent: EditGridColumnsModalComponent;

  // todo: replace temp Ids with routing parameters
  private readonly temp_companyStructureRangeGroupId = 609;
  private readonly routeCompanyStructureId: number;

  public inEditModelNameMode = false;
  public currentModel: any;
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

  public routeStructureName: string;
  public routeModelName: string;
  public routePayMarketId: number;
  public jobRangeModelingPage = JobRangeModelingModalPage;

  private readonly routeProjectId: number = 382652;

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

    this.routeStructureName = this.route.snapshot.queryParams['structure-name'] as string;
    this.routeModelName = this.route.snapshot.queryParams['model-name'] as string;
    // tslint:disable-next-line:no-bitwise
    this.routePayMarketId = (+this.route.snapshot.queryParams['paymarket']) | 0;

    // todo: remove this when job range underlying architecture set
    // tslint:disable-next-line:no-bitwise
    const projectId = (+this.route.snapshot.queryParams['projectId']);
    if (projectId) {
      this.routeProjectId = projectId;
    }
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

    if (this.routeStructureName && this.routeModelName && this.routePayMarketId > 0) {
      const currentModel = { RangeGroupName: '' };
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
    setTimeout(() => {
      if (this.routeStructureName && this.routeModelName && this.routePayMarketId > 0) {
        this.showGenericModalWithAddJobsAsStart(true);
      }
    }, 1);

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
  showGenericModal(startPage: JobRangeModelingModalPage) {
    this.store.dispatch(new fromJobRangeModelingModalActions.OpenModal(startPage));
  }

  showGenericModalWithAddJobsAsStart(isFromAddStructureModal: boolean = false) {
    this.showGenericModal(JobRangeModelingModalPage.AddJobs);

    // note: ProjectId => UserSession_ID in [dbo].[UserSession]
    const jobBasedRangesAddJobsModalPageContext = {
      PayMarketId: this.routePayMarketId,
      ProjectId: this.routeProjectId,
      IsFromAddStructureModal: isFromAddStructureModal
    };

    this.store.dispatch(new fromJobBasedRangesAddJobsModalPageActions.OpenAddJobsModalPage());
    this.store.dispatch(new fromJobBasedRangesAddJobsModalPageActions.SetContext(jobBasedRangesAddJobsModalPageContext));
  }

  ngOnDestroy(): void {
    this.currentModelSubscription.unsubscribe();
    this.currentStructureSubscription.unsubscribe();
    this.companyStructuresAsyncSubscription.unsubscribe();
  }
}
