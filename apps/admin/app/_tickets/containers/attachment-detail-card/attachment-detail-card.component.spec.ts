import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { AttachmentDetailCardComponent } from './attachment-detail-card.component';
import { generateMockTicketAttachments } from '../../models';
import * as fromTicketReducer from '../../reducers';
import { GetUploadProgressCssClassPipe } from '../../pipes';

describe('Admin - Tickets - Attachment Detail Card', () => {
  let instance: AttachmentDetailCardComponent;
  let fixture: ComponentFixture<AttachmentDetailCardComponent>;
  let store: Store<fromTicketReducer.State>;

  const mockTicketAttachments = generateMockTicketAttachments();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('admin_tickets', fromTicketReducer.reducers)
      ],
      declarations: [ AttachmentDetailCardComponent,
        GetUploadProgressCssClassPipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AttachmentDetailCardComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should display details about a ticket', () => {
    instance.ticketAttachments = mockTicketAttachments;
    instance.ticketId = 1;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a model open action on a delete request', () => {
    instance.ticketId = 1;
    instance.ticketAttachments = mockTicketAttachments;

    instance.openModal(2);
    fixture.detectChanges();

    expect(instance.deleteRequest.UserTicketId).toEqual(1);
    expect(instance.deleteRequest.UserTicketsFileId).toEqual(2);
    expect(fixture).toMatchSnapshot();
  });
});
