import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import { PageViewIds } from '../../shared/constants/page-view-ids';
import { RangeGroupMetadata } from '../../shared/models';

@Component({
  selector: 'pf-pricings-page',
  templateUrl: './pricings.page.html',
  styleUrls: ['./pricings.page.scss']
})
export class PricingsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('source', {static: false}) sourceColumn: ElementRef;
  @ViewChild('jobTitleCode', {static: false}) jobTitleCode: ElementRef;

  metaData$: Observable<RangeGroupMetadata>;
  filter: PfDataGridFilter;
  colTemplates = {};
  pricingsPageViewId = PageViewIds.Pricings;
  rangeGroupId: any;

  constructor(
     private store: Store<fromSharedJobBasedRangeReducer.State>,
     private route: ActivatedRoute
   ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.rangeGroupId = this.route.parent.snapshot.params.id;
    this.filter = {
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    };
  }

  // Lifecycle
  ngOnInit(): void {
    return;
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      ['Source']: {Template: this.sourceColumn},
      ['Job_Title']: {Template: this.jobTitleCode}
    };
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromPfDataGridActions.Reset());
  }
}

