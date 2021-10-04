import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '';
@Injectable({
  providedIn: 'root'
})

export class DokedListService {

  constructor(private http: HttpClient) { }

  //Fetch Endorsments
  getQNAList(startDate, endDate) {
    // search: any, status: any, page: any, limit: any
    let params = new HttpParams()
      .set('startDate', startDate ? startDate : '')
      .set('endDate', endDate ? endDate : '')
    // .set('pageNumber', page)
    // .set('pageSize', limit)
    return this.http.get(BACKEND_URL + '/queans_student_dashbord', { params })
  }
}
