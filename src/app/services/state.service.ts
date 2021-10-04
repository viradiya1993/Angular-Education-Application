import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StatesService {
  API_URL = `${environment.apiUrl}`;
  API_URL_CSV = `${environment.apiUrl}/insert_csv/create`;

  subscriptions: any;
  constructor(public http: HttpClient) {}

  //Fetch State
  getState(search: any, status: any, page: any, limit: any) {
    let params = new HttpParams()
    .set('search', search ? search : '')
    .set('status', status ? status : '')
    .set('pageNumber', page)
    .set('pageSize', limit)
    return this.http.get(this.API_URL + '/get/state', {params});
  }

  //Add State
  addState(item: any) {
    return this.http.post(this.API_URL + '/insert/state', item);
  }

  //Delete State
  deleteState(id: any) {
    return this.http.delete(this.API_URL + '/state/' + id);
  }

  //Active Inactive State
  activeInactiveState(id: any) {
    return this.http.put(this.API_URL + '/state/change_status/' + id, '');
  }

  //Upload CSV File
  uploadCSVFile(file) {
    return this.http.post(this.API_URL_CSV, file)
  }
}
