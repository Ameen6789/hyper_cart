import { catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
      console.log('Interceptor running →');

    const token = localStorage.getItem('access_token');

    if (token) {
      console.log("tokensdssd")
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }


    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.log('logged out')
          this.auth.logout();
          this.router.navigate(['/']);
        }
        return throwError(() => err);
      })
    );


  }
}