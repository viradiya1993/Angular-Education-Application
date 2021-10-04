import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';

import { AuthService } from 'src/app/auth/_service/auth.service';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { enableRtl } from '@syncfusion/ej2-base';
import { SharedService } from 'src/app/shared/services/shared.service';


enableRtl(true);

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userIsAuthenticated = false;
  location: Location;
  mobile_menu_visible: any = 0;
  private sidebarVisible: boolean;
  navbarTitle: any;
  showSidebar = false;
  role: any = '';
  @ViewChild('sidebar') sidebar: SidebarComponent;
  userData = {
    firstName: 'First Name',
    lastName: 'Last Name'
  };
  constructor(
    location: Location,
    public authservice: AuthService,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef
  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.getUserData();
  }

  ngOnInit() {
    this.role = this.sharedService.getRole();
  }

  getUserData() {
    this.authservice.currentUserSubject.subscribe((res: any) => {
      if (res) {
        this.userData = res.data;
      }
    });
  }

  logout() {
    this.authservice.logoutWithAPI();
  }



  public open(event) {
    // console.log(event);

    // console.log("Sidebar Opened");
  }

  public close(event) {
    // console.log(event);

    // console.log("Sidebar Closed");
  }

  toggleClick() {
    this.showSidebar = !this.showSidebar;
    // this.sidebar.toggle();
  }
  closeClick() {
    this.showSidebar = !this.showSidebar;
    this.sidebar.hide();
  }
}
