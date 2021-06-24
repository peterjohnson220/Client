import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { AbstractFeatureFlagService } from 'libs/core';
import * as fromRootState from 'libs/state/state';

import * as fromTotalRewardsReducer from '../reducers/statement-history.page.reducers';
import { StatementHistoryPageComponent } from './statement-history.page';

describe('StatementHistoryPageComponent', () => {
  let component: StatementHistoryPageComponent;
  let fixture: ComponentFixture<StatementHistoryPageComponent>;
  let store: Store<fromRootState.State>;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards: combineReducers(fromTotalRewardsReducer.reducer)
        })
      ],
      declarations: [ StatementHistoryPageComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({ }), params: of({ id: 'abc-123' }) } },
        { provide: Router, useValue: { navigate: jest.fn() }},
        { provide: AbstractFeatureFlagService, useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
