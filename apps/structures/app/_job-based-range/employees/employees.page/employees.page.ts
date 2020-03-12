import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';

@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent implements OnInit, AfterViewInit {
  modelName$: Observable<string>;
  filter: PfDataGridFilter;

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
     return;
  }
}

