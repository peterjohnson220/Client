import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';

import * as fromJobDescriptionManagementReducer from '../../reducers';
import { ApprovalsWorkflowSetupComponent } from './approvals-workflow-setup.component';

describe('ApprovalsWorkflowSetupComponent', () => {
  let component: ApprovalsWorkflowSetupComponent;
  let fixture: ComponentFixture<ApprovalsWorkflowSetupComponent>;
  let router: Router;
  let store: Store<fromJobDescriptionManagementReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromJobDescriptionManagementReducer.reducers
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [ ApprovalsWorkflowSetupComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ApprovalsWorkflowSetupComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
