import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Provider } from '../../models';


@Component({
  selector: 'pf-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent {
  @Input() providers: Provider[];
  @Input() provider: Provider;
  @Input() selectedProvider: number;
  @Output() providerSelected = new EventEmitter<Provider>();

  constructor () {
  }

  setSelectedProvider(provider: Provider) {
    this.providerSelected.emit(provider);
  }
}
