import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AccordionCard } from '../../data';

@Component({
  selector: 'pf-comphub-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card: AccordionCard;
  @Input() prevCard: AccordionCard;
  @Input() selected: boolean;
  @Input() containerWidth: number;
  @Input() disabled: boolean;
  @Input() prevCardDisabled: boolean;
  @Input() accessed: boolean;
  @Input() prevCardAccessed: boolean;
  @Input() cardIndex: number;
  @Input() selectedCardIndex: number;
  @Input() hasCardHeader = true;
  @Input() showJobPricedHistorySummary = false;

  @Output() cardHeaderClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  handleCardHeaderClick() {
    const selectedCardId = this.showCardTitle ? this.card.Id : this.prevCard.Id;
    this.cardHeaderClick.emit(selectedCardId);
  }

  get showCardTitle() {
    return this.selectedCardIndex < this.cardIndex;
  }

}
