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
}
