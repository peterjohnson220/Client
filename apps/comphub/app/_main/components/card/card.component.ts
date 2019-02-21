import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-comphub-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() cardId: string;
  @Input() cardTitle: string;
  @Input() cardSubtitle: string;
  @Input() cardIconClass: string;
  @Input() selected: boolean;
  @Input() containerWidth: number;
  @Input() disabled: boolean;
  @Input() accessed: boolean;

  @Output() cardHeaderClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  handleCardHeaderClick() {
    this.cardHeaderClick.emit(this.cardId);
  }
}
