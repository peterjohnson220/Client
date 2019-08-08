import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LeftSidebarComponent } from './left-sidebar.component';


describe('Data-Insights LeftSidebarComponent', () => {
  let instance: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSidebarComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(LeftSidebarComponent);
      instance = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should toggle sidebar', () => {
    instance.isOpen = false;
    instance.toggle();
    expect(instance.isOpen).toBe(true);
  });
});
