import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private httpClient: HttpClient) { }

  GetJobDetails(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:53138/api/user/jobsposted');
  }

  GetJobSearchTerms(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:53138/api/user/searchstrings');
  }
}
