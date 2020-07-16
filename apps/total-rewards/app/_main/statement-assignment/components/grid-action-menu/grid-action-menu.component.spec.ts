import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { GridActionMenuComponent } from './grid-action-menu.component';

describe('GridActionMenuComponent', () => {
  let component: GridActionMenuComponent;
  let fixture: ComponentFixture<GridActionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridActionMenuComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show action menu when open', () => {
    // arrange
    component.isOpen = true;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('div.actions.open')).toBeTruthy();
  });
});
