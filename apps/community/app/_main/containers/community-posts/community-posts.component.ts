import { Component, OnInit } from '@angular/core';

import { CommunityPost, generateMockCommunityPost } from '../../models/community-post';

@Component({
  selector: 'pf-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: ['./community-posts.component.scss']
})
export class CommunityPostsComponent implements OnInit {
  UserAvatarSource = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
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

      const replies1 = [ {UserInfo: {userId: 2, companyId: 2 , userFirstName: 'test', userLastName: 'user2',
          avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          companyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
          'Cupiditate ducimus exercitationem id iste maxime natus !', LikeCount: 0, Time: '16 minutes ago'},
        {UserInfo: {userId: 2, companyId: 2 , userFirstName: 'test', userLastName: 'user2',
            avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
            companyName: 'test company'}, ReplyText: 'Lorem ipsum nobis non nulla numquam odio officia' +
            ' placeat quam rem sapiente sit tempore ut vel, voluptates!', LikeCount: 0, Time: '16 minutes ago'},
        {UserInfo: {userId: 2, companyId: 2 , userFirstName: 'test', userLastName: 'user2',
            avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
            companyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
            'Cupiditate ducimus exercitationem id iste maxime officia' +
            ' placeat quam rem sapiente sit tempore ut vel, Cupiditate ducimus exercitationem id iste maxime officia,' +
            'Cupiditate ducimus exercitationem id iste maxime officia voluptates!', LikeCount: 2, Time: '16 minutes ago'},
        {UserInfo: {userId: 2, companyId: 2 , userFirstName: 'test', userLastName: 'user2',
            avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
            companyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
            'Cupiditate ducimus exercitationem id iste maxime natus Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. !', LikeCount: 0, Time: '16 minutes ago'},
        {UserInfo: {userId: 2, companyId: 2 , userFirstName: 'test', userLastName: 'user2',
            avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
            companyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
            'Cupiditate ducimus exercitationem id iste maxime officia' +
            ' placeat quam rem sapiente sit tempore ut vel, Cupiditate ducimus exercitationem id iste maxime officia,' +
            'Cupiditate ducimus exercitationem id iste maxime officia voluptates!', LikeCount: 2, Time: '16 minutes ago'}];

      const replies2 = [ {UserInfo: {userId: 2, companyId: 2 , userFirstName: 'test', userLastName: 'user2',
          avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          companyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
          'Cupiditate ducimus exercitationem id iste maxime natus !', LikeCount: 0, Time: '16 minutes ago'}];

      this.CommunityPosts.push(generateMockCommunityPost(0, mockPostText,
        [{ TagId: 'aa', TagName: 'test another tag'}, {TagId: 'bb', TagName: 'another tag'}], true));
      this.CommunityPosts.push(generateMockCommunityPost(1, mockPostText, [{ TagId: 'aa', TagName: 'test tag'},
        { TagId: 'aa', TagName: 'Community'}, { TagId: 'aa', TagName: 'another'}], true, replies1, true));
      this.CommunityPosts.push(generateMockCommunityPost(5, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}]));
      this.CommunityPosts.push(generateMockCommunityPost(0, 'another test', [{ TagId: 'aa', TagName: 'test tag'}]));
      this.CommunityPosts.push(generateMockCommunityPost(0, mockPostText, [], true));
      this.CommunityPosts.push(generateMockCommunityPost(75, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}], false, replies2));
      this.CommunityPosts.push(generateMockCommunityPost(0, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}], true));
    }

  }
}
