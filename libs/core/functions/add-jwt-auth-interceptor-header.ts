import { HttpHeaders } from '@angular/common/http';
import isObject from 'lodash/isObject';
import { UseJwtInterceptor } from 'libs/constants';

export function addJwtAuthInterceptorHeader(options: any = {}): any {
  if (!isObject(options.headers)) {
    let headers = new HttpHeaders();
    headers = headers.set(UseJwtInterceptor, '');
    options.headers = headers;
  } else {
    let headers: HttpHeaders = options.headers;
    headers = headers.append(UseJwtInterceptor, '');
    options.headers = headers;
  }

  return options;
}
