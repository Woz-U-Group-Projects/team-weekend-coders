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
    //1st return for local development
    return this.http.get<Client[]>('http://localhost:8080/leads');
    //2nd return for heroku deployment
    //return this.http.get<Client[]>('leads');
   }

  newClient(client: Client) {
    console.log(JSON.stringify(client));
    //1st return for local development
    return this.http.post('http://localhost:8080/leads', client);
    //2nd return for heroku deployment
    //return this.http.post('leads', client);
   }   

  getClient(id: string): Observable<Client> {
    //1st return for local development
    return this.http.get<Client>(`http://localhost:8080/leads/${id}`);
    //2nd return for heroku deployment
    //return this.http.get<Client>(`leads/${id}`);
   }

  updateClient(client: Client) {
     this.isUpdatedClient = true;
    //1st return for local development
    return this.http.put(`http://localhost:8080/leads/${client._id}`, client);
    //2nd return for heroku deployment
    //return this.http.put(`leads/${client._id}`, client);
   }

  deleteClient(id: string) {
     //1st return for local development
     return this.http.delete(`http://localhost:8080/leads/${id}`);
     //2nd return for heroku deployment
     //return this.http.delete(`leads/${id}`);
   }

  SwitchIsUpdatedClient() {
     this.isUpdatedClient = !this.isUpdatedClient;
     console.log(this.isUpdatedClient);
   }
}
