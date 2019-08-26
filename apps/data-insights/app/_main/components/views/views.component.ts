import { Component, Input } from '@angular/core';

import { View, Workbook } from '../../models';

@Component({
  selector: 'pf-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent {
  @Input() workbook: Workbook;

  isCollapsed = false;

  trackByViews(index: any, view: View) {
    return view.ViewId;
  }

}
