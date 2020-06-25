import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityFiltersComponent } from './community-filters.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from '../../../../../../libs/state/state';

describe('CommunityFiltersComponent', () => {
  let fixture: ComponentFixture<CommunityFiltersComponent>;
  let instance: CommunityFiltersComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({
        ...fromRootState.reducers
      }),
      ],
      declarations: [ CommunityFiltersComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityFiltersComponent);
    instance = fixture.componentInstance;
  });

  it('should show community filters', () => {
    expect(fixture).toMatchSnapshot();
  });
});
