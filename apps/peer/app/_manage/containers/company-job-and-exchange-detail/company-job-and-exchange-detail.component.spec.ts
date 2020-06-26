import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as manageReducers from '../../reducers/';
import { generateMockCompanyJob } from 'libs/features/peer/job-association/models/company-job.model';

import { CompanyJobAndExchangeDetailComponent } from './company-job-and-exchange-detail.component';

describe('CompanyJobAndExchangeDetailComponent', () => {
  let component: CompanyJobAndExchangeDetailComponent;
  let fixture: ComponentFixture<CompanyJobAndExchangeDetailComponent>;
  let store: Store<manageReducers.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_manage: combineReducers(manageReducers.reducers)
        }),
      ],
      declarations: [CompanyJobAndExchangeDetailComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobAndExchangeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the exchange job detail panel when the selected company job is associated', () => {
    component.selectedCompanyJob$ = of({ ...generateMockCompanyJob(), IsAssociated: true });
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the exchange job search panel when the selected company job is not associated', () => {
    component.selectedCompanyJob$ = of({ ...generateMockCompanyJob(), IsAssociated: false });
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the expected action when the close link is clicked', () => {
    const closePanel = fixture.debugElement.nativeElement.querySelector('a.close-panel');
    closePanel.click();

    const selectCompanyJobAction = new companyJobsActions.SetSelectedCompanyJob(null);

    expect(store.dispatch).toHaveBeenCalledWith(selectCompanyJobAction);
  });
});
