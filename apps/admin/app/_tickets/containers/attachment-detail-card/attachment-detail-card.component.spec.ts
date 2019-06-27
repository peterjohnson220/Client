import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentDetailCardComponent } from './attachment-detail-card.component';
import { generateMockTicketAttachments } from '../../models';


describe('Admin - Tickets - Attachment Detail Card', () => {
  let instance: AttachmentDetailCardComponent;
  let fixture: ComponentFixture<AttachmentDetailCardComponent>;

  const mockTicketAttachments = generateMockTicketAttachments();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [ AttachmentDetailCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AttachmentDetailCardComponent);
    instance = fixture.componentInstance;
  });

  // TODO: Add tests once component has more functionality.
  it('Should display details about a ticket', () => {
    instance.ticketAttachments = mockTicketAttachments;
    instance.ticketId = 1;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
