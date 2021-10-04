import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + '';
@Injectable({
  providedIn: 'root'
})
export class EndorsmentsService {

  constructor(private http: HttpClient) { }

  //Fetch Endorsments
  getEndorsments(search: any, status: any, page: any, limit: any) {
    let params = new HttpParams()
      .set('search', search ? search : '')
      .set('status', status ? status : '')
      .set('pageNumber', page)
      .set('pageSize', limit)
    return this.http.get(BACKEND_URL + '/endorsements', { params })
  }

  //Add Endorsments
  addEndorsments(data: any) {
    return this.http.post(BACKEND_URL + '/endorsements', data);
  }

  //Update Endorsments
  updateEndorsments(data: any, id: any) {
    return this.http.put(BACKEND_URL + '/endorsements/update/' + id, data);
  }

  //Delete Endorsments
  deleteEndorsement(id: any) {
    return this.http.delete(BACKEND_URL + '/endorsements/' + id)
  }

  //Active Deactive Endorsments
  activeDeacticveEndorsments(id: any) {
    return this.http.put(BACKEND_URL + '/endorsements/change_status/' + id, '')
  }


}
