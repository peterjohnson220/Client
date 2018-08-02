import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent {
  @Input() title: string;

  collapsed: boolean;

  constructor() {}

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
