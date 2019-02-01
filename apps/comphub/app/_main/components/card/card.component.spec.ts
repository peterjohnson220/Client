import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { ComphubPages } from '../../data';

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

  it('should emit cardHeaderClick', () => {
    instance.cardId = ComphubPages.Jobs;

    spyOn(instance.cardHeaderClick, 'emit');

    instance.handleCardHeaderClick();

    expect(instance.cardHeaderClick.emit).toHaveBeenCalledWith(instance.cardId);
  });

});
