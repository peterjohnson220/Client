import { Component, Input, OnInit } from '@angular/core';

import { NavigationLinkGroup } from 'libs/models/navigation';

@Component({
    selector: 'pf-navigation-links',
    templateUrl: './navigation-links.component.html',
    styleUrls: ['./navigation-links.component.scss']
})
export class NavigationLinksComponent implements OnInit {

    @Input() navigationGroupLinks: NavigationLinkGroup[];

    constructor() { }
    ngOnInit() { }

  handleClick($event) {
    const linkName = $event.target.innerText;
    const url = $event.target.href;

    if (linkName === 'Download Organizational Data') {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET', url, true);
      xmlHttp.send();
      $event.preventDefault();
    }
  }
}
