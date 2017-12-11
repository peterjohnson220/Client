import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-dashboard-tile-employees',
  templateUrl: './tile.employees.component.html',
  styleUrls: ['./tile.employees.component.scss']
})
export class TileEmployeesComponent {
  @Input() payload: any;
}
