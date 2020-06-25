import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardComponent } from './card.component';
import spyOn = jest.spyOn;

// Host Component for testing templates
@Component({
  template: `
    <pf-card
      [card]="{Id: 1}"
      [cardIdentifier]="cardSelector"
      [selectedCardIdentifier]="1"
      [cardIsDisabled]="disabledExpression"
      [cardBodyTemplate]="testBody">
    </pf-card>
    <ng-template #testBody let-card="card">
      Mock Card Id - {{card.Id}}
    </ng-template>
  `
})
class TestHostComponent {
  cardSelector = (card: any) => card.Id;
  disabledExpression = (card: any) => false;
}

describe('UI/Common/Content - Card', () => {
  let fixture: ComponentFixture<CardComponent>;
  let instance: CardComponent;

  function clickOnCard() {
    const cardElement = fixture.debugElement.query(By.css('.card'));
    cardElement.triggerEventHandler('click', null);
  }

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardComponent, TestHostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CardComponent);
    instance = fixture.componentInstance;
  });

  it('should not emit selected event when isDisabled', () => {
    instance.card = {Id: 1};
    instance.selectedCardIdentifier = 0;
    instance.cardIdentifier = card => card.Id;
    instance.cardIsDisabled = card => card.Id === 1;

    spyOn(instance.selected, 'emit');

    fixture.detectChanges();

    clickOnCard();

    expect(instance.selected.emit).not.toBeCalled();
  });

  it('should emit selected event with null when isSelected and not disabled', () => {
    instance.card = {Id: 1};
    instance.selectedCardIdentifier = 1;
    instance.cardIdentifier = card => card.Id;
    instance.cardIsDisabled = card => false;

    spyOn(instance.selected, 'emit');

    fixture.detectChanges();

    clickOnCard();

    expect(instance.selected.emit).toBeCalledWith(null);
  });

  it('should emit selected event with a new cardSelection when not selected and not disabled', () => {
    const expectedCardSelection = {Id: 1};
    instance.card = expectedCardSelection;
    instance.selectedCardIdentifier = 0;
    instance.cardIdentifier = card => card.Id;
    instance.cardIsDisabled = card => false;

    spyOn(instance.selected, 'emit');

    fixture.detectChanges();

    clickOnCard();

    expect(instance.selected.emit).toBeCalledWith(expectedCardSelection);
  });



});
