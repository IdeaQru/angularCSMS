import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  selectedProvince: string = '';
  selectedCity: string = '';
  provinces: any[] = [];
  cities: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getProvinces();
  }

  getProvinces() {
    this.http.get('https://dev.farizdotid.com/api/daerahindonesia/provinsi')
      .subscribe((response: any) => {
        this.provinces = response.provinsi;
      });
  }

  onProvinceChange() {
    if (this.selectedProvince) {
      this.getCities(this.selectedProvince);
    }
  }

  getCities(provinceId: string) {
    this.http.get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${provinceId}`)
      .subscribe((response: any) => {
        this.cities = response.kota_kabupaten;
      });
  }
}
