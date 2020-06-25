import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { of } from 'rxjs';

import { CardSelectorComponent } from './card-selector.component';
import spyOn = jest.spyOn;

// Host Component for testing templates
@Component({
  template: `
    <pf-card-selector
      [cardData$]="cardData$"
      [cardDataLoading$]="cardDataLoading$"
      [cardDataError$]="cardDataError$"
      [cardBodyTemplate]="cardTemplate"
      [cardSelectedTemplate]="onCardSelectedTemplate"
      [cardIdentifier]="cardSelector"
      [cardIsDisabled]="disabledExpression">
      <ng-container search-filters>
        SEARCH FILTERS TRANSCLUDED!
      </ng-container>
    </pf-card-selector>
    <ng-template #onCardSelectedTemplate let-card="card">
      Mock Card Selected Template - {{card.Id}}
    </ng-template>
    <ng-template #cardTemplate let-card="card">
      Mock Card Template - {{card.Id}}
    </ng-template>

  `
})
class TestHostComponent implements OnInit {
  @ViewChild(CardSelectorComponent, { static: true }) cardSelectorInstance;
  cardData$ = of([{Id: 1}, {Id: 2}]);
  cardDataLoading$ = of(false);
  cardDataError$ = of(false);
  cardSelector = (card: any) => card ? card.Id : 0;
  disabledExpression = (card: any) => false;

  ngOnInit(): void {
    this.cardSelectorInstance.selectedCard = {Id: 1};
  }
}

describe('UI/Common/Content - CardSelector', () => {
  let fixture: ComponentFixture<CardSelectorComponent>;
  let instance: CardSelectorComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardSelectorComponent, TestHostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CardSelectorComponent);
    instance = fixture.componentInstance;

    instance.cardIdentifier = card => card ? card.Id : 0;
    instance.cardDataError$ = of(false);
  });

  it('should emit an onReload event when handleReloadEvent is triggered', () => {
    spyOn(instance.onReload, 'emit');
    instance.cardData$ = of([{Id: 1}]);
    instance.cardDataLoading$ = of(false);
    instance.cardIsDisabled = card => false;

    fixture.detectChanges();

    instance.handleReloadEvent();

    expect(instance.onReload.emit).toHaveBeenCalled();
  });

  it('should emit an onCardSelection event when setCardSelection is triggered', () => {
    spyOn(instance.onCardSelection, 'emit');
    instance.cardData$ = of([]);
    instance.cardDataLoading$ = of(false);
    instance.cardIsDisabled = card => false;

    fixture.detectChanges();

    instance.setCardSelection(null);

    expect(instance.onCardSelection.emit).toHaveBeenCalledWith(null);
  });

  it('should not clear card selection on cardData$ change when there is no card selection', () => {
    spyOn(instance, 'setCardSelection');
    instance.cardData$ = of([{Id: 1}, {Id: 2}]);
    instance.cardDataLoading$ = of(false);
    instance.cardIsDisabled = card => false;

    fixture.detectChanges();

    expect(instance.setCardSelection).not.toHaveBeenCalled();
  });

  it('should not clear card selection on cardData$ change when cardDataLoading$', () => {
    spyOn(instance, 'setCardSelection');
    instance.cardData$ = of([{Id: 1}, {Id: 2}]);
    instance.cardDataLoading$ = of(true);
    instance.cardIsDisabled = card => false;
    instance.selectedCard = {Id: 1};

    fixture.detectChanges();

    expect(instance.setCardSelection).not.toHaveBeenCalled();
  });

  it('should clear card selection on cardData$ change selection not in cardData$', () => {
    spyOn(instance, 'setCardSelection');
    instance.cardData$ = of([{Id: 1}, {Id: 2}]);
    instance.cardDataLoading$ = of(false);
    instance.cardIsDisabled = card => false;
    instance.selectedCard = {Id: 3};

    fixture.detectChanges();

    expect(instance.setCardSelection).toHaveBeenCalledWith(null);
  });
});
