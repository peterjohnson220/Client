import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import * as pfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';
import { DataViewEntity } from 'libs/models/payfactors-api/reports/request';
import * as fromFormulaFieldActions from 'libs/ui/formula-editor/actions/formula-field.actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import { UrlService} from '../../../shared/services';
import { Workflow } from '../../../shared/constants/workflow';
import * as fromSharedActions from '../../../shared/actions/shared.actions';
import * as fromCompareJobRangesActions from '../../model/actions';
import { StructuresPagesService } from '../../../shared/services';
import { AddJobsModalWrapperComponent } from '../../../shared/containers/add-jobs-modal-wrapper';

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
  comparingFlag: boolean;
  comparingSub: Subscription;
  metadataSub: Subscription;
  metadata: RangeGroupMetadata;
  baseEntity: DataViewEntity;
  baseEntitySub: Subscription;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute,
    private sharedJobBasedStore: Store<fromSharedJobBasedRangeReducer.State>,
    private sharedStructuresStore: Store<fromSharedStructuresReducer.State>,
    private urlService: UrlService,
    private permissionService: PermissionService,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metaData$ = this.sharedStructuresStore.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.rangeGroupId = this.route.snapshot.params.id;

    this.filters = [
      {
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Values: [this.rangeGroupId]
      },
      {
        SourceName: 'JobStatus',
        Operator: '=',
        Values: ['1']
      }
    ];

    this.hasCanCreateEditModelStructurePermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_CREATE_EDIT_MODEL],
      PermissionCheckEnum.Single);

    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.comparingSub = this.sharedJobBasedStore.select(fromSharedStructuresReducer.getComparingModels).subscribe(flag => this.comparingFlag = flag);
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

  handleCompareModelClicked() {
    this.store.dispatch(new pfDataGridActions.ResetGridScrolled(this.pageViewId));
    this.store.dispatch(new pfDataGridActions.LoadData(this.pageViewId));
    this.sharedJobBasedStore.dispatch(new fromCompareJobRangesActions.GetDataForCompare(this.pageViewId));
  }

  // Lifecycle
  ngOnInit(): void {
    this.comparingFlag = false;
    this.route.params.subscribe((params) => {
      this.rangeGroupId = params['id'];
      // This object must be being attached to the state at a later time since its being marked readonly and needs to be copied
      this.filters = cloneDeep(this.filters);
      this.filters.find(f => f.SourceName === 'CompanyStructuresRangeGroup_ID').Values = [this.rangeGroupId];
    });
    this.metadataSub = this.metaData$.subscribe(md => {
      if (md) {
        this.metadata = md;
      }
    });
    this.baseEntitySub = this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, this.pageViewId)).subscribe(be => {
      if (be) {
        this.baseEntity = be;
        if (!!this.metadata.RangeDistributionSetting && !!this.metadata.RangeDistributionSetting.Mid_Formula) {
          this.store.dispatch(new fromFormulaFieldActions.ValidateFormula({
            formula: this.metadata.RangeDistributionSetting.Mid_Formula.Formula,
            baseEntityId: this.baseEntity.Id,
            formulaFieldId: 'Mid'
          }));
        }
      }
    });

    this.store.dispatch(new fromSharedActions.GetDistinctOverrideMessages(this.rangeGroupId));
  }

  ngAfterViewInit(): void {
    if (this.urlService.isInWorkflow(Workflow.NewRange) && this.hasCanCreateEditModelStructurePermission) {
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

    // Get current range group
    this.store.dispatch(new fromSharedActions.GetCurrentRangeGroup({
      RangeGroupId: this.rangeGroupId,
      PaymarketId: this.metadata.PaymarketId,
      PayType: this.metadata.PayType
    }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new pfDataGridActions.Reset());
    this.pageViewIdSubscription.unsubscribe();
    this.comparingSub.unsubscribe();
    this.metadataSub.unsubscribe();
    this.baseEntitySub.unsubscribe();
  }
}
