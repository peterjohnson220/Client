import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import {take} from 'rxjs/operators';

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
  @Input() cardSelectedTemplate: TemplateRef<any>;
  @Input() cardIdentifier: (dataItem: any) => number | string;
  @Input() cardIsDisabled: (dataItem: any) => boolean;
  @Input() noResultsMessage = 'Please change your filter criteria to search again.';
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
      let cardDataLoading = false;
      this.cardDataLoading$.pipe(take(1)).subscribe(l => {
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
    if (this.cardDataSubscription) {
      this.cardDataSubscription.unsubscribe();
    }
  }
}
