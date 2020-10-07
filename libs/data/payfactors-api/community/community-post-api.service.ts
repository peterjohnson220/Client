import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPost, CommunityReply, CommunitySearchResult, CommunityUserInfo } from 'libs/models/community';

@Injectable({
  providedIn: 'root',
})
export class CommunityPostApiService {
  private endpoint = 'CommunityPosts';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getPosts(searchRequest: any): Observable<CommunitySearchResult> {
    return this.payfactorsApiService.post<CommunitySearchResult>
    (`${this.endpoint}/CommunityPosts`, searchRequest);
  }

  submitCommunityPost(payload: any): Observable<CommunityPost> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Post`, payload);
  }

  updatePostLike(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePostLike`, payload);
  }

  updatePostFavorite(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePostFavorite`, payload);
  }

  updatePostReplyLike(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePostReplyLike`, payload);
  }

  updatePost(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePost`, payload);
  }

  updateReply(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdateReply`, payload);
  }

  addReply(payload: any): Observable<CommunityReply> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddReply`, payload);
  }

  getRepliesByPostId(payload: any): Observable<any> {
    return this.payfactorsApiService.get<CommunityReply[]>
    (`${this.endpoint}/GetReplies`, {
      params: {
        PostId: payload.PostId
      }
    });
  }

  updatePostDeletedFlag(payload: any): Observable<CommunityPost> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/DeletePost`, payload);
  }

  updatePostReplyDeletedFlag(payload: any): Observable<CommunityPost> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/DeleteReply`, payload);
  }

  getCommunityLikes(payload: any): Observable<CommunityUserInfo[]> {
    return this.payfactorsApiService.get<CommunityUserInfo[]>
    (`${this.endpoint}/GetLikes`, {
      params: {
        postId: payload.postId === undefined ? '' :  payload.postId,
        replyId : payload.replyId === undefined ? '' : payload.replyId,
      }
    });
  }

  getPost(payload: any): Observable<any> {
    return this.payfactorsApiService.get<CommunityPost>
    (`${this.endpoint}/GetPost`, {
      params: {
        communityPostId: payload
      }
    });
  }

  deleteCommunityAttachments(payload: string[]) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/DeleteCommunityAttachments`, payload);
  }
}
