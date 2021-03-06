import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DataService} from './services/data.service';
import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import {routing} from './app.routes';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
