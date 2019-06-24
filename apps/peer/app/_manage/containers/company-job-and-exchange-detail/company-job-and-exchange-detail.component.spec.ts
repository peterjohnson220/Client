import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as manageReducers from '../../reducers/';

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
      declarations: [ CompanyJobAndExchangeDetailComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);
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

  it('should render a close link plus the company job and exchange job detail panels', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the expected action when the close link is clicked', () => {
    const closePanel = fixture.debugElement.nativeElement.querySelector('a.close-panel');
    closePanel.click();

    const selectCompanyJobAction = new companyJobsActions.SetSelectedCompanyJob(null);

    expect(store.dispatch).toHaveBeenCalledWith(selectCompanyJobAction);
  });
});
