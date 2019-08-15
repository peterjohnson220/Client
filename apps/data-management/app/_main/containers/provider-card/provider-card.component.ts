import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Provider } from '../../models';


@Component({
  selector: 'pf-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.scss']
})
export class ProviderCardComponent {

  @Input() provider: Provider;
  @Input() selectedProvider: number;
  @Output() providerSelected = new EventEmitter<Provider>();

  constructor() { }

  selectProviderClick(event: any) {
    this.providerSelected.emit(this.provider);
  }
}
