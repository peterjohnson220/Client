import { Component, OnInit } from '@angular/core';
import { CommunityPost, generateMockCommunityPost } from '../../models/community-post';

@Component({
  selector: 'pf-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: ['./community-posts.component.scss']
})
export class CommunityPostsComponent implements OnInit {
  LoadMockPosts = true;
  CommunityPosts: CommunityPost[] = [];

  constructor() {

  }

  ngOnInit() {
    this.CreateMockCommunityPosts();
  }

  // This is a temporary method that will be removed once the data access methods for Community have been created
  CreateMockCommunityPosts() {
    if (this.LoadMockPosts) {
      const mockPostText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
     sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
     Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
     aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
     Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

      this.CommunityPosts.push(generateMockCommunityPost(0, mockPostText,
        [{ TagId: 'aa', TagName: 'test another tag'}, {TagId: 'bb', TagName: 'another tag'}]));
      this.CommunityPosts.push(generateMockCommunityPost(1, mockPostText, [{ TagId: 'aa', TagName: 'test tag'},
        { TagId: 'aa', TagName: 'Community'}, { TagId: 'aa', TagName: 'another'}]));
      this.CommunityPosts.push(generateMockCommunityPost(5, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}]));
      this.CommunityPosts.push(generateMockCommunityPost(0, 'another test', [{ TagId: 'aa', TagName: 'test tag'}]));
      this.CommunityPosts.push(generateMockCommunityPost(0, mockPostText, []));
      this.CommunityPosts.push(generateMockCommunityPost(75, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}]));
      this.CommunityPosts.push(generateMockCommunityPost(0, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}]));
    }

  }
}
