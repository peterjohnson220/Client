import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { RouterTestingModule } from '@angular/router/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import { TransferDataPageComponent } from './transfer-data.page';

describe('Data Management - Main - Transfer Data Page', () => {
  let instance: TransferDataPageComponent;
  let fixture: ComponentFixture<TransferDataPageComponent>;
  let store: Store<fromDataManagementMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          transferDataMain: combineReducers(fromDataManagementMainReducer.reducers),
        }),
        RouterTestingModule.withRoutes([{
          path: '**',
          redirectTo: '',
        }]),
      ],
      providers: [],
      declarations: [
        TransferDataPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferDataPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch init action when page is initialized', () => {
    spyOn(store, 'dispatch');

    instance.ngOnInit();
    fixture.detectChanges();

    const expectedInitAction = new fromTransferDataPageActions.Init();
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedInitAction);
  });

  it('should dispatch an action when cancel button is clicked', () => {
    spyOn(store, 'dispatch');

    instance.cancelTransferDataWorkflow();

    const expectedResetWorkflowAction = new fromTransferDataPageActions.ResetTransferDataPageWorkflow();
    expect(store.dispatch).toHaveBeenCalledWith(expectedResetWorkflowAction);
  });
});
