import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdalService } from './adal.service';
@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  constructor(private auth: AdalService) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const tokenAdmin = this.auth.accessToken;

    if (tokenAdmin == null) {
        this.auth.logout();
    }
    // console.log(this.auth.userInfo)
    request = request.clone({
          setHeaders: {
            'Content-Type':  'application/json',
            Authorization: `Bearer ${tokenAdmin}`
          }
        });


    // if (tokenContest) {
    //   const currentUser = JSON.parse(localStorage.getItem('c3Rzsptt'));
    //   if (currentUser && currentUser.token) {
    //     console.log(currentUser.token);
    //     request = request.clone({
    //       setHeaders: {
    //         Authorization: `token ${currentUser.token}`
    //       }
    //     });
    //   }
    // }
    return next.handle(request).pipe(catchError(err => {
            // console.log(err);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                // this.auth.logout();
                // location.reload(true);
                this.auth.logout();
                // console.log('error');
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
  }
}

