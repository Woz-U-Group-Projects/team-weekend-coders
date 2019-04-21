import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[];
  id: string;
  
  constructor(private taskService: TaskService,
    private flashMessage: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
    this.taskService.getTasks()
      .subscribe(tasks => this.tasks = tasks);
    console.log(this.tasks);
  }

  onDeleteClick(id: string) {
    if (confirm('Are you sure?')) {
      this.taskService.deleteTask(id).subscribe(message => {
        console.log(message);
      });
      this.flashMessage.show('Task removed!', {
        cssClass: 'alert-success', timeout: 4000
      });
     this.ngOnInit();
    }
  }

}
