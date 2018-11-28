import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDashboardPageComponent } from './community-dashboard.page';
import { Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';

describe('CommunityDashboardPageComponent', () => {
  let fixture: ComponentFixture<CommunityDashboardPageComponent>;
  let instance: CommunityDashboardPageComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        CommunityDashboardPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    setupMutationObserverMock(global);

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(CommunityDashboardPageComponent);
    instance = fixture.componentInstance;
  }));

  it('should show community dashboard page', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  function setupMutationObserverMock(data) {
    data.MutationObserver = class {
      constructor(callback) {}
      disconnect() {}
      observe(element, initObject) {}
    };
  }
});
