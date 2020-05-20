import {
  Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy, OnChanges, SimpleChanges,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { CheckableSettings, TreeViewComponent } from '@progress/kendo-angular-treeview';
import { Align } from '@progress/kendo-angular-popup';
import * as cloneDeep from 'lodash.clonedeep';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GroupedListItem, PfConstants } from 'libs/models';
import { TreeViewMode } from '../../models';

@Component({
  selector: 'pf-treeview',
  templateUrl: './pf-treeview.component.html',
  styleUrls: ['./pf-treeview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PfTreeViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mode = TreeViewMode.Multiple;
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
  @Input() treeViewContainerHeight = 300;
  @Input() isPopup = true;
  @Input() checkedKeys: string[] = [];
  @Output() applyClicked: EventEmitter<string[]> = new EventEmitter();

  searchTermSubscription: Subscription;

  @ViewChild('treeView', { static: false }) public treeViewComponent: TreeViewComponent;
  appliedKeys: string[] = [];
  appliedNames: string[] = [];
  show = false;
  anchorAlign: Align = { horizontal: 'left', vertical: 'bottom' };
  popupAlign: Align = { horizontal: 'left', vertical: 'top' };
  searchTerm = '';
  searchTermChanged$ = new BehaviorSubject<string>('');
  noSearchResults = false;
  filteredData: GroupedListItem[] = [];
  expandedKeys: string[] = [];
  modes = TreeViewMode;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.data && changes.data.currentValue) {
      this.filteredData = this.data;
    }
    if (changes && changes.checkedKeys && changes.checkedKeys.currentValue && !!this.data) {
      this.handleApplyClicked();
    }
  }

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
    this.noSearchResults = false;
    this.resetSelections();
    this.clearSearchTerm();
    this.filteredData = this.data;
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

  handleSelectionChanged(event: { dataItem: GroupedListItem, index: string }): void {
    if (event.dataItem.IgnoreValue) {
      return;
    }
    this.checkedKeys = [event.dataItem.Value];
  }

  // Kendo treeview
  public children = (dataItem: GroupedListItem): Observable<GroupedListItem[]> => of(dataItem.Children);
  public hasChildren = (dataItem: GroupedListItem): boolean => !!dataItem.Children && dataItem.Children.length > 0;
  public isSelected = (dataItem: GroupedListItem): boolean => {
    return !!this.checkedKeys && !!this.checkedKeys.length && this.checkedKeys.indexOf(dataItem.Value) > -1;
  }
  private handleSearchTermSubscription(searchTerm: string): void {
    if (!this.treeViewComponent) {
      return;
    }
    if (searchTerm.length === 0) {
      this.filteredData = this.data;
      this.expandedKeys = [];
    } else {
      this.filteredData = this.search(this.data, searchTerm);
      this.expandedKeys = this.filteredData.length
        ? this.getExpandedKeys(this.filteredData)
        : [];
    }
    this.noSearchResults = this.filteredData.length === 0;
    this.changeDetectorRef.detectChanges();
  }

  private search(items: GroupedListItem[], term: string): GroupedListItem[] {
    return items.reduce((acc: GroupedListItem[], item) => {
      if ((!item.Children || item.Children.length === 0) && this.contains(item.Name, term)) {
        acc.push(item);
      } else if (item.Children && item.Children.length > 0) {
        const newItems = this.search(item.Children, term);

        if (newItems.length > 0) {
          acc.push({
            ...item,
            Children: newItems
          });
        } else if (this.contains(item.Name, term)) {
          acc.push(item);
        }
      }
      return acc;
    }, []);
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

  private getExpandedKeys(items: GroupedListItem[]): string[] {
    return items.reduce((acc: string[], item) => {
      acc.push(item.Value);
      if (item.Children && item.Children.length) {
        const childrenExpandedKeys = this.getExpandedKeys(item.Children);
        childrenExpandedKeys.forEach(key => acc.push(key));
      }
      return acc;
    }, []);
  }

}