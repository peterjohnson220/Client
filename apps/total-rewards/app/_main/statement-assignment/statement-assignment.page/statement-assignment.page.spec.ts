import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';

import { StatementAssignmentPageComponent } from './statement-assignment.page';
import * as fromStatementAssignmentReducer from '../reducers';
import * as fromPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignmentsModalActions from '../actions/statement-assignment-modal.actions';
import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';

describe('AssignedEmployeesGridComponent', () => {
  let component: StatementAssignmentPageComponent;
  let fixture: ComponentFixture<StatementAssignmentPageComponent>;
  let store: Store<fromStatementAssignmentReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromStatementAssignmentReducer.reducers,
          totalRewards_statementAssignment: combineReducers(fromStatementAssignmentReducer.reducers),
          feature_appnotifications: combineReducers(fromAppNotificationsMainReducer.reducers),
        })],
      declarations: [StatementAssignmentPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ }), params: of({ id: 'abc-123' }) }
        },
        {
          provide: Router,
          useValue: { },
        },
      ]
    });

    store = TestBed.inject(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementAssignmentPageComponent);
    component = fixture.componentInstance;

    component.StatementAssignmentModalComponent = { onMessage: () => ({})} as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected page title', () => {
    // arrange
    component.statement$ = of({ StatementName: 'Test Statement Name' }) as any;

    // act
    fixture.detectChanges();

    // assert
    const pageTextContent = fixture.nativeElement.textContent;
    expect(pageTextContent.indexOf('Test Statement Name: Assigned Employees')).toBeGreaterThan(-1);
  });

  it('should hide the filter pill section when no filters are applied', () => {
    // arrange
    component.assignedEmployeesGridState = {
      filter: {
        filters: [],
        logic: 'and'
      }
    } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('pf-list-area-filter-pills')).toBeFalsy();
  });

  it('should show the filter pill section when filters are applied', () => {
    // arrange
    component.assignedEmployeesGridState = {
      filter: {
        filters: [{ field: 'LastName', operator: 'contains', value: 'a' }],
        logic: 'and'
      }
    } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('pf-list-area-filter-pills')).toBeTruthy();
  });

  it('should dispatch the expected action when Assign Employees is clicked', () => {
    // arrange
    spyOn(store, 'dispatch');
    const openModalAction = new fromAssignmentsModalActions.OpenModal();

    // act
    fixture.detectChanges();
    const openModalButton = fixture.debugElement.nativeElement.querySelector('button.open-assign-modal');
    openModalButton.click();

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(openModalAction);
  });

  it('handleAssignedEmployeesGridStateChange should preserve current filters and dispatch updated paging in the dispatched action', () => {
    // arrange
    spyOn(store, 'dispatch');
    const currentGridState = {
      filter: {
        filters: [{ field: 'LastName', operator: 'contains', value: 'a' }]
      }
    } as any;
    component.assignedEmployeesGridState = currentGridState;

    // arrange, setup a grid state change
    const updatedGridState = { skip: 20 };

    // arrange, setup a combined grid state that should have both the current filters and new paging
    const loadEmployeesAction = new fromAssignedEmployeesGridActions.LoadAssignedEmployees({ ...currentGridState, ...updatedGridState });

    // act
    component.handleAssignedEmployeesGridStateChange(updatedGridState);

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(loadEmployeesAction);
  });

  it('handleClearFilter should remove the expected filter', () => {
    // arrange, set the current gridState up to have one filter
    spyOn(store, 'dispatch');
    const currentGridState = {
      filter: {
        filters: [{ field: 'LastName', operator: 'contains', value: 'a' }]
      }
    } as any;
    component.assignedEmployeesGridState = currentGridState;

    // arrange, create the filter to be removed and the expected action
    const filterToRemove = { field: 'LastName', operator: 'contains', value: 'a' };
    const loadEmployeesAction = new fromAssignedEmployeesGridActions.LoadAssignedEmployees({ filter: { filters: [] } } as any);

    // act
    component.handleClearFilter(filterToRemove);

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(loadEmployeesAction);
  });

  it('handleClearAllFilters should remove all filters', () => {
    // arrange, set the current gridState up to have one filter
    spyOn(store, 'dispatch');
    const currentGridState = {
      filter: {
        filters: [
          { field: 'LastName', operator: 'contains', value: 'a' },
          { field: 'FirstName', operator: 'contains', value: 'b' },
        ]
      }
    } as any;
    component.assignedEmployeesGridState = currentGridState;

    // arrange, create the filter to be removed and the expected action
    const loadEmployeesAction = new fromAssignedEmployeesGridActions.LoadAssignedEmployees({ filter: { filters: [] } } as any);

    // act
    component.handleClearAllFilters();

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(loadEmployeesAction);
  });

  it('should dispatch the expected action when Assign Employees is clicked', () => {
    // arrange
    spyOn(store, 'dispatch');
    const exportEmployeesAction = new fromPageActions.ExportAssignedEmployees();

    // act
    component.handleExportClicked();

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(exportEmployeesAction);
  });
});
