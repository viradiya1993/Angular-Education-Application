import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GradesService } from 'src/app/services/grades.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-grades',
  templateUrl: './delete-grades.component.html',
  styleUrls: ['./delete-grades.component.css']
})
export class DeleteGradesComponent implements OnInit {
  @Input() id: any;
  isLoading = false;
  constructor(public gradeservice: GradesService, public modal: NgbActiveModal, public sharedservice: SharedService) { }

  ngOnInit(): void {
  }

   //Delete Grade 
   deleteGrade () {
    if (!this.isLoading) {
      this.isLoading = true;
      this.gradeservice.deleteGrdes(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          Swal.fire(res.message);
        }
      }, err => {
        this.isLoading = false;
        Swal.fire(err);
      })
    }
  }

  //cancel
  cancel() {
    this.modal.close();
  }
}
