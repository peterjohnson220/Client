import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PagingOptions } from 'libs/models/payfactors-api/search';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import * as fromAddJobsModalActions from '../actions/add-jobs-modal.actions';
import * as fromJobBasedRangeReducer from '../reducers';
import { AddJobsModalComponent } from '../containers/add-jobs-modal';

@Component({
  selector: 'pf-job-based-range-page',
  templateUrl: './job-based-range.page.html',
  styleUrls: ['./job-based-range.page.scss']
})
export class JobBasedRangePageComponent implements OnInit, AfterViewInit {
  @ViewChild('min', { static: false }) minColumn: ElementRef;
  @ViewChild('mid', { static: false }) midColumn: ElementRef;
  @ViewChild('max', { static: false }) maxColumn: ElementRef;
  @ViewChild(AddJobsModalComponent, {static: false}) public AddJobsModalComponent: AddJobsModalComponent;

  pageTitle$: Observable<string>;
  addJobsModalOpen$: Observable<boolean>;
  defaultPagingOptions: PagingOptions = {
    From: 0,
    Count: 10
  };
  colTemplates = {};
  filter: PfDataGridFilter;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    public route: ActivatedRoute
  ) {
    this.pageTitle$ = this.store.pipe(select(fromJobBasedRangeReducer.getPageTitle));
    this.addJobsModalOpen$ = this.store.select(fromJobBasedRangeReducer.getAddJobsModalOpen);

    this.filter  = {
      SourceName: 'CompanyStructuresRangeGroup_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    };
  }

  // Events
  handleAddJobsClicked() {
    // const setContextMessage: MessageEvent = {
    //   data: {
    //     payfactorsMessage: {
    //       type: 'Set Context',
    //       payload: {
    //         PayMarketId: 0,
    //         ProjectId: 0
    //       }
    //     }
    //   }
    // } as MessageEvent;
    //
    // this.AddJobsModalComponent.onMessage(setContextMessage);
    this.store.dispatch(new fromAddJobsModalActions.OpenAddJobsModal());
  }

  // Lifecycle
  ngOnInit(): void {
    return;
  }

  ngAfterViewInit() {
    this.colTemplates = {
      ['Min']: { Template: this.minColumn },
      ['Mid']: { Template: this.midColumn },
      ['Max']: { Template: this.maxColumn }
    };
  }
}

