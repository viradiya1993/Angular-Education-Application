import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Country } from '../models';


@Injectable({
  providedIn: 'root'
})
export class CountryService {
  API_URL = `${environment.apiUrl}`;
  constructor(public http: HttpClient) {
  }

  // READ
  find() {
    let params = new HttpParams()
      .set('isDeleted', 'false')
    return this.http.get<any[]>(this.API_URL + '/get/country', { params });
  }

  //Fetch Country
  getCountry(search: any, status: any, page: any, limit: any) {
    let params = new HttpParams()
      .set('name', search ? search : '')
      .set('isDeleted', status ? status : '')
      .set('pageNumber', page)
      .set('pageSize', limit)
    return this.http.get(this.API_URL + '/get/country', { params });
  }
  //Add Country
  addCountry(item: any) {
    return this.http.post<Country>(this.API_URL + '/insert/country', item);
  }

  //Delete Country
  deleteCountry(id: any) {
    const url = `${this.API_URL}/delete/country/` + `${id}`;
    return this.http.put(url, '');
  }




}
