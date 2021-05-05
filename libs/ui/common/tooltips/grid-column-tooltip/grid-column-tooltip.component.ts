import {Component, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'pf-grid-column-tooltip',
  templateUrl: './grid-column-tooltip.component.html'
})

export class GridColumnTooltipComponent {
  @Input() columnTemplate: TemplateRef<any>;
  @Input() tooltipTemplate: TemplateRef<any>;

  constructor() {}
}
