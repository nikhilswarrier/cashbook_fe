import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Expenditure } from './expenditure';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'allow'
});

@Injectable()
export class ExpenditureService {
  //baseUrl = 'http://192.168.1.8:8080/expenditure/';
  baseUrl = 'http://my-json-server.typicode.com/0x006E/Json-Test/expenditure/';

  constructor(private http: HttpClient) { }

  getExpenditure() {
    return this.http.get<Expenditure[]>(this.baseUrl, { headers });
  }
  getExpenditureById(id: number) {
    return this.http.get<Expenditure>(this.baseUrl + id, { headers });
  }
  createNewRecord(expenditureData: Expenditure) {
    let body = JSON.stringify(expenditureData);
    return this.http.post(this.baseUrl, body, { headers });
  }
  deleteExpenditureById(id: number) {
    return this.http.delete(this.baseUrl + id, { headers });
  }
  updateExpenditureById(expenditureData: Expenditure) {
    let body = JSON.stringify(expenditureData);
    return this.http.put(this.baseUrl, body, { headers });
  }
}