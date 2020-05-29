import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromTicketReducer from '../../reducers';
import * as fromTicketActions from '../../actions/ticket.actions';
import { TicketCommentsDetailComponent } from './ticket-comments-detail.component';
import { generateMockTicketComment } from '../../models';
import { generateMockUserTicketCommentRequest,
  generateCreateNewMockUserTicketCommentRequest } from 'libs/models/payfactors-api/service/request';


describe('Admin - Tickets - Comments Detail', () => {
  let instance: TicketCommentsDetailComponent;
  let fixture: ComponentFixture<TicketCommentsDetailComponent>;
  let store: Store<fromTicketReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
        })
      ],
      declarations: [TicketCommentsDetailComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TicketCommentsDetailComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store);
  });

  it('Add click should add a new ticket item', () => {
    instance._comments = [];
    instance.addNewComment();
    expect(instance._comments.length).toBe(1);
  });

  it('Remove click on a new comment should remove the comment from the current list', () => {
    spyOn(store, 'dispatch');

    instance._comments = [];
    instance.addNewComment();
    instance.removeComment(instance._comments[0]);

    expect(instance._comments.length).toBe(0);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('Remove click on an existing comment should dispatch a remove action', () => {
    spyOn(store, 'dispatch');

    instance._comments = [generateMockTicketComment()];
    const expectedAction = new fromTicketActions.DeleteComment({
      UserTicketId: 1,
      UserTicketsCommentId: 1
    });

    instance.removeComment(instance._comments[0]);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('Upsert should dispatcgith an update event for an existing ticket', () => {
    spyOn(store, 'dispatch');

    const commentRequest = generateMockUserTicketCommentRequest();
    const expectedAction = new fromTicketActions.UpdateComment(commentRequest);
    const unexpectedAction = new fromTicketActions.CreateComment(commentRequest);

    instance.upsertComment(commentRequest);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
    expect(store.dispatch).not.toHaveBeenNthCalledWith(1, unexpectedAction);
  });

  it('Upsert should dispatch a create event for a new ticket', () => {
    spyOn(store, 'dispatch');

    const commentRequest = generateCreateNewMockUserTicketCommentRequest();
    const unexpectedAction = new fromTicketActions.UpdateComment(commentRequest);
    const expectedAction = new fromTicketActions.CreateComment(commentRequest);

    instance.upsertComment(commentRequest);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
    expect(store.dispatch).not.toHaveBeenNthCalledWith(1, unexpectedAction);
  });
});
