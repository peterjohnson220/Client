import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';

import { InputDebounceComponent } from 'libs/forms/components/input-debounce';

import { View, Workbook } from '../../models';


@Component({
  selector: 'pf-workbook-card',
  templateUrl: './workbook-card.component.html',
  styleUrls: ['./workbook-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkbookCardComponent {
  @ViewChild('workbookViewsSearchComponent', { static: false }) public workbookViewsSearchComponent: InputDebounceComponent;
  @Input() workbook: Workbook;
  @Output() favoriteClicked: EventEmitter<Workbook> = new EventEmitter();
  @Output() tagClicked: EventEmitter<Workbook> = new EventEmitter();
  @Output() openViewsClicked: EventEmitter<Workbook> = new EventEmitter();

  displayActionsOverlay: boolean;
  hoverWorkbookContainer: boolean;
  showingViewPopover = false;
  viewFilterValue: string;

  handleMouseOverWorkbookContainer() {
    this.hoverWorkbookContainer = true;
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveWorkbookContainer() {
    this.hoverWorkbookContainer = false;
    this.displayActionsOverlay = this.showingViewPopover;
  }

  handleFavoriteClicked(workbook: Workbook) {
    this.favoriteClicked.emit(workbook);
  }

  handleTagClicked(workbook: Workbook) {
    this.tagClicked.emit(workbook);
  }

  handleOpenViewsClicked(workbook: Workbook) {
    this.openViewsClicked.emit(workbook);
    this.showingViewPopover = true;
    this.displayActionsOverlay = true;
  }

  handleViewsHidden() {
    this.showingViewPopover = false;
    this.displayActionsOverlay = this.hoverWorkbookContainer;
    this.viewFilterValue = '';
  }

  handleSearchValueChanged(value: string) {
    this.viewFilterValue = value;
  }

  getViewUrl(view: View): string {
    return view.ContentUrl.replace(this.workbook.ContentUrl + '/', '');
  }

  handleViewsMouseEnter(): void {
    this.workbookViewsSearchComponent.blur();
  }

  trackByFn(index: any, view: View) {
    return view.ViewId ;
  }

  get filteredViews(): View[] {
    if (!this.workbook.Views) {
      return [];
    }
    const allViews = cloneDeep(this.workbook.Views.obj);
    return this.viewFilterValue
      ? allViews.filter(vw => vw.ViewName.toLowerCase().includes(this.viewFilterValue.toLowerCase()))
      : allViews;
  }
}
