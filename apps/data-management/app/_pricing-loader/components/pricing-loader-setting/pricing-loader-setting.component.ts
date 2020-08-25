import { Component, Input, EventEmitter, Output } from '@angular/core';

import { PricingLoaderSetting } from '../../models';

@Component({
  selector: 'pf-pricing-loader-setting',
  templateUrl: './pricing-loader-setting.component.html',
  styleUrls: ['./pricing-loader-setting.component.scss']
})
export class PricingLoaderSettingComponent {
  @Input() setting: PricingLoaderSetting;
  @Input() labelWidth: number;
  @Output() textBoxFocus: EventEmitter<any> = new EventEmitter();
  @Output() textBoxBlur: EventEmitter<any> = new EventEmitter();

  onFocus(): void {
    this.textBoxFocus.emit();
  }

  onBlur(): void {
    this.textBoxBlur.emit();
  }
}
