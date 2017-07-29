import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  token: any;
  hasToken: boolean = false;
  needRelogin: boolean = false;
  repairLists: Object[] = [];
  placeNameList: any[] = [];
  departmentNameList: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _service: NotificationsService,
    private _http: HttpService
  ) { }

  ngOnInit() {
    this.getRepairData();

    this.token = this.route.snapshot.params['token'];
    if (this.token) {
      sessionStorage.setItem('token', this.token);
      this.router.navigate(['/']);
    }
    if (sessionStorage.getItem('token')) {
      this.hasToken = true;
      if (sessionStorage.getItem('token') == "relogin") {
        sessionStorage.clear();
        window.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:4200/reloginerror";
      }
      if (sessionStorage.getItem('token') == "reloginerror") {
        sessionStorage.clear();
        this._service.error(
          'Error',
          'NTUB email only, please retry',
          {
            timeOut: 4000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: false
          }
        )
      }
    } else {
      this.hasToken = false;
    }
  }

  login() {
    window.location.href = "http://localhost:2422/register.html"
    window.event.returnValue = false;
  }

  logout() {
    sessionStorage.clear();
    window.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:4200/";
  }

  relogin() {
    sessionStorage.clear();
    window.location.href = "http://localhost:2422/register.html";
  }

  getRepairData(){
    this._http.getData("http://localhost:2422/api/repairapplications").subscribe(
      data => {
        for (let repairObj of data) {
          if (!(repairObj.dealing_process == "已完成")) {
            this.getRepairPlace(repairObj.place_no);
            this.getRepairDepartment(repairObj.r_d_no);
            this.repairLists.push(repairObj);
          }
        }
      },
      error => { console.log(error) },
      () => { }
    )
  }

  getRepairPlace(placeid) {
    this._http.getData("http://localhost:2422/api/places/" + placeid).subscribe(
      data => {
        this.placeNameList.push(data.place_name)
      },
      error => {
        console.log(error)
      },
      () => { }
    )
  }

  getRepairDepartment(departmentid){
    this._http.getData("http://localhost:2422/api/departments/" + departmentid).subscribe(
      data => {
        this.departmentNameList.push(data.d_name)
      },
      error => {
        console.log(error)
      },
      () => { }
    )
  }
}