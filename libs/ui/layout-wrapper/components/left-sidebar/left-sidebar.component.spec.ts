import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LeftSidebarComponent } from './left-sidebar.component';

describe('left-sidebar', () => {
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let instance: LeftSidebarComponent;

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

  it('should show correct html when leftSidebarToggle is true', () => {

    const link1 = { Name: 'Link1Name', Url: 'Link 1 URL', NgAppLink: true, IconClass: 'fa-users' };
    const link2 = { Name: 'Link2Name', Url: 'Link 2 URL', NgAppLink: true, IconClass: 'fa-calculator' };

    instance.leftSidebarToggle = true;
    instance.sidebarLinks = [link1, link2];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show correct html when leftSidebarToggle is false', () => {

    const link1 = { Name: 'Link1Name', Url: 'Link 1 URL', NgAppLink: true, IconClass: 'fa-users' };
    const link2 = { Name: 'Link2Name', Url: 'Link 2 URL', NgAppLink: true, IconClass: 'fa-calculator' };

    instance.leftSidebarToggle = false;
    instance.sidebarLinks = [link1, link2];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
