import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Income } from './income';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'allow'
});

@Injectable()
export class IncomeService {
    //baseUrl = 'https://8080-aeac2e78-de33-4e8b-8a46-6b753e435163.ws-us02.gitpod.io/income/';
   baseUrl = 'http://192.168.1.8:8080/income/';
  //baseUrl = 'http://my-json-server.typicode.com/0x006E/Json-Test/income/';

  constructor(private http: HttpClient) { }

  getIncome() {
    return this.http.get<Income[]>(this.baseUrl, { headers });
  }
  getIncomeById(id: number) {
    return this.http.get<Income>(this.baseUrl + id, { headers });
  }
  createNewRecord(incomeData: Income) {
    let body = JSON.stringify(incomeData);
    return this.http.post(this.baseUrl, body, { headers });
  }
  deleteIncomeById(id: number) {
    return this.http.delete(this.baseUrl + id, { headers });
  }
  updateIncomeById(incomeData: Income) {
    let body = JSON.stringify(incomeData);
    return this.http.put(this.baseUrl, body, { headers });
  }

}
