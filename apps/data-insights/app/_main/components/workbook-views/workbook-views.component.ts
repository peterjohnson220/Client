import { Component, Input, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { InputDebounceComponent } from 'libs/forms/components/input-debounce';

import { Workbook, View } from '../../models';

@Component({
  selector: 'pf-workbook-views',
  templateUrl: './workbook-views.component.html',
  styleUrls: ['./workbook-views.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkbookViewsComponent implements OnDestroy {
  @Input() workbook: Workbook;
  @Input() searchEnabled = true;

  @ViewChild('workbookViewsSearchComponent')
  public workbookViewsSearchComponent: InputDebounceComponent;
  viewFilterValue: string;

  ngOnDestroy() {
    this.viewFilterValue = '';
  }

  get filteredViews(): View[] {
    if (!this.workbook.Views) {
      return [];
    }
    const allViews = cloneDeep(this.workbook.Views.obj);
    return this.viewFilterValue
      ? allViews.filter((vw: View) => vw.ViewName.toLowerCase().includes(this.viewFilterValue.toLowerCase()))
      : allViews;
  }

  trackByFn(index: any, view: View) {
    return view.ViewId;
  }

  getViewUrl(view: View): string {
    return view.ContentUrl.replace(this.workbook.ContentUrl + '/', '');
  }

  handleViewsMouseEnter(): void {
    if (!this.searchEnabled) {
      return;
    }
    this.workbookViewsSearchComponent.blur();
  }

  handleSearchValueChanged(value: string) {
    this.viewFilterValue = value;
  }
}
