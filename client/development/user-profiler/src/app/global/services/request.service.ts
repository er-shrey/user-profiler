import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient
  ) { }

  postRequest(endPoint, body?){
    if(!body){
      body = [];
    }
    return this.http.post(endPoint, body);
  }
  
  getRequest(endPoint, body?){
    if(!body){
      body = [];
    }
    return this.http.get(endPoint, body);
  }
  
  patchRequest(endPoint, body?){
    if(!body){
      body = [];
    }
    return this.http.patch(endPoint, body);
  }
  
  deleteRequest(endPoint, body?){
    if(!body){
      body = [];
    }
    return this.http.delete(endPoint, body);
  }
  
}
