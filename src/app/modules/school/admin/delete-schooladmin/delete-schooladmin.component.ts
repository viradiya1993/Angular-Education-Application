import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { SchooladminService } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-schooladmin',
  templateUrl: './delete-schooladmin.component.html',
  styleUrls: ['./delete-schooladmin.component.scss']
})
export class DeleteSchooladminComponent implements OnInit {
  @Input() id: any;
  isLoading = false;
  subscriptions: Subscription[] = [];
  constructor(public schoolAdmin: SchooladminService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteAdmin() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.schoolAdmin.deleteSchoolAdmin(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          Swal.fire(res.message)
        }
      }, err => {
        this.isLoading = false;
        Swal.fire(err)
      })
    }
  }

  
}
