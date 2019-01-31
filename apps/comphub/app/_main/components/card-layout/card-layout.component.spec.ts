import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLayoutComponent } from './card-layout.component';
import { ComphubPages } from '../../data';

describe('Comphub - Accordion Card Layout', () => {
  let instance: CardLayoutComponent;
  let fixture: ComponentFixture<CardLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CardLayoutComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CardLayoutComponent);
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
