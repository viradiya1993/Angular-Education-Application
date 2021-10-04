import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models';


@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  API_URL = `${environment.apiUrl}`;
  constructor(public http: HttpClient) {
  }


  //Fetch City
  getDistrict(search: any, stateId: any, status: any, page: any, limit: any) {
    let params = new HttpParams()
    .set('search', search ? search : '')
    .set('stateId', stateId ? stateId : '')
    .set('status', status ? status : '')
    .set('pageNumber', page)
    .set('pageSize', limit)
    return this.http.get(this.API_URL + '/get/district', {params});
  }

  //Create District
  createDistrict(item: any): Observable<any> {
    return this.http.post(this.API_URL + '/insert/district', item);
  }

  //Delete District
  deleteDistrict(id: any): Observable<any> {
    return this.http.delete(this.API_URL + '/district/' + id);
  }

  //Active Inactive State
  activeInactiveDistrict(id: any) {
    return this.http.put(this.API_URL + '/district/change_status/' + id, '');
  }

}
