import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AdalService } from './adal.service';
import { StorageMap } from '@ngx-pwa/local-storage';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_KEY = 'http://localhost:53138'; // 'https://rest-api-jobs.azurewebsites.net';
  token: any = 'my-auth-token';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'

    })
  };

  constructor(private httpClient: HttpClient, private localStorage: StorageMap) {

  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(error.error);
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  public getJobs(start, end): Observable<any> {
    return this.httpClient.get(this.API_KEY + '/fetchmysqldata?start=' + start + '&end=' + end);
  }
  public getJSON(): Observable<any> {
    return this.httpClient.get('/assets/data.json');
  }
  public getFilterData(): Observable<any> {
    return this.httpClient.get(this.API_KEY + '/jobstatus');
  }
  public updateStatus(data): Observable<any> {
    return this.httpClient.get(this.API_KEY + '/update?' + data);
  }
  public insertStatus(data): Observable<any> {
    return this.httpClient.get(this.API_KEY + '/insert?' + data).pipe(
      catchError(this.handleError)
    );
  }
  public get getAdalConfig(): any {
    return {
      tenant: 'tekninjas.com',
      clientId: '9b9508ee-8fe2-4769-8de8-de6871c7c730',
      redirectUri: window.location.origin + '/',
      postLogoutRedirectUri: window.location.origin + '/'
    };
  }
}
