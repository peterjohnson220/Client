import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-page-with-title-bar-and-grid',
  templateUrl: './page-with-title-bar-and-grid.component.html',
  styleUrls: ['./page-with-title-bar-and-grid.component.scss']
})
export class PageWithTitleBarAndGridComponent {
  @Input() returnUrl: string;
  @Input() absoluteUrl: string;
  @Input() contentNoPadding: boolean;

  constructor() {}
}
