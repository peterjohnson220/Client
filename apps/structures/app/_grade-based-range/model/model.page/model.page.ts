import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';
import { GradeRangeGroupDetails } from 'libs/features/structures/add-jobs-to-range/models';

import * as fromSharedStructuresReducer from '../../../shared/reducers';
import * as fromGradeBasedSharedReducer from '../../shared/reducers';
import { StructuresPagesService } from '../../../shared/services';
import { AddJobsModalWrapperComponent } from '../../../shared/containers/add-jobs-modal-wrapper';
import { Workflow } from '../../../shared/constants/workflow';
import { UrlService } from '../../../shared/services';
import * as fromGradeBasedSharedActions from '../../shared/actions/shared.actions';

@Component({
  selector: 'pf-model.page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements OnInit, OnDestroy {
  @ViewChild(AddJobsModalWrapperComponent) public AddJobsModalComponent: AddJobsModalWrapperComponent;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;
  gradeRangeDetailsSubscription: Subscription;
  pageViewIdSubscription: Subscription;
  pageSummaryViewIdSubscription: Subscription;
  openAddJobsSubscription: Subscription;
  rangeGroupId: any;
  modelSummaryPageViewId: string;
  modelGridPageViewId: string;
  currentUrl: string;
  openAddJobs: boolean;
  filters: PfDataGridFilter[];
  pfThemeType = PfThemeType;
  metadata: RangeGroupMetadata;
  hasCanCreateEditModelStructurePermission: boolean;
  gradeRangeDetails: GradeRangeGroupDetails;
  isNewRangeOrCreateModelFlow = false;

  constructor(
    public store: Store<fromSharedStructuresReducer.State>,
    private route: ActivatedRoute,
    private structuresPagesService: StructuresPagesService,
    private urlService: UrlService,
    private permissionService: PermissionService
  ) {
    this.route.url.subscribe(url => {
      this.currentUrl = url.toString();
      if (this.openAddJobs && this.currentUrl === '') {
        this.handleOpenManageModelModalForNewWorkflow();
      }
    });
    this.rangeGroupId = this.route.snapshot.params.id;
    this.filters = [
      {
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Values: [this.rangeGroupId]
      },
      {
        SourceName: 'CompanyStructuresGrades_ID',
        Operator: 'notnull'
      }];
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelGridPageViewId = pv);
    this.gradeRangeDetailsSubscription = this.store.select(fromGradeBasedSharedReducer.getGradeRangeDetails).subscribe(details => {
      if (details?.obj && details.obj.length > 0) {
        const detailsObj = details.obj[0];
        this.gradeRangeDetails = {
          Intercept: detailsObj.Intercept,
          RangeGroupId: this.rangeGroupId,
          RoundDecimals: 2,
          Slope: detailsObj.Slope,
          RangeDistributionTypeId: detailsObj.RangeDistributionType_ID
        };
      }
    });
    this.pageSummaryViewIdSubscription = this.structuresPagesService.modelSummaryViewId.subscribe(pv => this.modelSummaryPageViewId = pv);
    this.hasCanCreateEditModelStructurePermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_CREATE_EDIT_MODEL],
      PermissionCheckEnum.Single);
    this.isNewRangeOrCreateModelFlow = this.urlService.isInWorkflow(Workflow.NewRange) || this.urlService.isInWorkflow(Workflow.CreateModel);

    this.openAddJobsSubscription = this.store.select(fromGradeBasedSharedReducer.getOpenAddJobs).subscribe(open => {
      if (open && this.currentUrl === '') {
        this.handleOpenManageModelModalForNewWorkflow();
      }
      this.openAddJobs = open;
    });
  }

  openManageModelModal() {
    setTimeout(() => {
      this.setSearchContext();
      this.store.dispatch(new fromAddJobsPageActions.SetContextStructuresRangeGroupId(this.rangeGroupId));
    }, 0);
  }

  handleOpenManageModelModalForNewWorkflow() {
    this.openManageModelModal();
    this.store.dispatch(new fromGradeBasedSharedActions.SetOpenAddJobs(false));
    this.openAddJobs = false;
  }

  private setSearchContext() {
    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {}
        }
      }
    } as MessageEvent;
    this.AddJobsModalComponent.onMessage(setContextMessage);
  }

  ngOnInit(): void {
    this.metadataSub = this.metaData$.subscribe(md => {
      if (md) {
        this.metadata = md;
      }
    });

    // Get grades
    this.store.dispatch(new fromGradeBasedSharedActions.GetGradesDetails(this.rangeGroupId));
  }

  ngOnDestroy(): void {
    this.pageViewIdSubscription.unsubscribe();
    this.pageSummaryViewIdSubscription.unsubscribe();
    this.metadataSub.unsubscribe();
    this.gradeRangeDetailsSubscription.unsubscribe();
    this.openAddJobsSubscription.unsubscribe();
  }
}
