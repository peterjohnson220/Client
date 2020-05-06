import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { CheckableSettings, TreeViewComponent } from '@progress/kendo-angular-treeview';
import { Align } from '@progress/kendo-angular-popup';
import * as cloneDeep from 'lodash.clonedeep';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GroupedListItem, ListItemSearchResult, PfConstants } from 'libs/models';

@Component({
  selector: 'pf-multi-select-treeview',
  templateUrl: './multi-select-treeview.component.html',
  styleUrls: ['./multi-select-treeview.component.scss']
})
export class MultiSelectTreeViewComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() data: GroupedListItem[];
  @Input() checkableSettings: CheckableSettings = {
    enabled: true,
    mode: 'multiple',
    checkChildren: true,
    checkParents: true,
    checkOnClick: true
  };
  @Input() anchorWidth = 250;
  @Input() checkByKey = 'Value';
  @Input() textField = 'Name';
  @Input() compressChildValues = false;
  @Input() filterable = false;
  @Input() searchPlaceholder = 'Search...';
  @Output() applyClicked: EventEmitter<string[]> = new EventEmitter();

  searchTermSubscription: Subscription;

  @ViewChild('treeView', { static: false }) public treeViewComponent: TreeViewComponent;
  checkedKeys: string[] = [];
  appliedKeys: string[] = [];
  appliedNames: string[] = [];
  show = false;
  anchorAlign: Align = { horizontal: 'left', vertical: 'bottom' };
  popupAlign: Align = { horizontal: 'left', vertical: 'top' };
  searchTerm = '';
  searchTermChanged$ = new BehaviorSubject<string>('');
  noSearchResults = false;
  expandedKeys: string[] = [];
  valuesToShow: string[] = [];

  ngOnInit(): void {
    this.searchTermSubscription = this.searchTermChanged$.pipe(
      debounceTime(PfConstants.DEBOUNCE_DELAY),
      distinctUntilChanged()
    ).subscribe(searchTerm => this.handleSearchTermSubscription(searchTerm));
  }

  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
  }

  handleFilterChanged(): void {
    this.searchTermChanged$.next(this.searchTerm);
  }

  clearSearchTerm(): void {
    this.searchTerm = '';
    this.searchTermChanged$.next('');
  }

  handleCloseClicked(): void {
    this.show = false;
    this.resetSelections();
    this.clearSearchTerm();
    this.expandedKeys = [];
  }

  handleApplyClicked(): void {
    this.appliedKeys = cloneDeep(this.checkedKeys);
    this.show = false;
    const appliedValues = this.getAppliedItemsValues();
    this.appliedNames = appliedValues.map(x => x.text);
    this.applyClicked.emit(appliedValues.map(x => x.value));
  }

  toggleDropdown(): void {
    this.show = !this.show;
    if (!this.show) {
      this.resetSelections();
    }
  }

  // Kendo treeview
  public children = (dataItem: GroupedListItem): Observable<GroupedListItem[]> => of(dataItem.Children);
  public hasChildren = (dataItem: GroupedListItem): boolean => !!dataItem.Children && dataItem.Children.length > 0;

  private handleSearchTermSubscription(searchTerm: string): void {
    if (!this.treeViewComponent) {
      return;
    }
    this.displayAllItems();
    const searchResults = this.search(this.data, searchTerm);
    this.valuesToShow = searchResults.map(x => x.Value);
    this.expandedKeys = searchTerm.length !== 0
      ? searchResults.filter(x => x.IsParentMatch).map(x => x.Value)
      : [];
    this.setDisplayNoneForHiddenItems();
    this.noSearchResults = searchResults.length === 0;
  }

  private search(items: GroupedListItem[], term: string): ListItemSearchResult[] {
    return items.reduce((acc: ListItemSearchResult[], item) => {
      if (this.contains(item.Name, term)) {
        acc.push({
          IsMatch: true,
          IsParentMatch: false,
          Value: item.Value
        });
      }
      if (item.Children && item.Children.length > 0) {
        const newItems = this.search(item.Children, term);

        if (newItems.length > 0) {
          acc.push({
            IsMatch: this.contains(item.Name, term),
            IsParentMatch: true,
            Value: item.Value
          });
          newItems.forEach(childMatch => {
            acc.push({
              IsMatch: childMatch.IsMatch,
              IsParentMatch: childMatch.IsParentMatch,
              Value: childMatch.Value
            });
          });
        }
      }
      return acc;
    }, []);
  }

  private setDisplayNoneForHiddenItems(): void {
    setTimeout(() => {
      const elements = this.treeViewComponent.element.nativeElement.getElementsByClassName('hidden-item');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const liElement = element.closest('.k-treeview-item');
        liElement.setAttribute('style', 'display: none');
      }
    }, 0);
  }

  private displayAllItems(): void {
    setTimeout(() => {
      const elements = this.treeViewComponent.element.nativeElement.getElementsByClassName('k-treeview-item');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.setAttribute('style', 'display: block');
      }
    }, 0);
  }

  private contains(text: string, term: string): boolean {
    return text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
  }

  private getAppliedItemsValues(): {text: string, value: string}[] {
    const selectedNames = [];
    this.data.forEach(item => {
      this.pluckRecursiveValues(item, selectedNames, (contextItem: GroupedListItem): boolean => {
        return this.appliedKeys.indexOf(contextItem[this.checkByKey]) > -1 && !contextItem.IgnoreValue;
      });
    });
    return selectedNames;
  }

  private pluckRecursiveValues(dataItem: GroupedListItem, valuesList: {text: string, value: string}[],
                               selectionValidFn: (contextItem: GroupedListItem) => boolean) {
    if (selectionValidFn(dataItem)) {
      valuesList.push({text: dataItem[this.textField], value: dataItem[this.checkByKey]});
      if (this.compressChildValues) {
        // ignore child values when parent selected and compressing children
        return;
      }
    }
    if (dataItem.Children && dataItem.Children.length) {
      dataItem.Children.forEach(childItem => {
        this.pluckRecursiveValues(childItem, valuesList, selectionValidFn);
      });
    }
  }

  private resetSelections() {
    this.checkedKeys = cloneDeep(this.appliedKeys);
  }

}
