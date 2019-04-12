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

  @Input() labelText: string;
  @Input() isExpanded: boolean;
  @Input() isLoading: boolean;
  @Input() selectedOptionNames: string[];

  @Output() selectFacadeClick = new EventEmitter();
  @Output() clearSelectionsClick = new EventEmitter();

  @Output()selectedOptionsChange = new EventEmitter();
  @Input() selectedOptions: GenericMenuItem[];
  @Input() selectedOnTop: boolean;
  @Input() endpointName: string;
  @Input() valueField: string;
  @Input() textField: string;

  searchTerm = '';
  remoteDataSourceSubscription: Subscription;
  constructor( private remoteDataSourceService: RemoteDataSourceService) {
    this.isExpanded =  false;
    this.selectedOptions = [];
    this.selectedOptionNames = [];
    this.isLoading = true;
    this.valueField = 'Id';
    this.textField = 'DisplayName';
  }

  ngOnInit() {
    if (this.endpointName) {this.getFromRemoteSource(); }
  }

  refreshSelected() {
    this.selectedOptions =  this.options.filter(o => o.IsSelected).map(v => ({ ...v}));
    this.selectedOptionNames = this.selectedOptions.map(o => o.DisplayName);
    this.selectedOptionsChange.emit(this.selectedOptions);

  }
  getFromRemoteSource() {
     this.remoteDataSourceSubscription =  this.remoteDataSourceService.getDataSource(`${this.endpointName}`).subscribe(
      s => {
        this.options = s.map(o => {
          return {
            DisplayName: o[this.textField],
            Id: o[this.valueField],
            IsSelected: false
          };
        });
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

  clearSelections() {
    this.options = this.options.map(o => ({...o, IsSelected: false }));
    this.selectedOptions =  [];
    this.selectedOptionNames = [];
    this.clearSelectionsClick.emit();
    this.selectedOptionsChange.emit([]);
  }

  clickElsewhere () {
    this.isExpanded = false;
  }
  clearSearchTerm() {
    this.searchTerm = '';
  }

  trackByFn(index, item: GenericMenuItem) {
    return ((item.Id) ? item.Id : item.DisplayName ) + (item.IsSelected ? 'true' : 'false');
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
