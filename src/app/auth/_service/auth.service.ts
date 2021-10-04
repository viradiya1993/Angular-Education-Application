import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';


import { AuthHTTPService } from './auth-http.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
	providedIn: 'root',
})
export class AuthService implements OnDestroy {
	// private fields
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	// public fields
	currentUser$: Observable<any>;
	currentUserSchoolId$: Observable<any>;
	isLoading$: Observable<boolean>;
	currentUserSubject: BehaviorSubject<any>;
	currentUserSchoolId: BehaviorSubject<any>;
	currentUserDistructId: BehaviorSubject<any>;
	isLoadingSubject: BehaviorSubject<boolean>;

	get currentUserValue(): any {
		return this.currentUserSubject.value;
	}

	set currentUserValue(user: any) {
		this.currentUserSubject.next(user);
	}

	get currentUserSchoolIdValue(): any {
		return this.currentUserSchoolId.value;
	}

	set currentUserSchoolIdValue(user: any) {
		this.currentUserSchoolId.next(user);
	}

	get currentDistrictIdValue(): any {
		return this.currentUserDistructId.value;
	}

	set currentDistrictIdValue(user: any) {
		this.currentUserDistructId.next(user);
	}

	constructor(
		private authHttpService: AuthHTTPService,
		private router: Router,
		private spinner: NgxSpinnerService,
	) {
		this.isLoadingSubject = new BehaviorSubject<boolean>(false);
		this.currentUserSubject = new BehaviorSubject<any>(undefined);
		this.currentUserSchoolId = new BehaviorSubject<any>(undefined);
		this.currentUserDistructId = new BehaviorSubject<any>(undefined);
		this.currentUser$ = this.currentUserSubject.asObservable();
		this.currentUserSchoolId$ = this.currentUserSchoolId.asObservable();
		//this.currentUserDistructId$ = this.currentUserDistructId.asObservable();
		this.isLoading$ = this.isLoadingSubject.asObservable();

	}

	resetPassword(password: string): Observable<any> {
		this.isLoadingSubject.next(true);
		return this.authHttpService.reset(password).pipe(
			map((auth: any) => {
				return auth;
			}),

			catchError((err) => {
				// console.error('err', err);
				Swal.fire({
					position: 'top-right',
					width: 300,
					icon: 'error',
					text: err
				});
				return of(undefined);
			}));
	}

	// public methods
	login(email: string, password: string): Observable<any> {
		this.isLoadingSubject.next(true);
		return this.authHttpService.login(email, password).pipe(
			map((auth: any) => {
				const result = this.setAuthFromLocalStorage(auth);
				return result;
			}),
			// CHanges for local DB

			switchMap(() => this.getUserByToken()),


			catchError((err) => {
				// console.error('err', err);
				Swal.fire({
					position: 'top-right',
					width: 300,
					icon: 'error',
					text: err
				});
				return of(undefined);
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	logoutWithAPI() {
		this.spinner.show();
		this.authHttpService.logout().subscribe(res => {
			// console.log(res);

			if (res) {
				this.spinner.hide();
				// console.log(res);
				localStorage.clear();
				this.router.navigate(['/home']);
				this.currentUserSubject.next(null);
				this.currentUserSchoolId.next(null);
				this.currentUserDistructId.next(null);
			}
		});
	}

	logout() {
		localStorage.clear();
		this.router.navigate(['/']);
		this.currentUserSubject.next(null);
		this.currentUserSchoolId.next(null);
		this.currentUserDistructId.next(null);
	}

	getUserByToken(): Observable<any> {
		this.spinner.show();
		const auth = this.getAuthFromLocalStorage();
		if (!auth.token) {
			this.spinner.hide();
			return of(undefined);
		}

		this.isLoadingSubject.next(true);
		return this.authHttpService.getUserByToken(auth).pipe(
			map((user: any) => {
				this.spinner.hide();
				if (user) {
					this.currentUserSubject = new BehaviorSubject<any>(user);

					if (user?.data?.schoolId) {
						this.currentUserSchoolId = new BehaviorSubject(user?.data?.schoolId);
					}
					if (user?.data?.districtId) {
						this.currentUserDistructId = new BehaviorSubject(user?.data?.districtId);
					}
				} else {
					this.logout();
				}
				return user;
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}



	// private methods
	private setAuthFromLocalStorage(auth: any): boolean {
		// For Live 
		let JWTdecoded: any = jwt_decode(auth.data.accessToken);
		if (auth && JWTdecoded) {
			localStorage.setItem('authToken', auth.data.accessToken);
			localStorage.setItem('ID', JWTdecoded._id);
			localStorage.setItem('expiresIn', JWTdecoded.exp);
			localStorage.setItem('Time', JWTdecoded.ist);
			localStorage.setItem('role', auth.data.role);
			return true;
		}


		return false;
	}

	public getAuthFromLocalStorage(): any {
		try {
			const authData = {
				token: localStorage.getItem('authToken'),
				userId: localStorage.getItem('ID')
			}

			return authData;
		} catch (error) {
			// console.error(error);
			return undefined;
		}
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}
}
