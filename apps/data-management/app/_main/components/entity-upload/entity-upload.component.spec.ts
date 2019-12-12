import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityUploadComponent } from './entity-upload.component';
import { getEntityChoicesForOrgLoader } from '../../models';

describe('EntityUploadComponent', () => {
  let component: EntityUploadComponent;
  let fixture: ComponentFixture<EntityUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityUploadComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show entities that are selected', () => {
    component.entities = getEntityChoicesForOrgLoader();
    component.entities[1].isChecked = true;

    const selected = component.selectedEntities();
    expect(selected).toHaveLength(1);
    expect(selected[0].DisplayText).toBe('Jobs');

  });
});
