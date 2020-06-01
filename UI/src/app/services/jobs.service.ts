import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJobRoles } from '../Interfaces/IJobRoles';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private httpClient: HttpClient) { }

  GetJobDetails(userId = null): Observable<any> {
    const relativeUrl = userId ? 'http://localhost:53138/api/user/jobsposted/' + userId : 'http://localhost:53138/api/user/jobsposted';
    return this.httpClient.get<any>(relativeUrl);
  }
  GetJobSearchTerms(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:53138/api/user/searchstrings');
  }
  GetJobSearchResults(searchTerm, userId): Observable<any> {
    const data = { SearchQuery: searchTerm };
    return this.httpClient.post<any>(`http://localhost:53138/api/user/filter/jobs/${userId}`, data);
  }
  AddOrUpdateJobRole(data: IJobRoles): Observable<any> {
    return this.httpClient.post<any>('http://localhost:53138/api/user/update/job/roles', data);
  }
  SubmitFeedBack(data): Observable<any> {
    return this.httpClient.post<any>('http://localhost:53138/api/user/update/job/status', data);
  }
}
