import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }
  hostname='http://127.0.0.1:8000/'
   getData(url:any): Observable<any> {
    return this.http.get(`${this.hostname}${url}`);

  }
  postData(url:any,data:any): Observable<any> {
    return this.http.post(`${this.hostname}${url}`,data);

  }
  putData(url:any,data:any): Observable<any> {
    return this.http.put(`${this.hostname}${url}`,data);

  }
  patchData(url:any,data:any): Observable<any> {
    return this.http.patch(`${this.hostname}${url}`,data);

  }
}
