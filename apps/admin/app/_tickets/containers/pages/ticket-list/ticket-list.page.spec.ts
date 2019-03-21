import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { WindowRef } from 'libs/core/services';
import * as fromRootState from 'libs/state/state';

import { TicketListPageComponent } from './ticket-list.page';
import { generateMockUserTicketTabItems } from '../../../models/user-ticket-tab-item.model';
import * as fromTicketReducer from '../../../reducers';


describe('Admin - Tickets - Ticket List Page', () => {
  let instance: TicketListPageComponent;
  let fixture: ComponentFixture<TicketListPageComponent>;
  let windowRef: WindowRef;
  let store: Store<fromTicketReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketListPageComponent ],
      providers: [
        {
          provide: WindowRef,
          useValue: {
            nativeWindow: {
              location: jest.fn()
            }
          }
        }
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
        })
      ],
    });

    fixture = TestBed.createComponent(TicketListPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    windowRef = TestBed.get(WindowRef);

    fixture.detectChanges();
  });

  it('should call window location, when handling the back button being clicked', () => {
    instance.handleBackButtonClick();

    expect(windowRef.nativeWindow.location).toBe('/ng/site-admin/navigation');
  });

  it('should select "Tickets" tab if event.index is 0 when handleTabSelect is called', () => {
    const mockEvent = { 'index': 0, 'title': '' };
    const mockUserTicketTabs = generateMockUserTicketTabItems();

    instance.userTicketTabs = mockUserTicketTabs;

    fixture.detectChanges();

    instance.handleTabSelect(mockEvent);

    fixture.detectChanges();

    expect(instance.selectedTicketId).toEqual(null);
  });

  it('should select "2" tab if event.index is 2 when handleTabSelect is called', () => {
    const mockEvent = { 'index': 2, 'title': '' };
    const mockUserTicketTabs = generateMockUserTicketTabItems();

    instance.userTicketTabs = mockUserTicketTabs;

    fixture.detectChanges();

    instance.handleTabSelect(mockEvent);

    fixture.detectChanges();

    expect(instance.selectedTicketId).toEqual(2);
  });

  it('should remove "2" tab if userTicketId is 2 when handleCloseTabClick is called', () => {
    const userTicketId = 2;
    const mockUserTicketTabs = generateMockUserTicketTabItems();

    instance.userTicketTabs = mockUserTicketTabs;

    fixture.detectChanges();

    instance.handleCloseTabClick(userTicketId);

    fixture.detectChanges();

    expect(instance.findUserTicketIndex(userTicketId)).toEqual(-1);
  });

  it('should open tab in front of other tabs if not currently opened when handleOpenTicketEvent is called', () => {
    const userTicketId = 4;
    const mockUserTicketTabs = generateMockUserTicketTabItems();

    instance.userTicketTabs = mockUserTicketTabs;

    fixture.detectChanges();

    instance.handleOpenTicketEvent(userTicketId);

    fixture.detectChanges();

    expect(instance.findUserTicketIndex(userTicketId)).toEqual(0);
  });

  it('should not open tab if currently opened when handleOpenTicketEvent is called', () => {
    const userTicketId = 2;
    const mockUserTicketTabs = generateMockUserTicketTabItems();

    instance.userTicketTabs = mockUserTicketTabs;

    fixture.detectChanges();

    instance.handleOpenTicketEvent(userTicketId);

    fixture.detectChanges();

    expect(instance.findUserTicketIndex(userTicketId)).toEqual(1);
  });
});
