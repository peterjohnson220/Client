import { Component, Input } from '@angular/core';

@Component({
    selector: 'pf-manage-exchange-section-header',
    templateUrl: './manage-exchange-section-header.component.html',
    styleUrls: ['./manage-exchange-section-header.component.scss']
})

export class ManageExchangeSectionHeaderComponent {
  @Input() sectionTitle: string;
  @Input() sectionDescription: string;
}
