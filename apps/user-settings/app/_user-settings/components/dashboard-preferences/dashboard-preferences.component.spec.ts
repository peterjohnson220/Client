import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPreferencesComponent } from './dashboard-preferences.component';
import { generateMockUserTile } from '../../models';

describe('DashboardPreferencesComponent', () => {
  let instance: DashboardPreferencesComponent;
  let fixture: ComponentFixture<DashboardPreferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPreferencesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DashboardPreferencesComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit user tile selection when toggling user tile', () => {
    const userTile = generateMockUserTile();
    spyOn(instance.toggleUserTile, 'emit');

    instance.handleToggleUserTile(userTile);

    expect(instance.toggleUserTile.emit).toHaveBeenCalledWith(userTile);
  });
});
