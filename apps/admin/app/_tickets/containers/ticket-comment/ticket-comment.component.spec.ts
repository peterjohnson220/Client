import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { TicketCommentComponent } from './ticket-comment.component';
import { generateMockTicketComment } from '../../models';

describe('Admin - Tickets - Comments Detail', () => {
  let instance: TicketCommentComponent;
  let fixture: ComponentFixture<TicketCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [TicketCommentComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TicketCommentComponent);
    instance = fixture.componentInstance;
    instance.comment = generateMockTicketComment();
    fixture.detectChanges();
  });

  it('Should emit a remove event on remove click', () => {
    spyOn(instance.removeCommentEvent, 'emit');

    const comment = generateMockTicketComment();

    instance.removeComment(comment);

    expect(instance.removeCommentEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('Should emit a save event on save button click', () => {
    spyOn(instance.saveCommentEvent, 'emit');

    const comment = generateMockTicketComment();
    instance.commentText = comment.Content + ' test';

    instance.saveComment(comment);

    expect(instance.saveCommentEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('Should not emit a save event on save button click when ticket has no value', () => {
    spyOn(instance.saveCommentEvent, 'emit');

    const comment = generateMockTicketComment();
    instance.commentText = '';
    instance.saveComment(comment);

    expect(instance.saveCommentEvent.emit).not.toHaveBeenCalled();
  });

});
