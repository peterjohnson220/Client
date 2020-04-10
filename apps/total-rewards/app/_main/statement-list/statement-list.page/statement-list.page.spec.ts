import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';

import * as fromReducers from '../reducers';

import { StatementListPageComponent } from './statement-list.page';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

describe('TotalRewardsPageComponent', () => {
  let instance: StatementListPageComponent;
  let fixture: ComponentFixture<StatementListPageComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards_statementList: combineReducers(fromReducers.reducers)
        }),
        ReactiveFormsModule, NgbTabsetModule],
      declarations: [StatementListPageComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(StatementListPageComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should show the grid component when statements are returned', () => {
    instance.statementsTotal$ = of(1);
    expect(fixture).toMatchSnapshot();
  });

  it('should show the create new banner when no statements are returned', () => {
    instance.statementsTotal$ = of(0);
    instance.statementsLoadingError$ = of(false);
    instance.statementsLoading$ = of(false);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
