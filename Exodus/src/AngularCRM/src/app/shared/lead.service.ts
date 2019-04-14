import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { LeadModel } from './lead-model.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  // create variables for current lead, and all leads
  selectedLead: LeadModel;
  leads: LeadModel[];
  readonly baseURL = 'http://localhost:3001/leads';
  constructor(public http: HttpClient) { }

// post lead to mongo
postLead(lead: LeadModel) {
  console.log('Lead posted successfully');
  console.table(lead);
  return this.http.post(this.baseURL, lead);
}
}
 