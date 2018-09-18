import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityPost, CommunityReply } from 'libs/models/community';

@Injectable()
export class CommunityPostApiService {
  private endpoint = 'CommunityPosts';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getPosts(): Observable<any> {
    return this.payfactorsApiService.get<CommunityPost[]>
    (`${this.endpoint}/GetPosts`);
  }

  submitCommunityPost(payload: any): Observable<boolean> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Post`, payload);
  }

  updatePostLike(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePostLike`, payload);
  }

  updatePostReplyLike(payload: any): Observable<boolean> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/UpdatePostReplyLike`, payload);
  }

  addReply(payload: any): Observable<boolean> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddReply`, payload);
  }

  getReplies(payload: any): Observable<any> {
    return this.payfactorsApiService.get<CommunityReply[]>
    (`${this.endpoint}/GetReplies`, {
      params: {
        PostId: payload.PostId
      }
    });
  }
}
