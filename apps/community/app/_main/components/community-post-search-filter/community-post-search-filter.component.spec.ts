import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { CommunityPostSearchFilterComponent } from './community-post-search-filter.component';


describe('CommunityCategoriesComponent', () => {
  let fixture: ComponentFixture<CommunityPostSearchFilterComponent>;
  let instance: CommunityPostSearchFilterComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityPostSearchFilterComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostSearchFilterComponent);
    instance = fixture.componentInstance;
  });

  it('should show community categories', () => {
    expect(fixture).toMatchSnapshot();
  });
});
