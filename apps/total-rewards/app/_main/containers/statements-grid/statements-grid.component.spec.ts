import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromTotalRewardsReducer from '../../reducers';
import { StatementsGridComponent } from './statements-grid.component';

describe('StatementsGridComponent', () => {
  let component: StatementsGridComponent;
  let fixture: ComponentFixture<StatementsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards: combineReducers(fromTotalRewardsReducer.reducers)
        })],
      declarations: [ StatementsGridComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a kendo grid with columns', () => {
    expect(fixture).toMatchSnapshot();
  });
});
