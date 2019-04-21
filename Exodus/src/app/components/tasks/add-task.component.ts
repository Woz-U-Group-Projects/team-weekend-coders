import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/Task';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  tasks: Task[];
  task: Task = {
    title: '',
    content: ''
  }

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.taskService.getTasks()
      .subscribe(tasks => this.tasks = tasks);
  }

  onSubmit({value, valid}: {value: Task, valid: boolean}) {
    //console.log(value, valid);
    if(!valid) {
      this.flashMessage.show("Please fill out the form correctly", {
        cssClass: 'alert-danger', timeout: 4000
      }); 
    } else {
      //add new client
      //this.clients.push(this.client);
      this.taskService.newTask(value).subscribe(task => {
        console.log(task)
      });

      //show flash message
      this.flashMessage.show("New task added", {
        cssClass: 'alert-success', timeout: 4000
      }); 

      //redirect to dashboard
      this.router.navigate(['/tasks']);
      this.taskService.getTasks()
      .subscribe(tasks => this.tasks = tasks);
    }
  }

}
