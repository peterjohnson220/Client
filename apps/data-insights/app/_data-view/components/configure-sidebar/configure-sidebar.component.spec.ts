import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { ConfigureSidebarComponent } from './configure-sidebar.component';
import * as fromDataInsightsMainReducer from '../../reducers';

describe('Data-Insights ConfigureSidebarComponent', () => {
  let instance: ConfigureSidebarComponent;
  let fixture: ComponentFixture<ConfigureSidebarComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        })
      ],
      declarations: [ ConfigureSidebarComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ConfigureSidebarComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toggle sidebar', () => {
    instance.isOpen = false;
    instance.toggle();
    expect(instance.isOpen).toBe(true);
  });
});
