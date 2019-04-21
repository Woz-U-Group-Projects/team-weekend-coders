import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
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
    //return this.http.get<Task[]>('http://localhost:8080/tasks');
    //2nd return for heroku deployment
    return this.http.get<Task[]>('tasks');
   }

  newTask(task: Task) {
    //1st return for local development
    //return this.http.post('http://localhost:8080/tasks', task);
    //2nd return for heroku deployment
    return this.http.post('tasks', task);

  }

  getTask(id: string): Observable<Task> {
    //1st return for local development
    //return this.http.get<Task>(`http://localhost:8080/tasks/${id}`);
    //2nd return for heroku deployment
    return this.http.get<Task>(`tasks/${id}`);
  }

  updateTask(task: Task) {
    //return this.http.put(`http://localhost:8080/tasks/${task._id}`, task);
    //2nd return for heroku deployment
    return this.http.put(`tasks/${task._id}`, task);
  }

  deleteTask(id: string) {
    //return this.http.delete(`http://localhost:8080/tasks/${id}`);
    //2nd return for heroku deployment
    return this.http.delete(`tasks/${id}`);
  }

}
