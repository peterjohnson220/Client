import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import { AddJobsModalWrapperComponent } from '../containers/add-jobs-modal';
import { Pages } from '../../shared/constants/pages';
import { RangeGroupMetadata } from '../../shared/models';
import { UrlService } from '../../shared/services';
import { Workflow } from '../../shared/constants/workflow';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';

@Component({
  selector: 'pf-model-page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AddJobsModalWrapperComponent, {static: false}) public AddJobsModalComponent: AddJobsModalWrapperComponent;

  metaData$: Observable<RangeGroupMetadata>;
  filters: PfDataGridFilter[];
  rangeGroupId: any;
  page = Pages.Model;

  colTemplates = {};
  filter: PfDataGridFilter;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute,
    private urlService: UrlService
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.rangeGroupId = this.route.snapshot.params.id;

    this.filters  = [
      {
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Value: this.rangeGroupId
      },
      {
        SourceName: 'CompanyStructuresRanges_ID',
        Operator: 'notnull',
        Value: ''
      },
      {
        SourceName: 'JobStatus',
        Operator: '=',
        Value: '1'
      }
    ];

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

  // Lifecycle
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rangeGroupId = params['id'];
      // This object must be being attached to the state at a later time since its being marked readonly and needs to be copied
      this.filters = cloneDeep(this.filters);
      this.filters.find(f => f.SourceName === 'CompanyStructuresRangeGroup_ID').Value = this.rangeGroupId;
    });
  }

  ngAfterViewInit(): void {
    if (this.urlService.isInWorkflow(Workflow.NewJobBasedRange)) {
      this.openAddJobsModal();
    }

    if (this.urlService.isInWorkflow(Workflow.CreateModel)) {
      this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new pfDataGridActions.Reset());
  }
}

