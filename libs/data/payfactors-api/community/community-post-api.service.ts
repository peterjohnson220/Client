import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPost, CommunityReply } from 'libs/models/community';

@Injectable()
export class CommunityPostApiService {
  private endpoint = 'CommunityPosts';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getPosts(): Observable<CommunityPost[]> {
    return this.payfactorsApiService.get<CommunityPost[]>
    (`${this.endpoint}/GetPosts`);
  }
  getPostsByTag(payload: any): Observable<CommunityPost[]> {
    return this.payfactorsApiService.get<CommunityPost[]>
    (`${this.endpoint}/GetPostsAndRepliesByTag`, {
      params: payload
    });
  }

  submitCommunityPost(payload: any): Observable<CommunityPost> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Post`, payload);
  }

  updatePostLike(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePostLike`, payload);
  }

  updatePostReplyLike(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePostReplyLike`, payload);
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
}
