import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'pf-card-selector',
  templateUrl: './card-selector.component.html',
  styleUrls: ['./card-selector.component.scss']
})

export class CardSelectorComponent implements OnInit, OnDestroy {
  @Input() cardData$: Observable<any[]>;
  @Input() cardDataLoading$: Observable<boolean>;
  @Input() cardDataError$: Observable<boolean>;
  @Input() cardBodyTemplate: TemplateRef<any>;
  @Input() onCardSelectedTemplate: TemplateRef<any>;
  @Input() cardIdentifier: (dataItem: any) => number | string;
  @Input() cardIsDisabled: (dataItem: any) => boolean;
  @Output() onReload = new EventEmitter();
  @Output() onCardSelection = new EventEmitter();

  cardDataSubscription: Subscription;
  selectedCard: any;

  constructor() { }

  handleCardSelectionEvent(card: any): void {
    this.setCardSelection(card);
  }

  handleReloadEvent(): void {
    this.onReload.emit();
  }

  setCardSelection(card: any): void {
    this.selectedCard = card;
    this.onCardSelection.emit(card);
  }

  // Lifecycle events
  ngOnInit(): void {
    this.cardDataSubscription = this.cardData$.subscribe((cards) => {
      // TODO: verify this works.
      let cardDataLoading = false;
      this.cardDataLoading$.take(1).subscribe(l => {
        cardDataLoading = l;
      });
      if (!this.selectedCard || cardDataLoading) {
        return;
      }

      const containsSelection = cards.some(ae => this.cardIdentifier(ae) === this.cardIdentifier(this.selectedCard));
      if (!containsSelection) {
        this.setCardSelection(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.cardDataSubscription.unsubscribe();
  }
}
