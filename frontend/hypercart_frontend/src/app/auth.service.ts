import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of } from "rxjs";
import { ServerService } from "./server.service";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private serverService:ServerService,private http: HttpClient){}
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  loginSuccess(access: string, refresh?: string) {
    localStorage.setItem('access_token', access);
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    }
    this.loggedInSubject.next(true); // 🔥 REQUIRED
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type')
    this.loggedInSubject.next(false);
  }

  syncAuthState() {
    this.loggedInSubject.next(this.hasToken());
  }

  checkAuth(route: string): Observable<any> {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return of({ authenticated: false, authorized: false, role: '' });
  }

  return this.http.post<any>(`${this.serverService.hostname}users/user_permission_check`, {
    route 
  }).pipe(
    catchError(err => {
      if (err.status === 401) this.logout();
      return of({ authenticated: false, authorized: false, role: '' });
    })
  );
}
}
