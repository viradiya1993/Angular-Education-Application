
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

// const API_USERS_URL = `${environment.apiUrl}/auth`;
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
  ) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    const data = this.http.post(`${API_USERS_URL}/login`, { email, password });
    return data;
  }

  reset(password: string) {
    const data = this.http.post(`${API_USERS_URL}/reset-password`, { password });
    return data;
  }

  logout() {
    return this.http.post(`${API_USERS_URL}/logout`, '');
  }
  // CREATE =>  POST: add a new user to the server
  createUser(user: any): Observable<any> {
    return this.http.post<any>(API_USERS_URL, user);
  }

  getUserByToken(auth: any): Observable<any> {
    this.spinner.show();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.token}`,
    });
    const Id = auth.userId;
    return this.http.get<any>(`${API_USERS_URL}/users/profile`, {
      headers: httpHeaders,
    });
  }

  //Fetch use profile
  getUserDetails(id: any) {
    return this.http.get(API_USERS_URL + '/users/admin/' + id);
  }

  //Update user profile
  updateUserProfile(data: any, id: any) {
    return this.http.put(API_USERS_URL + '/users/admin/' + id, data);
  }

  // forgot password
  userForgotPassword(email: any) {
    return this.http.post(API_USERS_URL + '/send_mail/reset_password_by_user', email);
  }

  // reset password
  ResetPassword(data: any) {
    return this.http.post(API_USERS_URL + '/reset_password_by_auth', data);
  }

  //Chnage Password
  chnagedPasswprd(data: any) {
    return this.http.post(API_USERS_URL + '/change_password', data);
  }
}
