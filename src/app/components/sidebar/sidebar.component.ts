import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';

declare const $: any;



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  private role;

  userData: any;
  @HostListener('toggleDropdown') onClick(url) {
    let value = "dropdown" + url;
    // console.log(value);
    // console.log(document.getElementById(value));
    document.getElementById(value).addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    this.getUserData();
  }

  ngOnInit() {

    this.menuItems = this.sharedService.getRoutesForMenu();
    // this.menuItems = this.sharedService.ROUTES.filter(menuItem => menuItem);
  }

  getUserData() {
    this.authService.currentUserSubject.subscribe((res: any) => {
      if (res) {
        this.userData = res.data;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  toggleAsideClick() {
    document.body.classList.toggle('aside-minimize');
  }
}




