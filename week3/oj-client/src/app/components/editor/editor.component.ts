import { Component, OnInit } from '@angular/core';
import  {CollaborationService} from "../../services/collaboration.service";
import {ActivatedRoute, Params} from "@angular/router";
import {DataService} from "../../services/data.service";

declare const ace:any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  sessionId: string;
  languages: string[] = ['Java', 'Python'];
  language: string = 'Java';
  editor: any;
  output: string = '';
  defaultContent = {
    'Java': `public class Example{
      public static void main(String[] args){
        // Type your code here
      }
    }`,
    'Python': `class Solution:
    def example():
      # Write your code here`
  }
  constructor(private collaboration: CollaborationService,
              private  route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
      this.collaboration.restoreBuffer();
    });

  }
  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();
    this.editor.$blockScrolling = Infinity;

    //init method
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    //register onchange fn to editor
    this.editor.on('change', (e) => {
      if(this.editor.lastAppliedChange != e) {
        //change method
        console.log('editor change' + JSON.stringify(e));
        this.collaboration.change(JSON.stringify(e));
      }
    });

  }
  resetEditor(): void {
    this.editor.setValue(this.defaultContent[this.language]);
    this.editor.getSession().setMode("ace/mode/"+this.language.toLowerCase());
  }
  setLanguage(language): void {
    this.language = language;
    this.resetEditor();
  }
  //once submit execute the code and return the result
  submit(): void {
    const userCode = this.editor.getValue();
    const data = {
      userCodes : userCode,
      language: this.language
    }
    this.dataService.result(data)
      .then(res => {
        this.output = res.text;
      });
  }


}
