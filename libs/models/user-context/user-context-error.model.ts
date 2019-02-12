import {HttpErrorResponse} from '@angular/common/http';

export interface UserContextError {
  error: HttpErrorResponse;
  redirectUrl: string;
}
