import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pf-pay-market-default-settings',
  templateUrl: './pay-market-default-settings.component.html',
  styleUrls: ['./pay-market-default-settings.component.scss']
})
export class PayMarketDefaultSettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  handleSaveClicked() {
    alert('Pay Market Default Settings save button clicked');
  }
}
