import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommunityPostRepliesComponent } from './community-post-replies.component';

describe('CommunityPostRepliesComponent', () => {
  let fixture: ComponentFixture<CommunityPostRepliesComponent>;
  let instance: CommunityPostRepliesComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        CommunityPostRepliesComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityPostRepliesComponent);
    instance = fixture.componentInstance;
  });

  it('should show community post replies', () => {
    instance.loading = false;
    instance.replies = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show community post replies loading indicator', () => {
    instance.loading = true;
    instance.replies = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
