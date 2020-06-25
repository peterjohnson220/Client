import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityFiltersDropdownComponent } from './community-filters-dropdown.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from '../../../../../../libs/state/state';

describe('CommunityFiltersDropdownComponent', () => {
  let fixture: ComponentFixture<CommunityFiltersDropdownComponent>;
  let instance: CommunityFiltersDropdownComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({
        ...fromRootState.reducers
      }),
      ],
      declarations: [ CommunityFiltersDropdownComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityFiltersDropdownComponent);
    instance = fixture.componentInstance;
  });

  it('should show community filters', () => {
    expect(fixture).toMatchSnapshot();
  });
});
