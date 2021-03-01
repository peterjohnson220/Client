import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pf-loader-dashboard-sidebar',
  templateUrl: './loader-dashboard-sidebar.component.html',
  styleUrls: ['./loader-dashboard-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardSidebarComponent {
  @Output() onPageSelected: EventEmitter<string> = new EventEmitter<string>();
  public selectedPage: string;

  constructor() {
    this.selectedPage = 'dataLoadSummary';
  }

  public selectPage(pageName: string): void {
    this.selectedPage = pageName;
    this.onPageSelected.emit(pageName);
  }
}
