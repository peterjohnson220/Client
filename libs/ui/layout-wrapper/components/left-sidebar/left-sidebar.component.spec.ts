import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LeftSidebarComponent } from './left-sidebar.component';

describe('Left Sidebar', () => {
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let instance: LeftSidebarComponent;

  const mockLinks = [
    { Name: 'Mock Link1 Name', Url: 'Mock Link1 URL', NgAppLink: true, IconClass: 'fa-users' },
    { Name: 'Mock Link2 Name', Url: 'Mock Link2 URL', NgAppLink: true, IconClass: 'fa-calculator' } ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LeftSidebarComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(LeftSidebarComponent);
    instance = fixture.componentInstance;
  });

  it('should add left-sidebar-nav-open, left-sidebar-footer-open, and left-sidebar-icon-open classes' +
    ' when leftSidebarToggle is true', () => {

    instance.leftSidebarToggle = true;
    instance.sidebarLinks = [];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should add left-sidebar-nav-close, left-sidebar-footer-close, and left-sidebar-icon-close classes' +
    ' when leftSidebarToggle is false', () => {

    instance.leftSidebarToggle = false;
    instance.sidebarLinks = [];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show sidebar link names when leftSidebarToggle is true', () => {

    instance.leftSidebarToggle = true;
    instance.sidebarLinks = mockLinks;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show sidebar link names when leftSidebarToggle is false', () => {

    instance.leftSidebarToggle = false;
    instance.sidebarLinks = mockLinks;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
