import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }
  hostname=environment.apiUrl
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
