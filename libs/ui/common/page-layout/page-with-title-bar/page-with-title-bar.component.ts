import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'pf-page-with-title-bar',
  templateUrl: './page-with-title-bar.component.html',
  styleUrls: ['./page-with-title-bar.component.scss']
})
export class PageWithTitleBarComponent {
  @Input() returnUrl: string;
  @Input() absoluteUrl: string;
  @Input() locationBack: boolean;
  @Input() contentNoPadding: boolean;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
