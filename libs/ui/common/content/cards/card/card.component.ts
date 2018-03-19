import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

@Component({
  selector: 'pf-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card: any;
  @Input() cardBodyTemplate: TemplateRef<any>;
  @Input() selectedCardIdentifier: number | string;
  @Input() cardIdentifier: (dataItem: any) => number | string;
  @Input() cardIsDisabled: (dataItem: any) => boolean;
  @Output() selected = new EventEmitter();

  constructor() {}

  get cardSelected(): boolean {
    const card = this.card;
    const selectedCardIdentifier = this.selectedCardIdentifier;
    return card && this.cardIdentifier(card) === selectedCardIdentifier;
  }

  get cardDisabled(): boolean {
    return this.cardIsDisabled(this.card);
  }

  handleOnClick() {
    if (this.cardDisabled) {
      return;
    }
    const newCard = this.cardSelected ? null : this.card;
    this.selected.emit(newCard);
  }
}
