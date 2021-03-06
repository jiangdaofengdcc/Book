import { Component, ChangeDetectorRef, Output, EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
// import { DateUtilsProvider } from "../../providers/date-utils/date-utils";
/**
 * Generated class for the DatepickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'datepicker',
  templateUrl: 'datepicker.html',
})
export class DatepickerComponent {

  @Output("choose") _choose: EventEmitter<any> = new EventEmitter<any>();
  @Input("currentDate") _current: Date = new Date();
  @ViewChild(Slides) _slides: Slides;
  _choosedId: string = "";
  _showDate: Date = new Date();
  _dayNames: Array<string> = ["一", "二", "三", "四", "五", "六", "日"];
  _dates: Array<Date> = [];

  _slidesList: Array<any> = [1, 2];

  constructor(private cd: ChangeDetectorRef
  // ,  private dateUtil: DateUtilsProvider
  ) {
  }


  ngOnInit() {
    this._current.setDate(1);
    this.initDates(this._current);
  }
  /**
   * 初始化页面数据
   */
  initDates(_currentDate: Date = new Date()) {
    let week = _currentDate.getDay() - 1,
      tempList = [];
    for (let i = 0 - week; i < 42 - week; i++) {
      let tempDate = _currentDate,
        date = this.getDateFrom_currentDate(tempDate, i),
        inMonth = date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear(),
        isToDay = inMonth && date.getDate() === new Date().getDate();
      tempList.push({ id: date.getTime(), date, inMonth: !inMonth, isToDay
        // , day: this.dateUtil.GetLunarDay(date) 
      })
    }
    this._dates = tempList;
    this._showDate = new Date(this._current.getFullYear() + "/" + (this._current.getMonth() + 1) + "/" + this._current.getDate());
  }
  /**
   * 获取几天后的日期
   * @param fromDate 起始日期
   * @param dayInterval 天数
   */
  getDateFrom_currentDate(fromDate, dayInterval) {
    let curDate = new fromDate.constructor(fromDate.valueOf());
    curDate.setDate(curDate.getDate() + dayInterval);
    let year = curDate.getFullYear(),
      month = (curDate.getMonth() + 1) < 10 ? "0" + (curDate.getMonth() + 1) : (curDate.getMonth() + 1),
      day = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
    return new Date(year + "/" + month + "/" + day);
  };
  /**
   * 上个月
   */
  lastMonth() {
    this.changeMonth(-1);
    this.initDates(this._current);
  }
  /**
   * 下个月
   */
  nextMonth() {
    this.changeMonth(1);
    this.initDates(this._current);
  }
  /**
   * 改变日期月份
   */
  changeMonth(z) {
    this._current.setDate(1);
    this._current.setMonth(this._current.getMonth() + z);
    this._showDate = new Date(this._current.getFullYear() + "/" + (this._current.getMonth() + 1) + "/" + this._current.getDate());
  }
  /**
   * 选择当前某个日期
   */
  chooseItem(item) {
    this._choosedId = item.id;
    this._choose.emit(item);
  }
  /**
   * 改变
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initDates(this._current);
  }
  /**
    * 改变
    */
  slideChanged() {
    let index = this._slides.getActiveIndex();
    let isBeginning = this._slides.isBeginning();
    let isEnd = this._slides.isEnd();
    let that = this;
    console.log('isBeginning :', isBeginning, 'isEnd :', isEnd);
    console.log(this._slidesList[index])
    if (isEnd) {
      console.log(this._slidesList)
      this._slidesList.push(this._slidesList.length);

    } else if (isBeginning) {
      console.log(this._slidesList)
      this._slidesList.unshift(this._slidesList.length);

    }
  }
}
