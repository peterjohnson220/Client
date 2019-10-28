import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'pf-page-with-left-menu',
  templateUrl: './page-with-left-menu.component.html',
  styleUrls: ['./page-with-left-menu.component.scss']
})
export class PageWithLeftMenuComponent {
  @Input() navLinks: {
    icon?: string,
    name: string,
    route: string,
    count?: number,
    count$?: Observable<number>
  }[];

  constructor() {}
}
