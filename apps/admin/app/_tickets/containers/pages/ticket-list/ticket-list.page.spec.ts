import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { WindowRef } from 'libs/core/services';

import { TicketListPageComponent } from './ticket-list.page';

describe('Admin - Tickets - Ticket List Page', () => {
  let instance: TicketListPageComponent;
  let fixture: ComponentFixture<TicketListPageComponent>;
  let windowRef: WindowRef;

  beforeEach(async(() => {
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
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketListPageComponent);
    instance = fixture.componentInstance;
    windowRef = TestBed.get(WindowRef);
    fixture.detectChanges();
  });

  it('should call window location, when handling the back button being clicked', () => {
    instance.handleBackButtonClick();

    expect(windowRef.nativeWindow.location).toBe('/ng/site-admin/navigation');
  });
});
