import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { AccordionCards } from '../../data';

describe('Comphub - Accordion Card Layout', () => {
  let instance: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit cardHeaderClick with current card id when current selected card index smaller than card index', () => {
    instance.card = AccordionCards[1];
    instance.prevCard = AccordionCards[0];
    // Markets is the header title
    instance.cardIndex = 1;
    instance.selectedCardIndex = 0;

    spyOn(instance.cardHeaderClick, 'emit');

    instance.handleCardHeaderClick();

    expect(instance.cardHeaderClick.emit).toHaveBeenCalledWith(instance.card.Id);
  });

  it('should emit cardHeaderClick with previous card id when current selected card index greater than or equal to card index', () => {
    instance.card = AccordionCards[1];
    instance.prevCard = AccordionCards[0];
    // Jobs is the header title
    instance.cardIndex = 1;
    instance.selectedCardIndex = 2;

    spyOn(instance.cardHeaderClick, 'emit');

    instance.handleCardHeaderClick();

    expect(instance.cardHeaderClick.emit).toHaveBeenCalledWith(instance.prevCard.Id);
  });

});
