import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-exclude-indirect-matches-filter',
  templateUrl: './exclude-indirect-matches-filter.component.html',
  styleUrls: ['./exclude-indirect-matches-filter.component.scss']
})
export class ExcludeIndirectMatchesFilterComponent {
  @Input() enabled: boolean;
  @Output() filterToggled = new EventEmitter();

  constructor() { }

  handleSwitchToggled() {
    this.filterToggled.emit();
  }
}
