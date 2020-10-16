import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';
import { AddJobsModalWrapperComponent } from '../containers/add-jobs-modal';
import { StructuresPagesService, UrlService } from '../../shared/services';
import { Workflow } from '../../shared/constants/workflow';
import * as fromSharedActions from '../../shared/actions/shared.actions';

@Component({
  selector: 'pf-model-page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AddJobsModalWrapperComponent) public AddJobsModalComponent: AddJobsModalWrapperComponent;

  metaData$: Observable<RangeGroupMetadata>;
  filters: PfDataGridFilter[];
  rangeGroupId: any;

  colTemplates = {};
  filter: PfDataGridFilter;
  hasCanCreateEditModelStructurePermission: boolean;

  pageViewId: string;
  pageViewIdSubscription: Subscription;
  _Permissions = null;
  compareModelFilters: DataViewFilter[];
  comparingFlag: boolean;
  comparingSub: Subscription;
  metadataSub: Subscription;
  metadata: RangeGroupMetadata;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute,
    private sharedStore: Store<fromSharedJobBasedRangeReducer.State>,
    private urlService: UrlService,
    private permissionService: PermissionService,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.rangeGroupId = this.route.snapshot.params.id;

    this.filters = [
      {
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Value: this.rangeGroupId
      },
      {
        SourceName: 'JobStatus',
        Operator: '=',
        Value: '1'
      }
    ];

    this.hasCanCreateEditModelStructurePermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_CREATE_EDIT_MODEL],
      PermissionCheckEnum.Single);

    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.comparingSub = this.sharedStore.select(fromSharedJobBasedRangeReducer.getComparingModels).subscribe(flag => {
      this.comparingFlag = flag;
    })
    this._Permissions = Permissions;
  }

  // Events
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

  handleCompareModelClicked(currentRangeGroupId) {
    this.compareModelFilters = [
      {
        EntitySourceName: 'CompanyStructures_RangeGroup',
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Values: [currentRangeGroupId]
      },
      {
        EntitySourceName: 'CompanyJobs',
        SourceName: 'JobStatus',
        Operator: '=',
        Values: [1]
      }
    ];

    this.sharedStore.dispatch(new fromSharedActions.GetDataByRangeGroupId({
      pageViewId: this.pageViewId,
      filters: this.compareModelFilters
    }));
  }

  // Lifecycle
  ngOnInit(): void {
    this.comparingFlag = false;
    this.route.params.subscribe((params) => {
      this.rangeGroupId = params['id'];
      // This object must be being attached to the state at a later time since its being marked readonly and needs to be copied
      this.filters = cloneDeep(this.filters);
      this.filters.find(f => f.SourceName === 'CompanyStructuresRangeGroup_ID').Value = this.rangeGroupId;
    });
    this.metadataSub = this.metaData$.subscribe( md => {
      if (md) {
        this.metadata = md;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.urlService.isInWorkflow(Workflow.NewJobBasedRange) && this.hasCanCreateEditModelStructurePermission) {
      this.openAddJobsModal();
    }

    if (this.urlService.isInWorkflow(Workflow.CreateModel)) {
      this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
    }

    // Get all overridden ranges
    this.store.dispatch(new fromSharedActions.GetOverriddenRanges({
      pageViewId: this.pageViewId,
      rangeGroupId: this.rangeGroupId
    }));
    this.store.dispatch(new fromSharedActions.GetCurrentRangeGroup({
      RangeGroupId: this.rangeGroupId,
      PaymarketId: this.metadata.PaymarketId,
      Rate: this.metadata.Rate
    }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new pfDataGridActions.Reset());
    this.pageViewIdSubscription.unsubscribe();
    this.comparingSub.unsubscribe();
    this.metadataSub.unsubscribe();
  }
}
