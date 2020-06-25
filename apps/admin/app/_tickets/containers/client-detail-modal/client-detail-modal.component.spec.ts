import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import * as fromRootState from 'libs/state/state';
import * as fromTicketReducer from '../../reducers';

import { ClientDetailModalComponent } from './client-detail-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule, combineReducers, Store } from '@ngrx/store';

describe('ClientDetailModalComponent', () => {
  let component: ClientDetailModalComponent;
  let fixture: ComponentFixture<ClientDetailModalComponent>;
  let store: Store<fromTicketReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({
        ...fromRootState.reducers,
        ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
      })],
      declarations: [ClientDetailModalComponent],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
