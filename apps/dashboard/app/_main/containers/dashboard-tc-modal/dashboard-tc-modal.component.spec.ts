import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store} from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import { generateMockTermsConditionsSubmissionModel, generateMockUserContext } from 'libs/models';

import { DashboardTCModalComponent } from './dashboard-tc-modal.component';
import * as fromRootState from 'libs/state/state';
import * as fromDashboardTCActions from '../../actions/dashboard-tc-modal.actions';


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
        provide: ActivatedRoute
      }
    ],
      declarations: [
        DashboardTCModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(DashboardTCModalComponent);
    instance = fixture.componentInstance;
  });

  it('should call loadTCIfFromLogin upon Init', () => {
    spyOn(instance, 'loadTCIfFromLogin');

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
