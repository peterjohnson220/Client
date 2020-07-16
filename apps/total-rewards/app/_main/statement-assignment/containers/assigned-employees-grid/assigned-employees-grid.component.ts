import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { CompanyEmployee } from 'libs/models/company';
import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromAssignedEmployeesGridReducer from '../../reducers';
import * as fromAssignedEmployeesGridActions from '../../actions/assigned-employees-grid.actions';

@Component({
  selector: 'pf-assigned-employees-grid',
  templateUrl: './assigned-employees-grid.component.html',
  styleUrls: ['./assigned-employees-grid.component.scss']
})
export class AssignedEmployeesGridComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;

  assignedEmployeesGridData$: Observable<{ data: CompanyEmployee[], total: number }>;
  assignedEmployeesDataLoading$: Observable<boolean>;
  assignedEmployeesDataLoadingError$: Observable<boolean>;
  assignedEmployeesTotal$: Observable<number>;
  gridState$: Observable<State>;
  selectedCompanyEmployeeIds$: Observable<number[]>;

  selectedCompanyEmployeeIds: number[];
  selectedCompanyEmployeeIdsSubscription = new Subscription();

  defaultSort: SortDescriptor[] = [
    { field: 'LastName', dir: 'asc' },
    { field: 'FirstName', dir: 'asc' },
  ];

  constructor(private store: Store<fromAssignedEmployeesGridReducer.State>) { }

  ngOnInit(): void {
    this.assignedEmployeesGridData$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesGridData));
    this.assignedEmployeesDataLoading$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesLoading));
    this.assignedEmployeesDataLoadingError$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesLoadingError));
    this.assignedEmployeesTotal$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesTotal));
    this.gridState$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesGridState));

    this.selectedCompanyEmployeeIds$ = this.store.pipe(select(fromAssignedEmployeesGridReducer.getAssignedEmployeesSelectedCompanyEmployeeIds));
    this.selectedCompanyEmployeeIdsSubscription = this.selectedCompanyEmployeeIds$.subscribe(ids => this.selectedCompanyEmployeeIds = ids);

    this.store.dispatch(new fromGridActions.SortChange(GridTypeEnum.TotalRewardsAssignedEmployees, this.defaultSort));

    // avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => { this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees()); }, 0);
  }

  ngOnDestroy(): void {
    this.selectedCompanyEmployeeIdsSubscription.unsubscribe();
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.TotalRewardsAssignedEmployees));
    this.store.dispatch(new fromAssignedEmployeesGridActions.Reset());
  }

  handleCheckboxClick(employee: CompanyEmployee) {
    this.store.dispatch(new fromAssignedEmployeesGridActions.ToggleEmployeeSelection({ CompanyEmployeeId: employee.CompanyEmployeeId }));
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsAssignedEmployees, state));
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees());
  }

  isEmployeeSelected(companyEmployee: CompanyEmployee) {
    return this.selectedCompanyEmployeeIds.find(e => e === companyEmployee.CompanyEmployeeId);
  }

  showGridTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

}
