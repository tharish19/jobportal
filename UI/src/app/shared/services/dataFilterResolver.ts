import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class dataFilterResolver implements Resolve<any> {
  constructor(private apiService: ApiService) {}

  resolve() {
    return this.apiService.getFilterData();
  }
}