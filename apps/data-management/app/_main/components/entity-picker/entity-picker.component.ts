import { Component, Input } from '@angular/core';

import { EntityChoice } from '../../models';

@Component({
  selector: 'pf-entity-picker',
  templateUrl: './entity-picker.component.html',
  styleUrls: ['./entity-picker.component.scss']
})
export class EntityPickerComponent {
  @Input() entities: EntityChoice[];

  constructor() { }

}

