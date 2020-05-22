import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class $MODELNAME$Service {

  private backend: string = environment.backend;

  constructor(private http: HttpClient) { 
    this.BASE_PATH = `${this.backend}/api/$TABLE_NAME$`;
  }

  async new(user) {
    const request: any = await this.http.post(`${BASE_PATH}/new`, user).toPromise();
    return request.data; 
  }

  async find(search) {
    const request: any = await this.http.get(`${BASE_PATH}/find`, { params: search }).toPromise();
    return request.data; 
  }

  async count() {
    const request: any = await this.http.get(`${BASE_PATH}/count`).toPromise();
    return request.data; 
  }

  async findById(id) {
    const request: any = await this.http.get(`${BASE_PATH}/${id}`).toPromise();
    return request.data; 
  }

  async all() {
    return find();
  }


  async update(id, values) {
    const request: any = await this.http.put(`${BASE_PATH}/${id}/edit`, values).toPromise();
    return request.data; 
  }

  async delete(id) {
    const request: any = await this.http.delete(`${BASE_PATH}/${id}`).toPromise();
    return request.data; 
  }

}
