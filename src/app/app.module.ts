import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DefaultComponent } from './default/default.component';
import { DefnavbarComponent } from './defnavbar/defnavbar.component';
import { RepairComponent, FilterPipe, OrderBy} from './repair/repair.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from './http.service';
import { DatePipe } from '@angular/common';

/* Route import */
import { RouterModule, Routes } from '@angular/router';

/* Route */
// 一個Routes(包含多個Route的陣列),首先要包含path路徑，還有相對應路徑要配合的Component
const appRoutes: Routes = [
  { path: '', component: DefaultComponent },
  { path: 'repair', component: RepairComponent },
  { path: ':token', component: DefaultComponent },
  { path: 'relogin', component: DefaultComponent },
  { path: 'reloginerror', component: DefaultComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    DefnavbarComponent,
    RepairComponent,
    FilterPipe,
    OrderBy
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),//router是全專案唯一一個就必須加入此段
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    HttpModule,
    FormsModule
  ],
  providers: [HttpService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
