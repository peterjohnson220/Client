import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-community-filters-dropdown',
  templateUrl: './community-filters-dropdown.component.html',
  styleUrls: ['./community-filters-dropdown.component.scss']
})
export class CommunityFiltersDropdownComponent implements OnInit {

  @Input() data: any;
  @Input() name: any;
  @Input() id: any;
  @Input() placeholder: string;
  @Input() selectedItems: any;
  @Input() filterType: string;

  @Output() filtersSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  isItemSelected(itemId: string): boolean {
    return this.selectedItems.some(item => item.Id === itemId);
  }

  filterItems(filterId, placeHolderValue) {
    this.filtersSelected.emit(this.selectedItems);
    this.setKendoMultiSelectPlaceholder(filterId, placeHolderValue);
  }

  setKendoMultiSelectPlaceholder(filterId, placeHolderValue) {
    const element = document.querySelector(`#${filterId} kendo-searchbar input`) as HTMLInputElement;
    setTimeout(function () {
      element.placeholder = `${placeHolderValue}`;
    }, 0);
  }

}
