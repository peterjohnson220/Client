import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateMockExchange, generateMockExchangeCompany } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import { DeleteCompanyModalComponent } from './delete-company-modal.component';


describe('Delete Company Modal', () => {
  let fixture: ComponentFixture<DeleteCompanyModalComponent>;
  let instance: DeleteCompanyModalComponent;
  let store: Store<fromRootState.State>;

  const mockExchangeCompany = generateMockExchangeCompany();

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
      ],
      declarations: [
        DeleteCompanyModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(DeleteCompanyModalComponent);
    instance = fixture.componentInstance;
    instance.selectedCompany = mockExchangeCompany;
    instance.exchangeId = 0;

    spyOn(store, 'dispatch');
  });

  it(`should match snapshot on init`, () => {
    instance.exchange$ = of(generateMockExchange());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch DeletingExchangeCompany action when handleDeleteConfirmed is triggered', () => {
    instance.exchange$ = of(generateMockExchange());
    const mockPayload = { exchangeId: 0, companyId: mockExchangeCompany.CompanyId };
    const expectedAction = new fromExchangeCompaniesActions.DeletingExchangeCompany(mockPayload);

    instance.handleDeleteConfirmed();

    fixture.detectChanges();
    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch CloseDeleteExchangeCompanyModal action when handleDeleteDenied is triggered', () => {
    instance.exchange$ = of(generateMockExchange());
    const expectedAction = new fromExchangeCompaniesActions.CloseDeleteExchangeCompanyModal();

    instance.handleDeleteDenied();

    fixture.detectChanges();
    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
