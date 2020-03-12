import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';

import * as fromTotalRewardsActions from '../actions/statement-list.page.actions';
import * as fromTotalRewardsReducer from '../reducers/statement-list.page.reducer';
import { StatementListPageComponent } from './statement-list.page';

describe('TotalRewardsPageComponent', () => {
  let component: StatementListPageComponent;
  let fixture: ComponentFixture<StatementListPageComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards: combineReducers(fromTotalRewardsReducer.reducer)
        }),
        ReactiveFormsModule],
      declarations: [ StatementListPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the grid component when statements are returned', () => {
    component.statements$ = of([{} as any]);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show the create new banner when no statements are returned', () => {
    component.statements$ = of([]);
    component.loadingStatements$ = of(false);
    component.searchTerm$ = of(null);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
