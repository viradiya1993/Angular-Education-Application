import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userId = null;
  currentYear: Date = new Date();
  showAboutUsSection: boolean = false
  constructor(
    private router: Router,
    private shared: SharedService
  ) {
    this.userId = localStorage.getItem('ID');
  }

  ngOnInit(): void {
    this.showAboutUsSection = false;

  }

  routeToUrl(value) {
    if (value) {
      this.shared.showLoader();
      this.router.navigate(['/auth/login']);
      this.shared.hideLoader();
    } else {
      this.shared.showLoader();
      this.router.navigate(['/dashboard']);
      this.shared.hideLoader();
    }
  }

  onClickAboutUs() {
    window.scroll(0, 0);
    this.showAboutUsSection = true;
  }

}
