import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockCommunityPost } from '../../models/community-post';
import { CommunityPostsComponent } from './community-posts.component';

describe('CommunityPostsComponent', () => {
  let component: CommunityPostsComponent;
  let fixture: ComponentFixture<CommunityPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityPostsComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPostsComponent);
    component = fixture.componentInstance;
    component.LoadMockPosts = false;
    fixture.detectChanges();
  });

  it('should show posts', () => {

    component.CommunityPosts.push(generateMockCommunityPost(0, 'post text'));
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should change like button when there are likes', () => {

    component.CommunityPosts.push(generateMockCommunityPost(55, 'post text'));
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show tags', () => {
    component.CommunityPosts.push(generateMockCommunityPost(55, 'post text',
      [{ TagId: 'aa', TagName: 'Community tag'}, { TagId: 'aa', TagName: 'another tag'}]));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show internal tag when post is internal', () => {
    component.CommunityPosts.push(generateMockCommunityPost(55, 'post text',
      [{ TagId: 'aa', TagName: 'Community tag'}, { TagId: 'aa', TagName: 'another tag'}], true));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
