import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LeftSidebarExistingFieldsComponent } from './left-sidebar-existing-fields.component';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import * as fromDataInsightsMainReducer from '../../reducers';
import { ActivatedRoute } from '@angular/router';


describe('Data-Insights LeftSidebarExistingFieldsComponent', () => {
  let instance: LeftSidebarExistingFieldsComponent;
  let fixture: ComponentFixture<LeftSidebarExistingFieldsComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        }),
      ],
      declarations: [ LeftSidebarExistingFieldsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

      store = TestBed.get(Store);
      fixture = TestBed.createComponent(LeftSidebarExistingFieldsComponent);
      instance = fixture.componentInstance;

      fixture.detectChanges();
  }));

  it('should expand fields', () => {
    instance.existingFieldExpanded = true;
    instance.toggleField();
    expect(instance.existingFieldExpanded).toBe(false);
  });
});
