import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { CompanyEmployee } from 'libs/models/company';
import { GridTypeEnum, ListAreaColumn, SelectAllStatus } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromAssignedEmployeesGridReducer from '../../reducers';
import * as fromAssignedEmployeesGridActions from '../../actions/assigned-employees-grid.actions';
import * as fromAssignedEmployeesPageActions from '../../actions/statement-assignment.page.actions';

@Component({
  selector: 'pf-assigned-employees-grid',
  templateUrl: './assigned-employees-grid.component.html',
  styleUrls: ['./assigned-employees-grid.component.scss']
})
export class AssignedEmployeesGridComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;
  @Input() gridState: any;
  @Output() gridStateChange = new EventEmitter<any>();

  assignedEmployeesGridData$: Observable<{ data: CompanyEmployee[], total: number }>;
  assignedEmployeesDataLoading$: Observable<boolean>;
  assignedEmployeesDataLoadingError$: Observable<boolean>;
  assignedEmployeesTotal$: Observable<number>;
  selectedCompanyEmployeeIds$: Observable<number[]>;
  openActionMenuEmployee$: Observable<CompanyEmployee>;
  selectAllState$: Observable<string>;
  listAreaColumns$: Observable<ListAreaColumn[]>;

  selectedCompanyEmployeeIds: number[];
  selectAllStatus = SelectAllStatus;
  selectedDropdown: NgbDropdown;

  selectedCompanyEmployeeIdsSubscription = new Subscription();
  pageSizes = [20, 50, 100, 250];

  constructor(private store: Store<fromAssignedEmployeesGridReducer.State>) { }

  ngOnInit(): void {
    this.assignedEmployeesGridData$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesGridData));
    this.assignedEmployeesDataLoading$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesLoading));
    this.assignedEmployeesDataLoadingError$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesLoadingError));
    this.assignedEmployeesTotal$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesTotal));
    this.openActionMenuEmployee$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getOpenActionMenuEmployee));
    this.selectedCompanyEmployeeIds$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesSelectedCompanyEmployeeIds));
    this.selectAllState$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getSelectAllState));
    this.selectedCompanyEmployeeIdsSubscription = this.selectedCompanyEmployeeIds$.subscribe(ids => this.selectedCompanyEmployeeIds = ids);
    this.listAreaColumns$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getListAreaColumns));
    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy(): void {
    this.selectedCompanyEmployeeIdsSubscription.unsubscribe();
    window.removeEventListener('scroll', this.onScroll, true);
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.TotalRewardsAssignedEmployees));
    this.store.dispatch(new fromAssignedEmployeesGridActions.Reset());
  }

  handleCheckboxClick(employee: CompanyEmployee) {
    this.store.dispatch(new fromAssignedEmployeesGridActions.ToggleEmployeeSelection({ CompanyEmployeeId: employee.CompanyEmployeeId }));
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    // emit up to the parent here since we need the filters in that component's state to be passed in the load call
    this.gridStateChange.emit(state);
  }

  isEmployeeSelected(companyEmployee: CompanyEmployee) {
    return this.selectedCompanyEmployeeIds.find(e => e === companyEmployee.CompanyEmployeeId);
  }

  showGridTooltip(e: any): void {
    if ((e.target.offsetWidth < e.target.scrollWidth) && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  onActionMenuOpen(event: CompanyEmployee): void {
    this.store.dispatch(new fromAssignedEmployeesGridActions.OpenActionMenu(event));
  }

  onActionMenuUnassignClick(): void {
    this.store.dispatch(new fromAssignedEmployeesPageActions.OpenSingleEmployeeUnassignModal());
  }

  handleSelectedRowAction(dropdown: NgbDropdown, employee: CompanyEmployee): void {
    this.selectedDropdown = dropdown;
    this.onActionMenuOpen(employee);
  }

  onScroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  onSelectAllChange() {
    this.store.dispatch(new fromAssignedEmployeesGridActions.SelectAll());
  }
}
