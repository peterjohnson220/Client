import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, HostListener} from '@angular/core';
import {Subscription} from 'rxjs';

import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { GenericMenuItem } from 'libs/models/common';
import {RemoteDataSourceService} from 'libs/core/services';

@Component({
  selector: 'pf-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  @Input() options: GenericMenuItem[];
  @Input() selectedOptions: GenericMenuItem[] = [];
  @Input() labelText: string;
  @Input() isExpanded = false;
  @Input() isLoading = false;
  @Input() selectedOnTop: boolean;
  @Input() endpointName: string;
  @Input() valueField = 'Value';
  @Input() textField = 'DisplayName';
  @Input() displayNamePreview = false;

  @Output() selectFacadeClick = new EventEmitter();
  @Output() clearSelectionsClick = new EventEmitter();

  @Output()selectedOptionsChange = new EventEmitter();
  @Input() highlightSelected = false;
  @Input() selectedValues: any[] = [];
  @Output()selectedValuesChange = new EventEmitter();

  searchTerm = '';
  remoteDataSourceSubscription: Subscription;

  constructor( private remoteDataSourceService: RemoteDataSourceService) {}

  ngOnInit() {
    if (this.endpointName) {
      this.getFromRemoteSource();
    } else if (this.options) {
      this.options.forEach(o => {
        o.IsSelected =  o.Value && (this.selectedValues.indexOf(o.Value) > -1 || this.selectedValues.indexOf(o.Value.toString())  > -1);
      });
      this.refreshSelected();
    }
  }

  refreshSelected() {
    this.selectedOptions =  this.options.filter(o => o.IsSelected).map(v => ({ ...v}));
    this.selectedValues = this.selectedOptions.map(o => o.Value);
  }

  emitChanges() {
    this.refreshSelected();
    this.selectedOptionsChange.emit(this.selectedOptions);
    this.selectedValuesChange.emit(this.selectedValues);
  }

  getFromRemoteSource() {
    this.remoteDataSourceSubscription =  this.remoteDataSourceService.getDataSource(`${this.endpointName}`).subscribe(
      s => {
        this.options = s.map(o => {
          return {
            DisplayName: o[this.textField],
            Value: o[this.valueField],
          // TODO if passing selectedOptions instead of selected values
          IsSelected: this.selectedValues.indexOf(o[this.valueField]) > -1
          || this.selectedValues.indexOf(o[this.valueField].toString())  > -1
          };
        });
        this.refreshSelected();
        this.isLoading = false;
      }
    );
  }

  toggleCheckboxPanel() {
    // Sort after closing dropdown
    if (this.options &&  this.selectedOnTop && !this.isExpanded) {
      this.options = this.options.sort((a, b) => a.IsSelected === b.IsSelected ? 0 : a.IsSelected ? -1 : 1) ;
    }
    this.isExpanded = !this.isExpanded;
    this.selectFacadeClick.emit();
  }

  hasSelections(): boolean {
    if (this.options) {
      return this.options.map(o => o.IsSelected).indexOf(true) >= 0;
    } else {
      return false;
    }
  }

  clearSelections(emitClearSelectionsClickEvent: boolean = true, emitSelectedOptionsChangeEvent: boolean = true) {
    this.options = this.options.map(o => ({ ...o, IsSelected: false }));
    this.selectedOptions = [];
    this.selectedValues = [];
    this.emitChanges();
    if (emitClearSelectionsClickEvent) {
      this.clearSelectionsClick.emit();
    }
    if (emitSelectedOptionsChangeEvent) {
      this.selectedOptionsChange.emit([]);
    }
  }

  clickElsewhere () {
    this.isExpanded = false;
  }

  clearSearchTerm() {
    this.searchTerm = '';
  }

  getSelectionsString(): string {
    const fieldMap = this.displayNamePreview ? 'DisplayName' : 'Value';

    return this.selectedOptions
    .filter((selectedOptions) => selectedOptions.IsSelected)
    .map((x) => x[fieldMap]).join(', ');
  }

  filteredOptions() {
    return this.searchTerm ?
      this.options.filter(option => option.DisplayName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : this.options ? this.options : [];
  }

  selectionsHeight() {
    const selectionsHeight = 32;
    const maxHeight = 200;
    const heightInPx = this.filteredOptions().length * selectionsHeight;
    // The cdk-virtual scroll requires the height to be specified so we have to manually calculate it
    return heightInPx === 0 ? 32 : Math.min(heightInPx, maxHeight);
  }

  trackByFn(index, item: GenericMenuItem) {
    return ((item.Value) ? item.Value : item.DisplayName ) + (item.IsSelected ? 'true' : 'false');
  }

  @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'escape') {
        this.isExpanded = false;
      }
    }
    ngOnDestroy() {
      if (this.remoteDataSourceSubscription) {
        this.remoteDataSourceSubscription.unsubscribe();
      }
    }
  }
