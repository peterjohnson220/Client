import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WorkflowStepCompletionModalComponent } from './workflow-step-completion-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

describe('WorkflowStepCompletedModalComponent', () => {
  let abstractFeatureFlagService: AbstractFeatureFlagService;
  let component: WorkflowStepCompletionModalComponent;
  let fixture: ComponentFixture<WorkflowStepCompletionModalComponent>;
  let router: Router;
  let store: Store<fromRootState.State>;
  let instance: WorkflowStepCompletionModalComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [ WorkflowStepCompletionModalComponent ],
      providers: [{
        provide: Router,
        useValue: { navigate: jest.fn() },
      },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(WorkflowStepCompletionModalComponent);
    instance = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStepCompletionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to jobDescriptionList on backToJobDescriptionList()', () => {
    const spy = jest.spyOn(router, 'navigate');
    const expectedRoute = ['/'];
    instance.backToJobDescriptionList();
    expect(spy).toHaveBeenCalledWith(expectedRoute);
  });

  it('should navigate to inbox on backToJobDescriptionInbox()', () => {
    const spy = jest.spyOn(router, 'navigate');
    const expectedRoute = ['/inbox'];
    instance.backToJobDescriptionInbox();
    expect(spy).toHaveBeenCalledWith(expectedRoute);
  });
});
