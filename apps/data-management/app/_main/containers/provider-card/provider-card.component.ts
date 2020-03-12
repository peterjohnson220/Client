import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Provider } from '../../models';


@Component({
  selector: 'pf-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderCardComponent {

  @Input() provider: Provider;
  @Input() selectedProvider: number;
  @Output() providerSelected = new EventEmitter<Provider>();

  constructor() { }

  selectProviderClick(provider: Provider) {
    if (this.provider.Active) {
      this.providerSelected.emit(provider);
    }
  }
}
