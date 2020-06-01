import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJobRoles } from '../Interfaces/IJobRoles';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  // API_URL = 'https://rest-api-jobs.azurewebsites.net/api/user/';
  API_URL = 'http://localhost:53138/api/user/';

  constructor(private httpClient: HttpClient) { }

  GetJobDetails(userId = null): Observable<any> {
    const relativeUrl = userId ? this.API_URL + 'jobsposted/' + userId : this.API_URL + 'jobsposted';
    return this.httpClient.get<any>(relativeUrl);
  }
  GetJobSearchTerms(): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + 'searchstrings');
  }
  GetJobSearchResults(searchTerm, userId): Observable<any> {
    const data = { SearchQuery: searchTerm };
    return this.httpClient.post<any>(this.API_URL + `filter/jobs/${userId}`, data);
  }
  AddOrUpdateJobRole(data: IJobRoles): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + 'update/job/roles', data);
  }
  SubmitFeedBack(data): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + 'update/job/status', data);
  }
}
