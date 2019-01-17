import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-comphub-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss']
})
export class CardLayoutComponent {
  @Input() cardId: string;
  @Input() cardTitle: string;
  @Input() cardIconClass: string;
  @Input() selected: boolean;
  @Output() cardHeaderClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  handleCardHeaderClick() {
    this.cardHeaderClick.emit(this.cardId);
  }

}
