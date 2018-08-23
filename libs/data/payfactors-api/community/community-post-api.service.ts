import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPost, generateMockCommunityPost } from 'libs/models/community';

@Injectable()
export class CommunityPostApiService {
  private endpoint = 'CommunityPosts';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getPosts(): Observable<any> {
    // TODO: add get to server
    const communityPosts = this.createMockCommunityPosts();
    return new Observable(o => {
      setTimeout(() => {
        o.next(communityPosts);
      }, 1000);
    });
  }
  submitCommunityPost(payload: any): Observable<boolean> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Post`, payload);
  }

  createMockCommunityPosts() {
   const CommunityPosts: CommunityPost[] = [];
      const mockPostText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
     sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
     Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
     aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
     Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

      const replies1 = [ {UserInfo: {UserId: 2, CompanyId: 2 , UserFirstName: 'test', UserLastName: 'user2',
        AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
        CompanyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
      'Cupiditate ducimus exercitationem id iste maxime natus !', LikeCount: 0, Time: '16 minutes ago'},
        {UserInfo: {UserId: 2, CompanyId: 2 , UserFirstName: 'test', UserLastName: 'user2',
          AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          CompanyName: 'test company'}, ReplyText: 'Lorem ipsum nobis non nulla numquam odio officia' +
        ' placeat quam rem sapiente sit tempore ut vel, voluptates!', LikeCount: 0, Time: '16 minutes ago'},
        {UserInfo: {UserId: 2, CompanyId: 2 , UserFirstName: 'test', UserLastName: 'user2',
          AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          CompanyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
        'Cupiditate ducimus exercitationem id iste maxime officia' +
        ' placeat quam rem sapiente sit tempore ut vel, Cupiditate ducimus exercitationem id iste maxime officia,' +
        'Cupiditate ducimus exercitationem id iste maxime officia voluptates!', LikeCount: 2, Time: '16 minutes ago'},
        {UserInfo: {UserId: 2, CompanyId: 2 , UserFirstName: 'test', UserLastName: 'user2',
          AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          CompanyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
        'Cupiditate ducimus exercitationem id iste maxime natus Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. !', LikeCount: 0, Time: '16 minutes ago'},
        {UserInfo: {UserId: 2, CompanyId: 2 , UserFirstName: 'test', UserLastName: 'user2',
          AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          CompanyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
        'Cupiditate ducimus exercitationem id iste maxime officia' +
        ' placeat quam rem sapiente sit tempore ut vel, Cupiditate ducimus exercitationem id iste maxime officia,' +
        'Cupiditate ducimus exercitationem id iste maxime officia voluptates!', LikeCount: 2, Time: '16 minutes ago'}];

      const replies2 = [ {UserInfo: {UserId: 2, CompanyId: 2 , UserFirstName: 'test', UserLastName: 'user2',
        AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
        CompanyName: 'test company'}, ReplyText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
      'Cupiditate ducimus exercitationem id iste maxime natus !', LikeCount: 0, Time: '16 minutes ago'}];

      CommunityPosts.push(generateMockCommunityPost(0, mockPostText,
        [{ TagId: 'aa', TagName: 'test another tag'}, {TagId: 'bb', TagName: 'another tag'}], true));
      CommunityPosts.push(generateMockCommunityPost(1, mockPostText, [{ TagId: 'aa', TagName: 'test tag'},
        { TagId: 'aa', TagName: 'Community'}, { TagId: 'aa', TagName: 'another'}], true, replies1, true));
      CommunityPosts.push(generateMockCommunityPost(5, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}]));
      CommunityPosts.push(generateMockCommunityPost(0, 'another test', [{ TagId: 'aa', TagName: 'test tag'}]));
      CommunityPosts.push(generateMockCommunityPost(0, mockPostText, [], true));
      CommunityPosts.push(generateMockCommunityPost(75, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}], false, replies2));
      CommunityPosts.push(generateMockCommunityPost(0, mockPostText, [{ TagId: 'aa', TagName: 'test tag'}], true));
      return CommunityPosts;
    }

  }
