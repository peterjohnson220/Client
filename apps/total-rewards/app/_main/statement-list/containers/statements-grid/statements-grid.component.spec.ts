import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import * as fromTotalRewardsReducer from '../../reducers/statement-grid.reducer';
import { StatementsGridComponent } from './statements-grid.component';


describe('TotalRewardsStatementsGridComponent', () => {
  let component: StatementsGridComponent;
  let fixture: ComponentFixture<StatementsGridComponent>;
  let store: Store<fromRootState.State>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards: combineReducers(fromTotalRewardsReducer.reducer)
        }),
        ReactiveFormsModule, NgbTabsetModule],
      declarations: [ StatementsGridComponent ],
      providers: [{provide: Router, useValue: { navigate: jest.fn() }}],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
