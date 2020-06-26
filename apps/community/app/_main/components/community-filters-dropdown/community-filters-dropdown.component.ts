import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';


@Component({
  selector: 'pf-community-filters-dropdown',
  templateUrl: './community-filters-dropdown.component.html',
  styleUrls: [ './community-filters-dropdown.component.scss' ]
})
export class CommunityFiltersDropdownComponent implements OnInit, AfterViewInit {

  @Input() data: any;
  @Input() name: any;
  @Input() id: any;
  @Input() placeholder: string;
  @Input() selectedItems: any;
  @Input() filterType: string;

  @Output() filtersSelected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('multiselect') public multiselect: MultiSelectComponent;

  filterIsOpen: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.setKendoMultiSelectPlaceholder(this.filterType, this.placeholder);
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

  openFilter() {
    this.filterIsOpen = true;
  }

  closeFilter() {
    this.filterIsOpen = false;
  }

  dropdownOpenArrowClicked(filterId) {
    const inputElement = document.querySelector(`#${filterId} kendo-searchbar input`) as HTMLInputElement;

    this.multiselect.toggle(true);

    inputElement.focus();

    this.filterIsOpen = true;
  }
}
