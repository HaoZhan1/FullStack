import { Injectable } from '@angular/core';
import {Problem} from '../models/problem.model';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
//import {PROBLEMS} from '../mock-problem';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {
  //problems: Problem[] = PROBLEMS;
  private problemDataService = new BehaviorSubject<Problem[]>([]);
  constructor(private HttpClient: HttpClient) { }

  //method1 behaviorSubject changes to Observable
  getProblems(): Observable<Problem[]> {
    //return this.problems;
    this.HttpClient.get('api/v1/problems')
      .toPromise()
      .then((res: any) => {
        this.problemDataService.next(res);
      })
      .catch(this.handleError);
    return this.problemDataService.asObservable();
  }
  //method2 return Promise
  getProblemById(id: number): Promise<Problem> {
   // return this.problems.find((problem) => problem.id === id);
    return this.HttpClient.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }
  //method3 return Promise
  addProblem(problem: Problem): Promise<Problem> {
    // problem.id = this.problems.length + 1;
    // this.problems.push(problem);
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return  this.HttpClient.post('api/v1/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
        return res;
      })
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}

