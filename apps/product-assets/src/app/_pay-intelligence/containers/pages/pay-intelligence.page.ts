import { Component, ViewChild } from '@angular/core';
import { InputDebounceComponent } from 'libs/forms/components';
import { ProductAssetsListComponent } from '../product-assets/product-assets-list.component';

@Component({
  selector: 'pf-pay-intelligence-page',
  templateUrl: './pay-intelligence.page.html',
  styleUrls: ['./pay-intelligence.page.scss']
})
export class PayIntelligencePageComponent {
  @ViewChild(ProductAssetsListComponent) listComponent: ProductAssetsListComponent

  constructor() {}

  updateSearchTerm(newSearchTerm: string) {
      this.listComponent.updateSearchItems(newSearchTerm);
  }
}
