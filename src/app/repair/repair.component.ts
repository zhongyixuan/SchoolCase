import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpService } from '../http.service';
import { NotificationsService } from 'angular2-notifications';
import { DatePipe } from '@angular/common';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})

export class RepairComponent implements OnInit {

  schoolArea: any[] = ["校本部", "桃園校區"]
  fixType: any[] = ["工程類", "財物或勞務類", "資訊設備類"]
  identity: any[] = ["教職員", "學生"]
  level: any[] = ["嚴重", "中等", "普通"]
  speed: any[] = ["快速", "中等", "普通"];
  floorValueList: any[] = [];
  allFloorList: any[] = [];
  flooridList: any[] = [];
  locateList: any[] = [];
  placeList: any[] = [];
  fixItemList: any[] = [];
  departmentList: any[] = [];
  nextDepartmentList: any[] = [];
  schoolSystemList: any[] = [];
  facultyList: any[] = [];
  classList: any[] = [];
  placeOther: Boolean = false;
  fixItemOther: Boolean = false;
  isFaculty: Boolean = true;
  hasNextDepartment: Boolean = false;
  selectedSchoolArea = this.schoolArea[0];
  selectedFloor = "請選擇大樓";
  selectedLocate = "請選擇樓層";
  selectedPlace = "請選擇教室";
  selectedIdentity = "教職員";
  selectedFixType = "工程類";
  placeOtherValue;
  selectedLevel = "請選擇";
  selectedSpeed = "請選擇";
  selectedFixItem;
  fixItemOtherValue;
  damageStatus;
  selectedDepartment;
  selectedNextDepartment;
  selectedSchoolSystem;
  selectedFaculty;
  selectedSchoolClass;
  schoolNumber;
  repairName;
  phone;
  email;
  file: File = null;
  formData: FormData = new FormData();
  fileList: FileList;

  constructor(
    private _http: HttpService,
    private _service: NotificationsService,  //angular2-notifications的Service
    private _datepipe: DatePipe,
    private http: Http
  ) { }

  ngOnInit() {
    this.getSchoolAreaAFloor();
    this.getDefalutFixItem();
    this.getDepartment();
  }

  getSchoolAreaAFloor() { //預設取得校本部大樓
    this.floorValueList = ["中正紀念館", "五育樓", "六藝樓", "行政大樓", "承曦樓", "活動中心", "圖書館", "其他"]
  }

  getLocate(val) { //取得選取大樓之樓層
    this._http.getData("http://localhost:2422/api/floors/").subscribe(
      data => {
        for (let item of data) {
          if (item.floorName.trim() == val) {
            this._http.getData("http://localhost:2422/api/places/").subscribe(
              res => {
                for (let tmp of res) {
                  if (tmp.schoolFloor != null) {
                    if (tmp.schoolFloor.trim() == item.floor1) {
                      this.locateList.push(tmp.locate.trim())
                    }
                  }
                }
              }
            )
          }
        }
      }
    )
  }

  getPlaceName(val) { //取得該樓層所有教室
    this._http.getData("http://localhost:2422/api/places/").subscribe(
      data => {
        for (let place of data) {
          if (place.locate != null) {
            if (val == place.locate.trim()) {
              this.placeList.push(place.place_name.trim())
            }
          }
        }
      }
    )
  }

  getDefalutFixItem() {  //取得預設工程類的修繕物品
    this._http.getData("http://localhost:2422/api/fixItems").subscribe(
      data => {
        for (let item of data) {
          if (item.fixItemType == "1") {
            this.fixItemList.push(item.fixItemName)
            if (this.fixItemList.length == 1) {
              this.selectedFixItem = item.fixItemName;
            }
          }
        }
      }
    )
  }

  getFixItem(type) { //取得某報修屬性下的修繕物品
    let array: any[] = [];
    this.fixItemList = array;
    this._http.getData("http://localhost:2422/api/fixItems").subscribe(
      data => {
        for (let item of data) {
          if (item.fixItemType == type) {
            this.fixItemList.push(item.fixItemName)
            if (this.fixItemList.length == 1) {
              this.selectedFixItem = item.fixItemName;
            }
          }
        }
      }
    )
  }

  getDepartment() { //報修者為教職員時取得學校所有部門
    this._http.getData("http://localhost:2422/api/departments").subscribe(
      data => {
        for (let item of data) {
          if (item.d_no != "0") {
            if (item.superior != null && item.superior.trim() == "0") {
              this.departmentList.push(item.d_name)
              if (this.departmentList.length == 1) {
                this.selectedDepartment = item.d_name;
              }
            }
          }
        }
      }
    )
  }

  getNextDepartment(next) {  //如果非一級單位便取得下級單位
    let array: any[] = [];
    this.nextDepartmentList = array;
    this._http.getData("http://localhost:2422/api/departments").subscribe(
      data => {
        for (let item of data) {
          if (item.superior != null && item.superior.trim() != "0") {
            this._http.getData("http://localhost:2422/api/departments/" + item.superior.trim()).subscribe(
              res => {
                if (res.d_name.trim() == next.trim()) {
                  this.hasNextDepartment = true;
                  this.nextDepartmentList.push(item.d_name)
                  if (this.nextDepartmentList.length == 1) {
                    this.selectedNextDepartment = item.d_name
                  }
                }
              }
            )
          }
        }
      }
    )
  }

  getSchoolSystemList() { //取得學校所有學制
    this._http.getData("http://localhost:2422/api/RGP_Edu02").subscribe(
      data => {
        for (let item of data) {
          this.schoolSystemList.push(item.Edu_Name.trim())
          if (this.schoolSystemList.length == 1) {
            this.selectedSchoolSystem = item.Edu_Name.trim()
          }
        }
      }
    )
  }

  getFacultyList(val) { //取得科系列表
    this._http.getData("http://localhost:2422/api/RGP_Edu02").subscribe(
      data => {
        for (let item of data) {
          if (item.Edu_Name.trim() == val) {
            this._http.getData("http://localhost:2422/api/RGP_Edu04").subscribe(
              res => {
                for (let faculty of res) {
                  if (faculty.Edu_No.trim() == item.Edu_No.trim()) {
                    this.facultyList.push(faculty.Dept_Name.trim())
                    if (this.facultyList.length == 1) {
                      this.selectedFaculty = faculty.Dept_Name.trim()
                    }
                  }
                }
              }
            )
          }
        }
      }
    )
  }

  getClassList(val) {  //取得班級列表
    this._http.getData("http://localhost:2422/api/RGP_Edu04").subscribe(
      data => {
        for (let item of data) {
          if (item.Dept_Name.trim() == val) {
            this._http.getData("http://localhost:2422/api/RGP_Edu06").subscribe(
              res => {
                for (let cls of res) {
                  if (cls.Dept_No.trim() == item.Dept_No.trim()) {
                    this.classList.push(cls.Class_Name.trim())
                    if (this.classList.length == 1) {
                      this.selectedSchoolClass = cls.Class_Name.trim()
                    }
                  }
                }
              }
            )
          }
        }
      }
    )
  }

  schoolAreaChanged(val: any) { //下拉式選單校區改變時執行的方法
    let array: any[] = [];
    this.locateList = array;
    this.placeList = array;

    if (val == 0) {
      this.getSchoolAreaAFloor();
      this.getLocate("中正紀念館");
      this.getPlaceName("中正紀念館1樓")
    }

    if (val == 1) {
      this.floorValueList = ["弘毅樓", "公能樓", "北商學舍"]
      this.getLocate("弘毅樓");
      this.getPlaceName("弘毅樓1樓")
    }
  }

  floorChanged(val: any) {  //選擇大樓改變時執行的方法
    let array: any[] = [];
    this.locateList = array;
    this.placeList = array;

    this.getLocate(val);
  }

  locateChanged(val: any) {  //樓層改變
    let array: any[] = [];
    this.placeList = array;

    this.getPlaceName(val);
  }

  placeChanged(val: any) { //選擇地點改變
    if (val == "其他") {  //若選擇其他，利用placeOther顯示input box讓使用者自行輸入地點
      console.log(val)
      this.placeOther = true;
    } else {
      this.placeOther = false;
    }
  }

  fixTypeChanged(val: any) {  //報修屬性改變
    switch (val) {
      case 0:
        this.getFixItem("1")
        break;
      case 1:
        this.getFixItem("2")
        break;
      case 2:
        this.getFixItem("3")
        break;
    }
  }

  fixItemChanged(val: any) {  //維修物品改變
    if (val.indexOf("其他") > 0) {  //若選擇其他，利用fixItemOther顯示input box讓使用者自行輸入物品
      this.fixItemOther = true;
    } else {
      this.fixItemOther = false;
    }
  }

  identityChanged(val: any) {  //報修者身分改變
    if (val == "學生") {
      this.isFaculty = false;
      this.getSchoolSystemList();
      this.getFacultyList("碩士班");  //預設顯示學制為碩士
      this.getClassList("會計財稅研究所")  //預設顯示科系所為會計財稅研究所
    } else {
      this.isFaculty = true;
    }
  }

  departmentChanged(val: any) {  //部門改變
    this.hasNextDepartment = false;
    this.getNextDepartment(val);
  }

  schoolSystemChanged(val: any) {  //學制改變
    let array: any[] = [];
    this.facultyList = array;
    this.getFacultyList(val);
  }

  facultyChanged(val: any) {  //科系所改變
    let array: any[] = [];
    this.classList = array;
    this.getClassList(val);
  }

  pictureAdd(event) {  //按下選擇照片按鈕時
    this.fileList = event.target.files;  //存入照片資料
    if (this.fileList.length > 0) {
      this.file = this.fileList[0];
      this.formData.append('uploadFile', this.file, this.file.name);
    }
  }

  checkImage(): Boolean {  //取得檔案類型，用來排除非圖檔檔案
    if (this.file != null) {
      let type = this.file.type.split("/")
      if (type[0] != "image") {
        return false
      } else {
        return true
      }
    }
  }

  uploadPicture() {
    if (this.file != null) {  //判斷使用者有無選擇檔案
      let type = this.file.type.split("/")
      if (type[0] != "image") {  //是否選擇圖檔
        this._service.warn(
          'Warn',
          '檔案請上傳圖檔',
          {
            timeOut: 2000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: false
          }
        )
      } else {  //是圖檔
        let headers = new Headers()
        let options = new RequestOptions({ headers: headers });
        let apiUrl1 = "http://localhost:2422/api/UploadFileApi";
        this.http.post(apiUrl1, this.formData, options)  //post圖檔方法
          .map(res => res.json())
          .catch(error => Observable.throw(error))
          .subscribe(
          data => console.log('success'),
          error => console.log(error)
          )
      }
    }
  }

  sendRepair() {  //按下送出紐的事件
    let repair: Object;
    if (this.selectedSchoolArea == undefined || this.selectedFloor == "請選擇大樓"
      || this.selectedLocate == "請選擇樓層" || this.selectedPlace == "請選擇教室") {  //確認使用者有選擇地點
      this._service.warn(
        'Warn',
        '請選擇報修地點',
        {
          timeOut: 2000,
          showProgressBar: false,
          pauseOnHover: false,
          clickToClose: false
        }
      )
    } else {
      if (this.selectedFixType != undefined && this.selectedFixItem != undefined) {
        if (this.fixItemOther && (this.fixItemOtherValue == undefined || this.fixItemOtherValue.length == 0)) {  //確認使用者有選擇維修物品
          this._service.warn(
            'Warn',
            '請填入修繕物品',
            {
              timeOut: 2000,
              showProgressBar: false,
              pauseOnHover: false,
              clickToClose: false
            }
          )
        }
        else {
          if (this.damageStatus == undefined || this.damageStatus.length == 0) {  //確認有輸入損壞狀況
            this._service.warn(
              'Warn',
              '請填入損壞狀況',
              {
                timeOut: 2000,
                showProgressBar: false,
                pauseOnHover: false,
                clickToClose: false
              }
            )
          } else {
            if (this.selectedIdentity != undefined) {
              if (!this.isFaculty && (this.schoolNumber == undefined || this.schoolNumber.length == 0)) {  //若為學生有填入學號
                this._service.warn(
                  'Warn',
                  '請填入學號',
                  {
                    timeOut: 2000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                  }
                )
              } else {
                if (this.repairName == undefined || this.repairName.length == 0) {  //確認是否填入姓名
                  this._service.warn(
                    'Warn',
                    '請填入姓名',
                    {
                      timeOut: 2000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    }
                  )
                } else {
                  if (this.phone == undefined || this.phone.length == 0) {  //確認填入電話
                    this._service.warn(
                      'Warn',
                      '請填入連絡電話',
                      {
                        timeOut: 2000,
                        showProgressBar: false,
                        pauseOnHover: false,
                        clickToClose: false
                      }
                    )
                  } else {
                    if (this.email == undefined || this.email == 0) {  //確認填入E-mail
                      this._service.warn(
                        'Warn',
                        '請填入E-mail',
                        {
                          timeOut: 2000,
                          showProgressBar: false,
                          pauseOnHover: false,
                          clickToClose: false
                        }
                      )
                    } else {
                      if (this.selectedLevel == undefined || this.selectedLevel == "請選擇") {  //確認有選擇事件等級
                        this._service.warn(
                          'Warn',
                          '請選擇事件等級',
                          {
                            timeOut: 2000,
                            showProgressBar: false,
                            pauseOnHover: false,
                            clickToClose: false
                          }
                        )
                      } else {
                        if (this.selectedSpeed == undefined || this.selectedSpeed == "請選擇") {  //確認有填入需求速別
                          this._service.warn(
                            'Warn',
                            '請選擇需求速別',
                            {
                              timeOut: 2000,
                              showProgressBar: false,
                              pauseOnHover: false,
                              clickToClose: false
                            }
                          )
                        } else {
                          let other_place: any;
                          let fixType: any;
                          let repair_stuff: any;
                          let unit: any;
                          let className: any;
                          let stu_no: any;
                          let date: number = Date.now();
                          let latest_date = this._datepipe.transform(date, 'yyyy/MM/dd');  //取得當天年月日
                          if (this.placeOther) {
                            other_place = this.placeOtherValue
                          }
                          for (let i = 0; i < this.fixType.length; i++) {
                            if (this.selectedFixType == this.fixType[i]) {
                              fixType = i + 1;
                            }
                          }
                          if (this.fixItemOther) {
                            repair_stuff = this.fixItemOtherValue;
                          } else {
                            repair_stuff = this.selectedFixItem;
                          }
                          this._http.getData("http://localhost:2422/api/places/").subscribe(  //取得使用者選擇地點的id
                            data => {
                              for (let item of data) {
                                if (item.place_name.trim() == this.selectedPlace.trim()) {

                                  if (this.isFaculty) {
                                    if (this.selectedNextDepartment == undefined || this.selectedNextDepartment.length == 0) {  //判斷教職員使用者所屬部門是否為一級單位
                                      this._http.getData("http://localhost:2422/api/departments").subscribe(  //取得教職員使用者的部門
                                        res => {  //由於Http requests非同步，若須使用response內容，需在subscribe裡使用
                                          for (let tmp of res) {
                                            if (this.selectedDepartment.trim() == tmp.d_name.trim()) {

                                              if (this.file == null) {  //使用者無上傳照片時
                                                let repair: Object = {
                                                  place_no: item.place_no,
                                                  other_place: other_place,
                                                  fixType: fixType,
                                                  repair_stuff: repair_stuff,
                                                  state_damage: this.damageStatus,
                                                  unit: tmp.d_no,
                                                  className: className,
                                                  stu_no: stu_no,
                                                  repair_name: this.repairName,
                                                  phone: this.phone,
                                                  e_mail: this.email,
                                                  event_level: this.selectedLevel,
                                                  speed: this.selectedSpeed,
                                                  repair_date: latest_date
                                                }

                                                this._http.postData("http://localhost:2422/api/repairapplications", repair).subscribe(  //post此筆維修申請
                                                  postData => {
                                                    this._service.success(
                                                      'Success',
                                                      '報修申請成功',
                                                      {
                                                        timeOut: 2000,
                                                        showProgressBar: false,
                                                        pauseOnHover: false,
                                                        clickToClose: false
                                                      }
                                                    )
                                                    console.log(postData)
                                                    window.location.reload();
                                                  },
                                                  error => { console.log(error) },
                                                  () => { }
                                                )
                                              } else {
                                                var check = this.checkImage();  //判斷使用者選擇檔案是否為圖檔
                                                if (check) {
                                                  let repair: Object = {
                                                    place_no: item.place_no,
                                                    other_place: other_place,
                                                    fixType: fixType,
                                                    repair_stuff: repair_stuff,
                                                    state_damage: this.damageStatus,
                                                    picture: "~/repair_upload/" + this.file.name,
                                                    unit: tmp.d_no,
                                                    className: className,
                                                    stu_no: stu_no,
                                                    repair_name: this.repairName,
                                                    phone: this.phone,
                                                    e_mail: this.email,
                                                    event_level: this.selectedLevel,
                                                    speed: this.selectedSpeed,
                                                    repair_date: latest_date
                                                  }

                                                  this._http.postData("http://localhost:2422/api/repairapplications", repair).subscribe(
                                                    postData => {
                                                      this.uploadPicture();  //上傳圖檔
                                                      this._service.success(
                                                        'Success',
                                                        '報修申請成功',
                                                        {
                                                          timeOut: 2000,
                                                          showProgressBar: false,
                                                          pauseOnHover: false,
                                                          clickToClose: false
                                                        }
                                                      )
                                                      console.log(postData)
                                                      window.location.reload();
                                                    },
                                                    error => { console.log(error) },
                                                    () => { }
                                                  )
                                                }
                                              }
                                            }
                                          }
                                        }
                                      )
                                    } else {  //非一級單位
                                      this._http.getData("http://localhost:2422/api/departments").subscribe(
                                        res => {
                                          for (let tmp of res) {
                                            if (this.selectedNextDepartment.trim() == tmp.d_name.trim()) {

                                              if (this.file == null) {
                                                let repair: Object = {
                                                  place_no: item.place_no,
                                                  other_place: other_place,
                                                  fixType: fixType,
                                                  repair_stuff: repair_stuff,
                                                  state_damage: this.damageStatus,
                                                  unit: tmp.d_no,
                                                  className: className,
                                                  stu_no: stu_no,
                                                  repair_name: this.repairName,
                                                  phone: this.phone,
                                                  e_mail: this.email,
                                                  event_level: this.selectedLevel,
                                                  speed: this.selectedSpeed,
                                                  repair_date: latest_date
                                                }

                                                this._http.postData("http://localhost:2422/api/repairapplications", repair).subscribe(
                                                  postData => {
                                                    this._service.success(
                                                      'Success',
                                                      '報修申請成功',
                                                      {
                                                        timeOut: 2000,
                                                        showProgressBar: false,
                                                        pauseOnHover: false,
                                                        clickToClose: false
                                                      }
                                                    )
                                                    console.log(postData)
                                                    window.location.reload();
                                                  },
                                                  error => { console.log(error) },
                                                  () => { }
                                                )
                                              } else {
                                                var check = this.checkImage();
                                                if (check) {
                                                  let repair: Object = {
                                                    place_no: item.place_no,
                                                    other_place: other_place,
                                                    fixType: fixType,
                                                    repair_stuff: repair_stuff,
                                                    state_damage: this.damageStatus,
                                                    picture: "~/repair_upload/" + this.file.name,
                                                    unit: tmp.d_no,
                                                    className: className,
                                                    stu_no: stu_no,
                                                    repair_name: this.repairName,
                                                    phone: this.phone,
                                                    e_mail: this.email,
                                                    event_level: this.selectedLevel,
                                                    speed: this.selectedSpeed,
                                                    repair_date: latest_date
                                                  }

                                                  this._http.postData("http://localhost:2422/api/repairapplications", repair).subscribe(
                                                    postData => {
                                                      this.uploadPicture();
                                                      this._service.success(
                                                        'Success',
                                                        '報修申請成功',
                                                        {
                                                          timeOut: 2000,
                                                          showProgressBar: false,
                                                          pauseOnHover: false,
                                                          clickToClose: false
                                                        }
                                                      )
                                                      console.log(postData)
                                                      window.location.reload();
                                                    },
                                                    error => { console.log(error) },
                                                    () => { }
                                                  )
                                                }
                                              }
                                            }
                                          }
                                        }
                                      )
                                    }
                                  } else {  //使用者若為學生
                                    className = this.selectedSchoolClass;
                                    stu_no = this.schoolNumber;

                                    if (this.file == null) {
                                      let repair: Object = {
                                        place_no: item.place_no,
                                        other_place: other_place,
                                        fixType: fixType,
                                        repair_stuff: repair_stuff,
                                        state_damage: this.damageStatus,
                                        className: className,
                                        stu_no: stu_no,
                                        repair_name: this.repairName,
                                        phone: this.phone,
                                        e_mail: this.email,
                                        event_level: this.selectedLevel,
                                        speed: this.selectedSpeed,
                                        repair_date: latest_date
                                      }

                                      this._http.postData("http://localhost:2422/api/repairapplications", repair).subscribe(
                                        postData => {
                                          this._service.success(
                                            'Success',
                                            '報修申請成功',
                                            {
                                              timeOut: 2000,
                                              showProgressBar: false,
                                              pauseOnHover: false,
                                              clickToClose: false
                                            }
                                          )
                                          console.log(postData)
                                          window.location.reload();
                                        },
                                        error => { console.log(error) },
                                        () => { }
                                      )
                                    } else {
                                      var check = this.checkImage();
                                      if (check) {
                                        let repair: Object = {
                                          place_no: item.place_no,
                                          other_place: other_place,
                                          fixType: fixType,
                                          repair_stuff: repair_stuff,
                                          state_damage: this.damageStatus,
                                          picture: "~/repair_upload/" + this.file.name,
                                          className: className,
                                          stu_no: stu_no,
                                          repair_name: this.repairName,
                                          phone: this.phone,
                                          e_mail: this.email,
                                          event_level: this.selectedLevel,
                                          speed: this.selectedSpeed,
                                          repair_date: latest_date
                                        }

                                        this._http.postData("http://localhost:2422/api/repairapplications", repair).subscribe(
                                          postData => {
                                            this.uploadPicture();
                                            this._service.success(
                                              'Success',
                                              '報修申請成功',
                                              {
                                                timeOut: 2000,
                                                showProgressBar: false,
                                                pauseOnHover: false,
                                                clickToClose: false
                                              }
                                            )
                                            console.log(postData)
                                            window.location.reload();
                                          },
                                          error => { console.log(error) },
                                          () => { }
                                        )
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          )
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@Pipe({  //過濾同樣陣列中重複資料的Pipe
  name: 'filterUnique',
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {

    // Remove the duplicate elements
    // let uniqueArray = value.filter(function (el, index, array) { 
    //   return array.indexOf(el) == index;
    // });

    let uniqueArray = Array.from(new Set(value));

    return uniqueArray;
  }
}

@Pipe({  //排序Pipe，http://www.fueltravel.com/blog/migrating-from-angular-1-to-2-part-1-pipes/
  name: 'orderBy',
  pure: false
})

export class OrderBy implements PipeTransform {

  static _orderByComparator(a: any, b: any): number {

    if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
      //Isn't a number so lowercase the string to properly compare
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
    }
    else {
      //Parse strings as numbers to compare properly
      if (parseFloat(a) < parseFloat(b)) return -1;
      if (parseFloat(a) > parseFloat(b)) return 1;
    }

    return 0; //equal each other
  }

  transform(input: any, [config = '+']): any {

    if (!Array.isArray(input)) return input;

    if (!Array.isArray(config) || (Array.isArray(config) && config.length == 1)) {
      var propertyToCheck: string = !Array.isArray(config) ? config : config[0];
      var desc = propertyToCheck.substr(0, 1) == '-';

      //Basic array
      if (!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+') {
        return !desc ? input.sort() : input.sort().reverse();
      }
      else {
        var property: string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
          ? propertyToCheck.substr(1)
          : propertyToCheck;

        return input.sort(function (a: any, b: any) {
          return !desc
            ? OrderBy._orderByComparator(a[property], b[property])
            : -OrderBy._orderByComparator(a[property], b[property]);
        });
      }
    }
    else {
      //Loop over property of the array in order and sort
      return input.sort(function (a: any, b: any) {
        for (var i: number = 0; i < config.length; i++) {
          var desc = config[i].substr(0, 1) == '-';
          var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
            ? config[i].substr(1)
            : config[i];

          var comparison = !desc
            ? OrderBy._orderByComparator(a[property], b[property])
            : -OrderBy._orderByComparator(a[property], b[property]);

          //Don't return 0 yet in case of needing to sort by next property
          if (comparison != 0) return comparison;
        }

        return 0; //equal each other
      });
    }
  }
}