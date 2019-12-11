import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AsyncStateObj, ControlType } from 'libs/models';

import * as fromCompanyControlsListReducer from '../reducers';
import * as fromCompanyControlsListAction from '../actions';
import * as fromCompanyControlsInsertAction from '../actions';
import { CreateCompanyControlModalComponent, DeleteCompanyControlModalComponent } from '../containers';

@Component({
  selector: 'pf-company-controls-list',
  templateUrl: './company-controls-list.page.html',
  styleUrls: ['./company-controls-list.page.scss']
})
export class CompanyControlsListPageComponent implements OnInit {
  @ViewChild(DeleteCompanyControlModalComponent, {static: true}) public deleteCompanyControlModal: DeleteCompanyControlModalComponent;
  @ViewChild(CreateCompanyControlModalComponent, {static: true}) public createNewControlModal: CreateCompanyControlModalComponent;

  // Observables
  companyControls$: Observable<AsyncStateObj<ControlType[]>>;
  nameFilter: string;

  constructor(
    private store: Store<fromCompanyControlsListReducer.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.companyControls$ = this.store.pipe(select(fromCompanyControlsListReducer.getAvailableComapnyControls));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromCompanyControlsListAction.LoadCompanyControls());
  }

  createCompanyControl() {
    event.stopPropagation();
    this.store.dispatch(new fromCompanyControlsInsertAction.OpenCreateControlModal());
  }

  deleteCompanyControl(item: ControlType) {
    this.deleteCompanyControlModal.open(item);
  }

  handleControlClick(item: ControlType) {
    // Will be implemented
  }

  handleSearchValueChanged(value: string) {
    this.nameFilter = value;
  }

  trackByFunction(index, item) {
    return item;
  }
}
