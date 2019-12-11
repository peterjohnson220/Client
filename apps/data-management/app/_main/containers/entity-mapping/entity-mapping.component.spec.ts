import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityMappingComponent } from './entity-mapping.component';

describe('Data Management - Main - Entity Mapping Component', () => {
  let instance: EntityMappingComponent;
  let fixture: ComponentFixture<EntityMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        EntityMappingComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityMappingComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
