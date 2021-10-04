import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from 'src/app/services/students.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css']
})
export class DeleteStudentComponent implements OnInit {
  @Input() id: any;
  isLoading = false;
  constructor(public students: StudentsService, public modal: NgbActiveModal, public sharedservice: SharedService) { }

  ngOnInit(): void {
  }
  
  //Delete Student
  deleteStudent() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.students.deleteStudent(this.id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          Swal.fire(res.message)
        }
      }, err => {
        this.isLoading = false;
        Swal.fire(err);
      })
    }
  }

   //Model close
   closed() {
    this.modal.close();
  }
}
