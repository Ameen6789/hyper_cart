import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ walks up the route tree and builds the full path
  const fullPath = '/' + getFullPath(route);

  return authService.checkAuth(fullPath).pipe(
    map(res => {
      if (!res.authenticated) return router.createUrlTree(['/']);
      if (!res.authorized)    return router.createUrlTree(['/']);
      return true;
    })
  );
};

// builds full path by walking up parent snapshots
function getFullPath(route: ActivatedRouteSnapshot): string {
  const segments: string[] = [];

  let current: ActivatedRouteSnapshot | null = route;
  while (current) {
    const part = current.url.map(s => s.path).join('/');
    if (part) segments.unshift(part);
    current = current.parent;
  }

  return segments.join('/');
}