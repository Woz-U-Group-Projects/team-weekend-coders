import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'

import { Client } from '../models/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clientsCollection: AngularFirestoreCollection<Client>;
  clientDoc: AngularFirestoreDocument<Client>;
  clients: Client[];
  client: Client;
  isUpdatedClient: boolean = false;

  constructor(private http: HttpClient) {
  
  }

  getClients(): Observable<Client[]> {
    //return this.http.get<Client[]>('http://localhost:3001/leads');
    return this.http.get<Client[]>('leads');
   }

  newClient(client: Client) {
    console.log(JSON.stringify(client));
    //return this.http.post('http://localhost:3001/leads', client);
    return this.http.post('leads', client);
   }   

   getClient(id: string): Observable<Client> {
    //return this.http.get<Client>(`http://localhost:3001/leads/${id}`);
    return this.http.get<Client>(`leads/${id}`);
   }

   updateClient(client: Client) {
     this.isUpdatedClient = true;
     //return this.http.put(`http://localhost:3001/leads/${client._id}`, client);
     return this.http.put(`leads/${client._id}`, client);
   }

   deleteClient(id: string) {
     //return this.http.delete(`http://localhost:3001/leads/${id}`);
     return this.http.delete(`leads/${id}`);
   }

   SwitchIsUpdatedClient() {
     this.isUpdatedClient = !this.isUpdatedClient;
     console.log(this.isUpdatedClient);
   }
}
