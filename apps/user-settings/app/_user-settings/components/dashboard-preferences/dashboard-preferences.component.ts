import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserTile } from '../../models';

@Component({
  selector: 'pf-dashboard-preferences',
  templateUrl: './dashboard-preferences.component.html',
  styleUrls: ['./dashboard-preferences.component.scss']
})
export class DashboardPreferencesComponent {
  @Input() userTiles: UserTile[];
  @Output() toggleUserTile: EventEmitter<UserTile> = new EventEmitter();

  handleToggleUserTile(userTile: UserTile) {
    this.toggleUserTile.emit(userTile);
  }
}
