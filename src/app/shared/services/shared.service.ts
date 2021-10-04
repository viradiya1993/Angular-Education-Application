import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from "ngx-toastr";
import Swal from 'sweetalert2';
import { RouteInfo } from "../../models/routes.model";
import { AppConst } from '../constant/app.constant';





@Injectable({
  providedIn: 'root'
})
export class SharedService {

  routes = [];
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.getRoutesForMenu();
  }

  // ROUTES: RouteInfo[] = this.routes;

  // for success message of toster
  loggerSuccess(msg: string, timeOut = 1500) {
    this.toastr.success(msg, 'Success', { timeOut: timeOut, progressBar: true });
  }


  // for info message of toster
  loggerInfo(msg: string, timeOut = 2500) {
    this.toastr.info(msg, 'Info', { timeOut: timeOut, progressBar: true });
  }

  // for error message of toster
  loggerError(msg: string, timeOut = 2500) {
    this.toastr.error(msg, 'Error', { timeOut: timeOut, progressBar: true });
  }

  // for warning message of toster
  loggerWarning(msg: string, timeOut = 2500) {
    this.toastr.warning(msg, 'Warning', { timeOut: timeOut, progressBar: true });
  }

  // for show loader
  showLoader() {
    this.spinner.show();
  }

  // for hide loader
  hideLoader() {
    this.spinner.hide();
  }

  // for remove white space of input text
  trimming_function(x: any) {
    return x ? x.replace(AppConst.trimPattern, '') : '';
  }
  // for remove local storage value
  removeLocalStorage(storageKey: any) {
    return localStorage.removeItem(storageKey);
  }

  // for delete local storage value
  deleteLocalStorage() {
    localStorage.clear();
  }

  // for set local storage value
  setLocalStorage(storageKey: any, storageValue: any) {
    localStorage.setItem(storageKey, storageValue);
  }

  getRole() {
    return localStorage.getItem('role');
  }

  checkIfUserLoggedIn() {
    return localStorage.getItem('ID') ? true : false;
  }
  swalSuccess(successMessage) {
    Swal.fire('', successMessage, 'success')
  }
  swalError(errorMessage) {
    Swal.fire('', errorMessage, 'error')
  }
  closeAllDialog() {
    this.modalService.dismissAll();
  }
  checkIfAdminLogged() {
    let role = this.getRole();
    if (role === "Super-Admin") {
      this.router.navigate(['/dashboard']);
    }
  }

  getRoutesForMenu() {
    let role = this.getRole();
    if (role === "Super-Admin") {
      this.routes = SharedService.SuperAdminRoutes;
    } else if (role === "School-Admin") {
      this.routes = SharedService.SchoolAdminRoutes;
    } else if (role === "School-Sub-Admin") {
      this.routes = SharedService.SchoolSubAdminRoutes;
    } else {
      this.routes = SharedService.TeachersRoutes;
    }
    return this.routes;
  }

  public static SuperAdminRoutes = [
    { path: '/dashboard', title: 'Dashboard', subMenu: [], icon: 'grid_view', class: '', onlyAdmin: false, onlySchoolAdmin: false },
    {
      path: '', title: 'List',
      subMenu: [
        {
          title: 'Country',
          path: '/list/country',
          icon: 'flag',
          class: '',
        },
        {
          title: 'State',
          path: '/list/states',
          icon: 'business',
          class: '',
        },
        {
          title: 'District',
          path: '/list/district',
          icon: 'location_city',
          class: '',
        },
      ],
      icon: 'list_alt', class: '', onlyAdmin: true, onlySchoolAdmin: false
    },
    {
      path: '', title: 'School',
      subMenu: [
        {
          title: 'School',
          path: '/school/list',
          icon: 'school',
          class: '',
        },
        {
          title: 'Admin',
          path: '/school/admin',
          icon: 'person',
          class: '',
        },
        {
          title: 'Sub Admin',
          path: '/school/sub-admin',
          icon: 'people',
          class: '',
        }
      ],
      icon: 'history_edu', class: '', onlyAdmin: false, onlySchoolAdmin: true
    },
    {
      path: '/endorsments', title: 'Endorsments',
      subMenu: [],
      icon: 'subject', class: '', onlyAdmin: true, onlySchoolAdmin: false
    },
    {
      path: '/teachers', title: 'Teachers',
      subMenu: [],
      icon: 'escalator_warning', class: '', onlyAdmin: false, onlySchoolAdmin: false
    },
    {
      path: '/students', title: 'Students',
      subMenu: [],
      icon: 'child_care', class: '', onlyAdmin: true, onlySchoolAdmin: false
    },
    {
      path: '/questionnaire', title: 'Questionnaire',
      subMenu: [],
      icon: 'live_help', class: '', onlyAdmin: false, onlySchoolAdmin: false
    },
    // {
    //   path: '/doked-list', title: 'DokedList',
    //   subMenu: [
    //     {
    //       title: 'Reports',
    //       path: '/doked-list/reports',
    //       icon: 'report',
    //       class: '',
    //     }
    //   ],
    //   icon: 'receipt_long', class: '', onlyAdmin: false, onlySchoolAdmin: false
    // },
    {
      path: '/report-list', title: 'ReportList',
      subMenu: [],
      icon: 'report', class: '', onlyAdmin: false, onlySchoolAdmin: false
    },
    {
      path: '/gredes', title: 'Grades',
      subMenu: [],
      icon: 'grade', class: '', onlyAdmin: false, onlySchoolAdmin: false
    }
  ]

  public static SchoolAdminRoutes = [
    { path: '/dashboard', title: 'Dashboard', subMenu: [], icon: 'grid_view', class: '', onlyAdmin: false, onlySchoolAdmin: false },
    {
      path: '', title: 'School',
      subMenu: [
        {
          title: 'School',
          path: '/school/list',
          icon: 'school',
          class: '',
        },
        {
          title: 'Sub Admin',
          path: '/school/sub-admin',
          icon: 'people',
          class: '',
        }
      ],
      icon: 'history_edu', class: '', onlyAdmin: false, onlySchoolAdmin: true
    },
    {
      path: '/teachers', title: 'Teachers',
      subMenu: [],
      icon: 'escalator_warning', class: '', onlyAdmin: false, onlySchoolAdmin: false
    },
    {
      path: '/students', title: 'Students',
      subMenu: [],
      icon: 'child_care', class: '', onlyAdmin: true, onlySchoolAdmin: false
    },
    // {
    //   path: '/doked-list', title: 'DokedList',
    //   subMenu: [],
    //   icon: 'receipt_long', class: '', onlyAdmin: false, onlySchoolAdmin: false
    // },
    {
      path: '/report-list', title: 'ReportList',
      subMenu: [],
      icon: 'report', class: '', onlyAdmin: false, onlySchoolAdmin: false
    }
  ]

  public static SchoolSubAdminRoutes = [
    { path: '/dashboard', title: 'Dashboard', subMenu: [], icon: 'grid_view', class: '', onlyAdmin: false, onlySchoolAdmin: false },
    {
      path: '', title: 'School',
      subMenu: [
        {
          title: 'School',
          path: '/school/list',
          icon: 'school',
          class: '',
        }
      ],
      icon: 'history_edu', class: '', onlyAdmin: false, onlySchoolAdmin: true
    },
    {
      path: '/teachers', title: 'Teachers',
      subMenu: [],
      icon: 'escalator_warning', class: '', onlyAdmin: false, onlySchoolAdmin: false
    },
    {
      path: '/students', title: 'Students',
      subMenu: [],
      icon: 'child_care', class: '', onlyAdmin: true, onlySchoolAdmin: false
    },
    // {
    //   path: '/doked-list', title: 'DokedList',
    //   subMenu: [],
    //   icon: 'receipt_long', class: '', onlyAdmin: false, onlySchoolAdmin: false
    // },
    {
      path: '/report-list', title: 'ReportList',
      subMenu: [],
      icon: 'report', class: '', onlyAdmin: false, onlySchoolAdmin: false
    }
  ]

  public static TeachersRoutes = [
    { path: '/dashboard', title: 'Dashboard', subMenu: [], icon: 'grid_view', class: '', onlyAdmin: false, onlySchoolAdmin: false },
    {
      path: '', title: 'Students',
      subMenu: [
        {
          title: 'Student',
          path: '/students/list',
          icon: 'child_care',
          class: '',
        },
        {
          title: 'Add DokEdform',
          path: '/students/dokDataForm',
          icon: 'feed',
          class: '',
        }
      ],
      icon: 'child_care', class: '', onlyAdmin: true, onlySchoolAdmin: false
    },
    {
      path: '/report-list', title: 'ReportList',
      subMenu: [],
      icon: 'report', class: '', onlyAdmin: false, onlySchoolAdmin: false
    }
  ]
}
