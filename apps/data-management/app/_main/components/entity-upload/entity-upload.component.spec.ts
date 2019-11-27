import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityUploadComponent } from './entity-upload.component';

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
});
