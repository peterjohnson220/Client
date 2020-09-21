import { Routes } from '@angular/router';
import { AccessDeniedPageComponent, NotFoundErrorPageComponent, ServerErrorPageComponent, ForbiddenPageComponent } from './pages';

export const DEFAULT_ROUTES: Routes = [
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: 'not-found', component: NotFoundErrorPageComponent },
  { path: 'server-error', component: ServerErrorPageComponent },
  { path: 'forbidden', component: ForbiddenPageComponent },
  { path: '**', component: NotFoundErrorPageComponent }
];
