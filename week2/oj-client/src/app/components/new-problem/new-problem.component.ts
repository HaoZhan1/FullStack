import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Problem} from '../../models/problem.model';

const DEFALUT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: '',
  desc: '',
  difficulty: 'easy'
});

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  newProblem: Problem = Object.assign({}, DEFALUT_PROBLEM);
  difficulties: String[] = ['easy', 'medium', 'hard', 'super'];
  constructor(private dataService: DataService) { }
  ngOnInit() {
  }
  addProblem() {
    this.dataService.addProblem(this.newProblem);
    this.newProblem = Object.assign({}, DEFALUT_PROBLEM);
  }

}
