import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { HighlightTextPipe } from 'libs/core/pipes';

import { EllipsisViewMoreComponent } from './ellipsis-view-more.component';

describe('UI/Common/Content - Ellipsis View More', () => {
  let fixture: ComponentFixture<EllipsisViewMoreComponent>;
  let instance: EllipsisViewMoreComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbTooltipModule
      ],
      declarations: [
        EllipsisViewMoreComponent,
        HighlightTextPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(EllipsisViewMoreComponent);
    instance = fixture.componentInstance;
  });

  it('should show the full content, when its length is less than the max', () => {
    instance.maxLength = 15;
    instance.content = 'Lorem Ipsum';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the full content and a view less link, when we are showing full', () => {
    instance.maxLength = 15;
    instance.content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    instance.showFull = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should ellipsis the content and show a view more link, when the length exceeds the max length', () => {
    instance.maxLength = 15;
    instance.content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should set showFull to true, when clicking the View More link', () => {
    instance.maxLength = 15;
    instance.content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

    fixture.detectChanges();

    const viewMoreLink = fixture.debugElement.query(By.css('.toggle-view-link'));
    viewMoreLink.triggerEventHandler('click', null);

    expect(instance.showFull).toBe(true);
  });

});
