import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

import { AssignedEmployeesGridComponent } from './assigned-employees-grid.component';

import * as fromStatementAssignmentReducer from '../../reducers';

describe('AssignedEmployeesGridComponent', () => {
  let component: AssignedEmployeesGridComponent;
  let fixture: ComponentFixture<AssignedEmployeesGridComponent>;
  let store: Store<fromStatementAssignmentReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromStatementAssignmentReducer.reducers,
          totalRewards_statementAssignment: combineReducers(fromStatementAssignmentReducer.reducers),
        })],
      declarations: [AssignedEmployeesGridComponent, NgbDropdown],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedEmployeesGridComponent);
    component = fixture.componentInstance;

    component.gridState = { take: 20 };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a kendo grid', () => {
    // act, assert
    expect(fixture.debugElement.nativeElement.querySelector('kendo-grid')).toBeTruthy();
  });
});
