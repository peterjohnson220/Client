import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';

@Component({
  selector: 'pf-pricings-page',
  templateUrl: './pricings.page.html',
  styleUrls: ['./pricings.page.scss']
})
export class PricingsPageComponent implements OnInit, AfterViewInit {
  @ViewChild('source', {static: false}) sourceColumn: ElementRef;
  @ViewChild('jobTitleCode', {static: false}) jobTitleCode: ElementRef;

  modelName$: Observable<string>;
  filter: PfDataGridFilter;
  colTemplates = {};

  constructor(
     private store: Store<fromSharedJobBasedRangeReducer.State>,
     private route: ActivatedRoute
   ) {
    this.modelName$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getModelName));
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
}

