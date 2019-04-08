import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'

import { Client } from '../models/Client';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clientsCollection: AngularFirestoreCollection<Client>;
  clientDoc: AngularFirestoreDocument<Client>;
  clients: Client[] = [];
  client: Client;
  
  constructor(private afs: AngularFirestore, private http: HttpClient) {
    this.clientsCollection = this.afs.collection('clients', ref => ref.orderBy('lastName', 'asc'));
   }

  getClients() {
    return this.http.get('http://localhost:3001/leads');
   }

   newClient(client: Client) {
    console.log(JSON.stringify(client));
    return this.http.post('http://localhost:3001/leads', client);
   }   

   getClient(id: string) {
    return this.http.get(`http://localhost:3001/leads/${id}`);
   }

   updateClient(client: Client) {
     return this.http.put(`http://localhost:3001/leads/${client._id}`, client);
   }

   deleteClient(id: string) {
     return this.http.delete(`http://localhost:3001/leads/${id}`);
   }
}
