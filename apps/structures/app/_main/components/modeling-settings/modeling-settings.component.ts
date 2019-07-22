import { Component } from '@angular/core';

@Component({
  selector: 'pf-modeling-settings-component',
  templateUrl: './modeling-settings.component.html',
  styleUrls: ['./modeling-settings.component.scss']
})
export class ModelingSettingsComponent {
  public modelingSettingsContainerToggle = true;

  toggleModelingSettingsContainer(): void {
    this.modelingSettingsContainerToggle = !this.modelingSettingsContainerToggle;
  }
}
