import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { GenericMenuItem } from 'libs/models/common';

@Component({
  selector: 'pf-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements OnInit {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  @Input() labelText: string;
  @Input() options: GenericMenuItem[] = [];
  @Input() isExpanded$: Observable<boolean>;
  @Input() isLoading$: Observable<boolean>;

  @Output() selectFacadeClick = new EventEmitter();
  @Output() checkboxClick = new EventEmitter();
  @Output() clearSelectionsClick = new EventEmitter();

  searchTerm = '';

  get selectedOptionNames(): string {
    let selectedOptionNames = '';

    // loop through each option, and append the display name if selected
    this.options.forEach(o => {
      if (o.IsSelected) {
        selectedOptionNames += o.DisplayName + ', ';
      }
    });

    // if nothing is selcted return empty, otherwise trim the last space and comma
    return (!selectedOptionNames) ? '' : selectedOptionNames.slice(0, -2);
  }

  constructor() { }

  ngOnInit() { }

  toggleCheckboxPanel() {
    this.selectFacadeClick.emit();
  }

  toggleCheckbox(option: GenericMenuItem) {
    this.checkboxClick.emit({ ...option, IsSelected: !option.IsSelected });
  }

  clearSelections() {
    this.clearSelectionsClick.emit();
  }

  clearSearchTerm() {
    this.searchTerm = '';
  }

  trackByFn(index, item: GenericMenuItem) {
    return item.DisplayName;
  }
}
