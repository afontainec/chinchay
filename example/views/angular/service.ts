import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class $MODELNAME$Service {

  private backend: string = environment.backend || '';
  private BASE_PATH: string;

  constructor(private http: HttpClient) { 
    this.BASE_PATH = `${this.backend}/api/$TABLE_NAME$`;
  }

  async new(user) {
    const request: any = await this.http.post(`${this.BASE_PATH}/new`, user).toPromise();
    return request.data; 
  }

  async template() {
    const request: any = await this.http.get(`${this.BASE_PATH}/template`).toPromise();
    return request.data; 
  }

  async find(search) {
    const request: any = await this.http.get(`${this.BASE_PATH}/find`, { params: search }).toPromise();
    return request.data; 
  }

  async count() {
    const request: any = await this.http.get(`${this.BASE_PATH}/count`).toPromise();
    return request.data; 
  }

  async findById(id) {
    const request: any = await this.http.get(`${this.BASE_PATH}/${id}`).toPromise();
    return request.data; 
  }

  async all() {
    return this.find({});
  }


  async update(id, values) {
    const request: any = await this.http.put(`${this.BASE_PATH}/${id}/edit`, values).toPromise();
    return request.data; 
  }

  async delete(id) {
    const request: any = await this.http.delete(`${this.BASE_PATH}/${id}`).toPromise();
    return request.data; 
  }

}
