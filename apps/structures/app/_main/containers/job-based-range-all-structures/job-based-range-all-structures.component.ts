import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CompanyStructureView } from 'libs/models/structures/company-structure-view.model';
import { AsyncStateObj } from 'libs/models/state';

import * as fromJobBasedRangeAllStructuresActions from '../../actions/job-based-range-all-structures.actions';
import * as fromStructuresMainReducer from '../../reducers';

@Component({
  selector: 'pf-job-based-range-all-structures',
  templateUrl: './job-based-range-all-structures.component.html',
  styleUrls: ['./job-based-range-all-structures.component.scss']
})
export class JobBasedRangeAllStructuresComponent implements OnInit, OnDestroy {
  companyStructureViewsAsync$: Observable<AsyncStateObj<CompanyStructureView[]>>;
  filteredCompanyStructureViews$: Observable<CompanyStructureView[]>;

  constructor(private store: Store<fromStructuresMainReducer.State>) {
    this.companyStructureViewsAsync$ = this.store.pipe(select(fromStructuresMainReducer.getCompanyStructureViewsAsync));
    this.filteredCompanyStructureViews$ = this.store.pipe(select(fromStructuresMainReducer.getFilteredCompanyStructures));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromJobBasedRangeAllStructuresActions.GetCompanyStructureViews());
  }

  trackByFn(index: any, structureView: CompanyStructureView) {
    if (structureView && structureView.Structure) {
      return structureView.Structure.CompanyStructuresId;
    }

  }

  ngOnDestroy(): void {
  }
}
