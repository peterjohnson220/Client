import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RightSidebarComponent } from './right-sidebar.component';

@Component({
  template: `
    <pf-layout-wrapper-right-sidebar>
      Transclusion Works!
    </pf-layout-wrapper-right-sidebar>`
})
class TestHostComponent {
}

describe('Right Sidebar', () => {
  let fixture: ComponentFixture<RightSidebarComponent>;
  let instance: RightSidebarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RightSidebarComponent, TestHostComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(RightSidebarComponent);
    instance = fixture.componentInstance;
  });

  it('should transclude', () => {
    const hostComponent = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    expect(hostComponent).toMatchSnapshot();
  });

  it('Should apply the correct visibility styles and classes when rightSidebarToggle is true', () => {

    instance.rightSidebarToggle = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('Should apply the correct visibility styles and classes when rightSidebarToggle is false', () => {

    instance.rightSidebarToggle = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
