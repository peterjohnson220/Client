import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pf-configure-sidebar',
  templateUrl: './configure-sidebar.component.html',
  styleUrls: ['./configure-sidebar.component.scss']
})
export class ConfigureSidebarComponent implements OnInit {
  @Input() formulaBuilderEnabled: boolean;

  isOpen = true;
  selectedTabIndex = 0;
  activeTab = 'Fields';

  configureTabOptions: Array<string> = ['Fields', 'Filters'];

  ngOnInit() {
    if (this.formulaBuilderEnabled) {
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
