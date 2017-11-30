/**
 * Created by Dengshuo on 2017-11-04.
 */
import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, App, MenuController} from 'ionic-angular';

import {CarService} from '../../service/carService';
import {BrandDetail} from '../brandDetail/brandDetail';
import {isUndefined} from "ionic-angular/umd/util/util";

@Component({
  selector: 'second-main-page',
  templateUrl: 'secondMain.html',
  styles: ['secondMain.scss']
})
export class SecondMainPage implements OnInit {
  carList: Array<any> = [];
  type: string = 'suggests';
  lists: any = {};
  firstAlps: Array<any> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private carService: CarService,
              public app: App,
              public menu: MenuController) {
    menu.enable(true);
  }

  ngOnInit() {
    //推荐车型
    this.carList = this.carService.carList;

    //所有车型
    this.carSort(this.carService.allCarList);
  }

  carSort(carList): void {
    this.lists = {};
    this.firstAlps = [];
    carList.map((item) => {
      if (this.lists[item.firstALp] == null) {
        this.lists[item.firstALp] = [];
        this.lists[item.firstALp].push(item);
      } else {
        this.lists[item.firstALp].push(item);
      }
    });
    for (var key in this.lists) {
      this.firstAlps.push(key);
    }
  }

  //汽车搜索
  carName: string = '';
  selectedCarList = [];

  searchCar(): void {
    if (this.carName != '') {
      this.selectedCarList = [];
      for (var i = 0; i < this.carService.allCarList.length; i++) {
        if (this.carName != "" && (this.carService.allCarList[i].name.match(this.carName + ".*") || (this.carService.allCarList[i].spell.match(this.carName.toLowerCase() + ".*") != null))) {
          this.selectedCarList.push(this.carService.allCarList[i]);
        }
      }
      this.carSort(this.selectedCarList);
    } else {
      this.carSort(this.carService.allCarList);
    }

  }

  //旗下品牌
  brands:any = {};
  brandsType:any = [];
  allBrands:any = this.carService.brands;
  //选中的汽车名称
  selectedCarName:string='';

  openMenu(i): void {
    this.selectedCarName=i;
    this.brands = {};
    this.brandsType = [];

    this.allBrands[i].map((item) => {
      if (this.brands[item.type] == null) {
        this.brands[item.type] = [];
        this.brands[item.type].push(item);
      }
      else {
        this.brands[item.type].push(item);
      }
    });
    for (var key in this.brands) {
      this.brandsType.push(key);
    }
  }

  //查看分支
  toBrands(type:string,name:string):void {
    let brandChildren= this.brands[type];
    if(brandChildren != 'undefined'){
      for(let i=0;i<brandChildren.length;i++){
        if(brandChildren[i].hasOwnProperty('children')){
          if(brandChildren[i].name==name){
            this.navCtrl.push(BrandDetail,{
              carName:this.selectedCarName,
              data:brandChildren[i].children
            })
            break;
          }
        }
      }
    }
  }
}
