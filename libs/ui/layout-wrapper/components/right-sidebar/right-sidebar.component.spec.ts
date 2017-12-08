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

  it('should set style.visibility to hidden for openSidebarIcon, add right-sidebar-open class to rightSidebarTransitionWrapper,' +
    ' set style.visibility to visible for closeSidebarIcon' +
    ' when rightSidebarToggle is true', () => {

    instance.rightSidebarToggle = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should set style.visibility to visible for openSidebarIcon, add right-sidebar-close class to rightSidebarTransitionWrapper,' +
    ' add d-none class to rightSidebarContentWrapper, and set style.visibility to hidden for closeSidebarIcon' +
    ' when rightSidebarToggle is false', () => {

    instance.rightSidebarToggle = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
