import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '';
@Injectable({
	providedIn: 'root'
})
export class SubAdminService {

	constructor(private http: HttpClient) { }

	//Fetch School Admin
	getSchoolAdmin(search: any, schoolId: any, status: any, page: any, limit: any) {
		let params = new HttpParams()
			.set('search', search ? search : '')
			.set('schoolId', schoolId ? schoolId : '')
			.set('status', status ? status : '')
			.set('pageSize', limit)
			.set('pageNumber', page)
		return this.http.get(BACKEND_URL + '/schools/get/school_sub_admin', { params })
	}

	//Add sub admin
	addSubAdmin(data: any) {
		return this.http.post(BACKEND_URL + '/schools/create/school_sub_admin', data);
	}

	//Update Sub Admin details
	updateSubAdmin(data: any, id: any) {
		return this.http.put(BACKEND_URL + '/schools/school_sub_admin/' + id, data);
	}

	//Delete Sub Admin
	deleteSubAdmin(id: any) {
		return this.http.delete(BACKEND_URL + '/schools/school_sub_admin/' + id)
	}

	//Active Deactive Sub Admin
	activeDeacticveSubAdmin(id: any) {
		return this.http.put(BACKEND_URL + '/schools/school_sub_admin/change_status/' + id, '')
	}
}
