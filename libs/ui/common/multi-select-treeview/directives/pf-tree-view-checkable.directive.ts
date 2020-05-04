import { ChangeDetectorRef, Directive, OnDestroy, OnInit, Input, Output, EventEmitter, NgZone, OnChanges } from '@angular/core';
import {  TreeViewComponent,  CheckableSettings,  CheckedState,  TreeItemLookup,  TreeItem } from '@progress/kendo-angular-treeview';
import { Subscription } from 'rxjs';

import { GroupedListItem } from 'libs/models/list';

/**
 * A directive which manages the node in-memory checked state of the TreeView.
 */
@Directive({ selector: '[pfTreeViewCheckable]' })
export class TreeViewCheckDirective implements OnInit, OnDestroy, OnChanges {
  /**
   * @hidden
   */
  @Input() public set isChecked(value: (item: object, index: string) => CheckedState) {
    this.treeView.isChecked = value;
  }

  /**
   * Defines the collection that will store the checked keys.
   */
  @Input() public checkedKeys: any[] = [];
  @Input() public checkBy: string;
  @Input('pfTreeViewCheckable') public checkable: boolean | CheckableSettings | string;
  /**
   * Fires when the `checkedKeys` collection was updated.
   */
  @Output() public checkedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  subscriptions: Subscription = new Subscription(() => {/**/ });
  clickSubscription: Subscription;
  checkActions: any;
  constructor(protected treeView: TreeViewComponent, private cdr: ChangeDetectorRef, private zone: NgZone) {

  }

  ngOnInit(): void {
    this.checkActions = {
      'multiple': (e) => this.checkMultiple(e),
      'single': (e) => this.checkSingle(e)
    };
    this.subscriptions.add(
      this.treeView.checkedChange
        .subscribe((e) => this.check(e))
    );
    this.treeView.isChecked = this.isItemChecked.bind(this);
  }

  ngOnChanges(changes) {
    if (changes.checkable) {
      this.treeView.checkboxes = this.options.enabled;
      this.toggleCheckOnClick();
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.unsubscribeClick();
  }

  get options() {
    const defaultOptions = {
      checkChildren: true,
      checkParents: true,
      enabled: true,
      mode: 'multiple',
      checkOnClick: false
    };
    if (!this.isPresent(this.checkable) || typeof this.checkable === 'string') {
      return defaultOptions;
    }
    const isBoolean = typeof this.checkable === 'boolean';
    const checkSettings = isBoolean
      ? { enabled: this.checkable }
      : this.checkable;
    return Object.assign(defaultOptions, checkSettings);
  }

  protected isItemChecked(dataItem: any, index: string): CheckedState {
    if (!this.checkBy) {
      return this.isIndexChecked(index);
    }
    return this.isCheckedByCustom(dataItem);
  }

  protected isIndexChecked(index) {
    const checkedKeys = this.checkedKeys.filter(this.matchKey(index));
    if (this.indexChecked(checkedKeys, index)) {
      return 'checked';
    }
    const { mode, checkParents } = this.options;
    if (mode === 'multiple' && checkParents && checkedKeys.length) {
      return 'indeterminate';
    }
    return 'none';
  }

  protected itemKey(e) {
    if (!this.checkBy) {
      return e.index;
    }
    if (typeof this.checkBy === 'string') {
      return e.dataItem[this.checkBy];
    }
  }

  protected check(e) {
    const { enabled, mode } = this.options;
    const performSelection = this.checkActions[mode] || this.noop;
    if (!enabled) {
      return;
    }
    performSelection(e);
  }

  protected checkSingle(node: TreeItemLookup) {
    const key = this.itemKey(node.item);
    this.checkedKeys = this.checkedKeys[0] !== key ? [key] : [];
    this.notify();
  }

  protected checkMultiple(node: TreeItemLookup): void {
    this.checkNode(node);
    if (this.options.checkParents) {
      this.checkParents(node.parent);
    }
    this.notify();
  }

  protected toggleCheckOnClick() {
    this.unsubscribeClick();
    if (this.options.checkOnClick) {
      this.clickSubscription = this.treeView.nodeClick.subscribe(args => {
        if (args.type === 'click') {
          const lookup = this.treeView.itemLookup(args.item.index);
          this.check(lookup);
        }
      });
    }
  }

  protected unsubscribeClick() {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
      this.clickSubscription = null;
    }
  }

  protected checkNode(node: TreeItemLookup, check?: boolean) {
    const key = this.itemKey(node.item);
    const idx = this.checkedKeys.indexOf(key);
    const isChecked = idx > -1;
    const shouldCheck = check === undefined ? !isChecked : check;
    if (!this.isPresent(key) || (isChecked && check)) {
      return;
    }
    if (isChecked) {
      this.checkedKeys.splice(idx, 1);
    } else {
      this.checkedKeys.push(key);
    }
    if (this.options.checkChildren) {
      if (this.childrenNotLoaded(node)) {
        this.loadChildren(node);
      }
      node.children.map(n => this.checkNode(n, shouldCheck));
    }
  }

  private loadChildren(node: any) {
    const dataItem = node.item.dataItem as GroupedListItem;
    const childItems: TreeItemLookup[] = [];
    dataItem.Children.forEach((childItem, index) => {
      childItems.push({
        parent: null,
        children: [],
        item: {
          dataItem: childItem,
          index: node.item.index + '_' + index.toString()
        }
      });
    });
    node.children = childItems;
    node.children.forEach(childItem => {
      childItem.parent = node;
    });
  }

  private childrenNotLoaded(node: TreeItemLookup): boolean {
    const dataItem = node.item.dataItem as GroupedListItem;
    return (dataItem && dataItem.Children && dataItem.Children.length)
      && (node.children && node.children.length === 0);
  }

  private checkParents(parent: any): void {
    let currentParent = parent;
    while (currentParent) {
      const parentKey = this.itemKey(currentParent.item);
      const parentIndex = this.checkedKeys.indexOf(parentKey);
      if (this.allChildrenSelected(currentParent.children)) {
        if (parentIndex === -1) {
          this.checkedKeys.push(parentKey);
        }
      } else if (parentIndex > -1) {
        this.checkedKeys.splice(parentIndex, 1);
      }
      currentParent = currentParent.parent;
    }
  }

  private allChildrenSelected(children: any[]): boolean {
    const isCheckedReducer = (acc, item) => (acc && this.isItemChecked(item.dataItem, item.index) === 'checked');
    return children.reduce(isCheckedReducer, true);
  }

  private notify(): void {
    this.checkedKeysChange.emit(this.checkedKeys.slice());
  }

  private isPresent(value): boolean {
    return value !== null && value !== undefined;
  }
  private matchKey = index => k => {
    if (index === k) {
      return true;
    }
    if (!k.split) {
      return false;
    }
    return k.split('_').reduce(({ key, result }, part) => {
      key += part;
      if (index === key || result) {
        return { result: true };
      }
      key += '_';
      return { key, result: false };
    }, { key: '', result: false }).result;
  }

  private noop = () => { };

  private indexChecked = (keys, index) => keys.filter(k => k === index).length > 0;

  private isCheckedByCustom = (dataItem: GroupedListItem): CheckedState => {
    if (this.containsItem(dataItem)) { return 'checked'; }

    if (this.isIndeterminate(dataItem)) { return 'indeterminate'; }

    return 'none';
  }

  private containsItem(item: GroupedListItem): boolean {
    return this.checkedKeys.indexOf(item[this.checkBy]) > -1;
  }

  private isIndeterminate(item: GroupedListItem): boolean {
    if (!item.Children || item.Children.length === 0) {
      return false;
    }
    let idx = 0;
    let childItem: GroupedListItem;

    while (childItem = item.Children[idx]) {
      if (childItem && (this.containsItem(childItem) || this.isIndeterminate(childItem))) {
        return true;
      }

      idx += 1;
    }

    return false;
  }
}

