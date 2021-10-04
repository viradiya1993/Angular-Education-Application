import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question-box',
  templateUrl: './question-box.component.html',
  styleUrls: ['./question-box.component.css']
})
export class QuestionBoxComponent implements OnInit {
  @Input() questionArray: any;
  questionArrayWithDefault = [];
  constructor(
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    // console.log(this.questionArray);
    this.questionArrayWithDefault = this.questionArray.queAns.filter(x => (x.dafalut === true && x.otherAns))
  }
  cancel() {
    this.modal.close();
  }
}
