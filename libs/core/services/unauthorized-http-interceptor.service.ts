import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UnauthorizedHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(event => {}, error => {
      if (error.status === 401) {
        const redirectToAfterSuccessfulLogin = window.location.pathname + window.location.search + window.location.hash;
        window.location.href = '/?redirect=' + encodeURIComponent(redirectToAfterSuccessfulLogin);
      }
    }));
  }
}
