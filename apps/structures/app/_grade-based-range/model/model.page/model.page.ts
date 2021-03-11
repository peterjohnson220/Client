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
  rangeGroupId: any;
  modelSummaryPageViewId: string;
  modelGridPageViewId: string;
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
    this.rangeGroupId = this.route.snapshot.params.id;
    this.filters = [
      {
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Values: [this.route.snapshot.params.id]
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
  }

  openManageModelModal() {
    this.setSearchContext();
    this.store.dispatch(new fromAddJobsPageActions.SetContextStructuresRangeGroupId(this.rangeGroupId));
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
  }

  ngOnDestroy(): void {
    this.pageViewIdSubscription.unsubscribe();
    this.pageSummaryViewIdSubscription.unsubscribe();
    this.metadataSub.unsubscribe();
    this.gradeRangeDetailsSubscription.unsubscribe();
  }
}
