import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'pf-configure-sidebar',
  templateUrl: './configure-sidebar.component.html',
  styleUrls: ['./configure-sidebar.component.scss']
})
export class ConfigureSidebarComponent implements OnChanges {
  @Input() formulaBuilderEnabled: boolean;

  isOpen = true;
  selectedTabIndex = 0;
  activeTab = 'Fields';

  configureTabOptions: Array<string> = ['Fields', 'Filters'];

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes && !!changes.formulaBuilderEnabled && changes.formulaBuilderEnabled.currentValue === true) {
      this.configureTabOptions.push('Formulas');
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  selectTab(index: number, configureTab: string) {
    this.activeTab = configureTab;
    this.selectedTabIndex = index;
  }

}
