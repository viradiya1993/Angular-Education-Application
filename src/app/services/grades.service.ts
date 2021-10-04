import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + '';

@Injectable({
	providedIn: 'root'
})
export class GradesService {

	constructor(private http: HttpClient) { }

	//Fetch Grades
	getGrades(search: any, status: any) {
		let params = new HttpParams()
			.set('search', search ? search : '')
			.set('status', status ? status : '')
		//	.set('pageNumber', page)
		//	.set('pageSize', limit)
		return this.http.get(BACKEND_URL + '/grades', { params })
	}

	//Creare Grades
	createGrades(data: any) {
		return this.http.post(BACKEND_URL + '/grades', data);
	}

	//Active Deactive Grades
	activeDeacticveGrades(id: any) {
		return this.http.put(BACKEND_URL + '/grades/change_status/' + id, '')
	}

	//Delete Grades
	deleteGrdes(id: any) {
		return this.http.delete(BACKEND_URL + '/grades/' + id)
	}
}
