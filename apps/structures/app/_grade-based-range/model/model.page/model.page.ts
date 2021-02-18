import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';

import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { StructuresPagesService } from '../../../shared/services';
import { AddJobsModalWrapperComponent } from '../../../shared/containers/add-jobs-modal-wrapper';
import { Workflow } from '../../../shared/constants/workflow';
import { UrlService} from '../../../shared/services';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';


@Component({
  selector: 'pf-model.page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AddJobsModalWrapperComponent) public AddJobsModalComponent: AddJobsModalWrapperComponent;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;

  pageViewIdSubscription: Subscription;
  pageSummaryViewIdSubscription: Subscription;
  rangeGroupId: any;
  modelSummaryPageViewId: string;
  modelGridPageViewId: string;
  filters: PfDataGridFilter[];
  pfThemeType = PfThemeType;
  metadata: RangeGroupMetadata;
  hasCanCreateEditModelStructurePermission: boolean;

  constructor(
    public store: Store<fromSharedStructuresReducer.State>,
    private route: ActivatedRoute,
    private structuresPagesService: StructuresPagesService,
    private urlService: UrlService,
    private permissionService: PermissionService
  ) {
    this.rangeGroupId = this.route.snapshot.params.id;
    this.filters = [{
      SourceName: 'CompanyStructuresRangeGroup_ID',
      Operator: '=',
      Values: [this.route.snapshot.params.id]
    }];
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelGridPageViewId = pv);
    this.pageSummaryViewIdSubscription = this.structuresPagesService.modelSummaryViewId.subscribe(pv => this.modelSummaryPageViewId = pv);
    this.hasCanCreateEditModelStructurePermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_CREATE_EDIT_MODEL],
      PermissionCheckEnum.Single);

  }

  openManageModelModal() {
    this.setSearchContext();
    this.store.dispatch(new fromAddJobsPageActions.SetContextStructuresRangeGroupId(this.rangeGroupId));
  }

  openAddJobsModal() {
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

  ngAfterViewInit(): void {
    if (this.urlService.isInWorkflow(Workflow.NewRange) && this.hasCanCreateEditModelStructurePermission) {
      this.openAddJobsModal();
    }

    if (this.urlService.isInWorkflow(Workflow.CreateModel)) {
      this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
    }
  }

  ngOnDestroy(): void {
    this.pageViewIdSubscription.unsubscribe();
    this.pageSummaryViewIdSubscription.unsubscribe();
    this.metadataSub.unsubscribe();
  }
}
