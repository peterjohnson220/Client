import { Component } from '@angular/core';

import { EntityChoice, getEntityChoicesForOrgLoader } from '../../../models';

@Component({
  selector: 'pf-org-data-load',
  templateUrl: './org-data-load.component.html',
  styleUrls: ['./org-data-load.component.scss']
})
export class OrgDataLoadComponent {

  loadOptions: EntityChoice[];

  constructor() {
    this.loadOptions = getEntityChoicesForOrgLoader();
  }

  hasAtLeastOneChoice(): boolean {
    if (this.loadOptions.find(f => f.isChecked)) {
      return true;
    }

    return false;
  }

  nextBtnClick() {
    if (!this.hasAtLeastOneChoice()) {
      // if we haven't chosen anything the button is programatically disabled
      return;
    }
  }
}
