import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { WindowRef } from 'libs/core/services';
import * as fromRootState from 'libs/state/state';

import { TicketListPageComponent } from './ticket-list.page';
import { generateMockUserTicketTabItem, generateMockUserTicketTabItems } from '../../../models/user-ticket-tab-item.model';
import * as fromTicketReducer from '../../../reducers';


describe('Admin - Tickets - Ticket List Page', () => {
  let instance: TicketListPageComponent;
  let fixture: ComponentFixture<TicketListPageComponent>;
  let windowRef: WindowRef;
  let store: Store<fromTicketReducer.State>;

  const mockTabset: any = { select: jest.fn() };

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

    instance.tabSet = mockTabset;

    store = TestBed.inject(Store);
    windowRef = TestBed.inject(WindowRef);

    fixture.detectChanges();
  });

  it('should remove "2" tab if userTicketId is 2 when handleCloseTabClick is called', () => {
    const userTicketId = 2;
    const mockUserTicketTabs = generateMockUserTicketTabItems();

    instance.userTicketTabs = mockUserTicketTabs;

    fixture.detectChanges();

    instance.handleCloseTabClick(userTicketId, new Event('click'));

    fixture.detectChanges();
    expect(instance.userTicketTabs.some(tab => tab.UserTicketId === userTicketId)).toEqual(false);
  });

  it('should open tab in front of other tabs if not currently opened when handleOpenTicketEvent is called', () => {
    const userTicketId = 4;
    const mockUserTicketTabs = generateMockUserTicketTabItems();
    const mockNewUserTicketTab = generateMockUserTicketTabItem(userTicketId);

    instance.userTicketTabs = mockUserTicketTabs;

    fixture.detectChanges();

    instance.handleOpenTicketEvent(mockNewUserTicketTab);

    fixture.detectChanges();

    expect(instance.userTicketTabs.some(tab => tab.UserTicketId === userTicketId)).toEqual(true);
  });

  it('should not open a new tab if tab currently exists when handleOpenTicketEvent is called', () => {
    const userTicketId = 2;
    const mockUserTicketTabs = generateMockUserTicketTabItems();
    const mockNewUserTicketTab = generateMockUserTicketTabItem(userTicketId);

    instance.userTicketTabs = mockUserTicketTabs;
    const oldTabCount = instance.userTicketTabs.length;

    fixture.detectChanges();

    instance.handleOpenTicketEvent(mockNewUserTicketTab);

    fixture.detectChanges();

    const newTabCount = instance.userTicketTabs.length;

    expect(oldTabCount).toEqual(newTabCount);
  });
});
