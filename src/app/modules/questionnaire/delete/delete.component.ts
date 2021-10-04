import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  @Input() id: any;
  isLoading = false;
  constructor(
    public questionService: QuestionnaireService,
    public modal: NgbActiveModal,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
  }
  deleteQuestion() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.questionService.deleteQuestion(this.id).subscribe((res: any) => {
        if (res) {
          this.modal.close();
          this.sharedService.swalSuccess(res.message);
        }
      }, err => {
        this.sharedService.swalError(err);
      })
    }
  }

  //Model Close
  cancel() {
    this.modal.close();
  }

}
