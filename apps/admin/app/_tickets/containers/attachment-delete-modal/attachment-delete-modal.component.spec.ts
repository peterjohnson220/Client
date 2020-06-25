import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import { generateUserTicketAttachmentDeleteRequest } from 'libs/models/payfactors-api/service/request';
import * as fromRootState from 'libs/state/state';

import { AttachmentDeleteModalComponent } from './attachment-delete-modal.component';
import * as fromTicketReducer from '../../reducers';
import * as fromTicketAttachmentActions from '../../actions/ticket-attachment.actions';

describe('AttachmentDeleteModalComponent', () => {
  let component: AttachmentDeleteModalComponent;
  let fixture: ComponentFixture<AttachmentDeleteModalComponent>;
  let store: Store<fromTicketReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentDeleteModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('admin_tickets', fromTicketReducer.reducers)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AttachmentDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch delete attachment action on handleDeleteConfirmed', () => {
    const spy = spyOn(store, 'dispatch');
    component.request = generateUserTicketAttachmentDeleteRequest();
    const expectedAction = new fromTicketAttachmentActions.DeleteAttachment(component.request);

    component.handleDeleteConfirmed();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch delete attachment close action on handleDeleteDenied', () => {
    const spy = spyOn(store, 'dispatch');
    const expectedAction = new fromTicketAttachmentActions.DeleteAttachmentModalClose();

    component.handleDeleteDenied();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });
});
