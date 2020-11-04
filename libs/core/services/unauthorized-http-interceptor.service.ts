import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UnauthorizedHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do(event => {}, error => {
      if (error.status === 401) {
        const redirectToAfterSuccessfulLogin = window.location.pathname + window.location.search + window.location.hash;
        window.location.href = '/?redirect=' + encodeURIComponent(redirectToAfterSuccessfulLogin);
      }
    });
  }
}
