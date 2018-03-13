import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Card } from '../card';

@Component({
  selector: 'pf-card-selector',
  templateUrl: './card-selector.component.html',
  styleUrls: ['./card-selector.component.scss']
})

export class CardSelectorComponent {
  @Input() cardData$: Observable<any[]>;
  @Input() cardDataLoading$: Observable<boolean>;
  @Input() cardDataError$: Observable<boolean>;
  @Input() cardBodyTemplate: TemplateRef<any>;
  @Input() cardIdentifier: (dataItem: any) => number | string;
  @Input() cardIsDisabled: (dataItem: any) => boolean;
  @Output() reloadEvent = new EventEmitter();

  selectedCard: any;

  constructor() { }

  handleCardSelectionEvent(card: Card<any>): void {
    this.selectedCard = card;
  }

  handleReloadEvent(): void {
    this.reloadEvent.emit();
  }
}
