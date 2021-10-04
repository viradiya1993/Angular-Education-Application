import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/services/reports.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-reports',
  templateUrl: './delete-reports.component.html',
  styleUrls: ['./delete-reports.component.css']
})
export class DeleteReportsComponent implements OnInit {
  @Input() id: any;
  isLoading = false;
  constructor(public reportservice: ReportsService, public modal: NgbActiveModal, public sharedservice: SharedService) { }

  ngOnInit(): void {
  }
  
  //Delete Report
  deleteReport() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.reportservice.deleteReports(this.id).subscribe((res: any) => {
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

  //cancel
  cancel() {
    this.modal.close();
  }
}
