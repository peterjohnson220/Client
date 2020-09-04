import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPickerComponent } from './entity-picker.component';
import { getMockEntityChoiceList } from '../../models';

describe('EntityPickerComponent', () => {
  let component: EntityPickerComponent;
  let fixture: ComponentFixture<EntityPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityPickerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(EntityPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.entities = getMockEntityChoiceList();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
