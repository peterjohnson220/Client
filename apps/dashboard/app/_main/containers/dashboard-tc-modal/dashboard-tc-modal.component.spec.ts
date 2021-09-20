import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store} from '@ngrx/store';

import { generateMockTermsConditionsSubmissionModel } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { DashboardTCModalComponent } from './dashboard-tc-modal.component';
import * as fromDashboardTCActions from '../../actions/dashboard-tc-modal.actions';
import { of } from 'rxjs';

describe('Dashboard TC Modal', () => {
  let fixture: ComponentFixture<DashboardTCModalComponent>;
  let instance: DashboardTCModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
    ],
      declarations: [
        DashboardTCModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(DashboardTCModalComponent);
    instance = fixture.componentInstance;
  });

  it('should call loadTCIfFromLogin upon Init', () => {
    jest.spyOn(instance, 'loadTCIfFromLogin');

    instance.ngOnInit();

    expect(instance.loadTCIfFromLogin).toHaveBeenCalled();
  });

  it('should dispatch SubmittingTermsAndConditionsResponse when calling submitTC', () => {

    const termsConditionsSubmissionModel = generateMockTermsConditionsSubmissionModel();
    const action = new fromDashboardTCActions.SubmittingTermsAndConditionsResponse(termsConditionsSubmissionModel);

    instance.tcId = termsConditionsSubmissionModel.TCId;
    instance.submitTC(true);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
