import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromSharedJobBasedRangeActions from '../../shared/actions/shared.actions';
import * as fromPublishModelModalActions from '../../shared/actions/publish-model-modal.actions';
import { AddJobsModalComponent } from '../containers/add-jobs-modal';
import { Pages } from '../../shared/constants/pages';
import { RangeGroupMetadata } from '../../shared/models';

@Component({
  selector: 'pf-model-page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AddJobsModalComponent, {static: false}) public AddJobsModalComponent: AddJobsModalComponent;

  metaData$: Observable<RangeGroupMetadata>;
  filters: PfDataGridFilter[];
  rangeGroupId: any;
  page = Pages.Model;

  colTemplates = {};
  filter: PfDataGridFilter;

  constructor(
    public store: Store<any>,
    private route: ActivatedRoute
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
  openAddJobsModal(newJobRange = false) {
    this.store.dispatch(new fromSharedJobBasedRangeActions.SetIsNewModelAddJobs(newJobRange));
    this.store.dispatch(new fromAddJobsPageActions.SetContextStructuresRangeGroupId(this.rangeGroupId));
  }

  handlePublishModel() {
    this.store.dispatch(new fromPublishModelModalActions.OpenModal());
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
    const url = this.route.snapshot.url;
    const newJobRange = url && url.length > 0 && url[0].path === 'new';
    if (newJobRange) {
      this.openAddJobsModal(true);
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new pfDataGridActions.Reset());
  }
}

