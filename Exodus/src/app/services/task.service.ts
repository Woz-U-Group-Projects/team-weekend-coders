import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Task } from '../models/Task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks: Task[];

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    //1st return for local development
    return this.http.get<Task[]>('http://localhost:8080/tasks');
    //2nd return for heroku deployment
    //return this.http.get<Task[]>('tasks');
   }


}
