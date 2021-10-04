import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TeacherService } from 'src/app/services/teacher.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-teacher',
  templateUrl: './delete-teacher.component.html',
  styleUrls: ['./delete-teacher.component.css']
})
export class DeleteTeacherComponent implements OnInit {
  @Input() id: any;
  isLoading = false;

  constructor(public teachers: TeacherService, public modal: NgbActiveModal, public sharesservice: SharedService) { }

  ngOnInit(): void {
  }

  //Delete Teacher
  deleteTeacher() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.teachers.deleteTeacher(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharesservice.swalSuccess(res.message);
          //this.sharesservice.loggerSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.sharesservice.swalError(err);
      })
    }
  }

  //cancel
  cancel() {
    this.modal.close();
  }

}
