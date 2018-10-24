import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { CommunityJobsComponent } from './community-jobs.component';

describe('CommunityJobsComponent', () => {
  let fixture: ComponentFixture<CommunityJobsComponent>;
  let instance: CommunityJobsComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      declarations: [
        CommunityJobsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityJobsComponent);
    instance = fixture.componentInstance;
  }));

  it('should show community jobs', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

});
