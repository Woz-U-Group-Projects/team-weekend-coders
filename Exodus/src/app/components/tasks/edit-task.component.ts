import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Task } from '../../models/Task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  _id: string;
  task: Task = {
    title: '',
    content: ''
  };

  constructor(
    private taskService: TaskService,
    private flashMessage: FlashMessagesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
          //get id from url
          this._id = this.route.snapshot.params['id'];
          //get client
          this.taskService.getTask(this._id).subscribe(task => {
            this.task = task;
            //console.log(this.client);
          });
  }

  onSubmit({value, valid}: {value: Task, valid: boolean}) {
    if(!valid) {
      this.flashMessage.show('Please fill out the form correctly.', {
        cssClass: 'alert-danger', timeout: 4000
      });
    } else {
      // add id to task
      value._id = this._id;
      // update client
      this.taskService.updateTask(value).subscribe(res => {
        console.log(res);
      });
      this.flashMessage.show('Task updated.', {
        cssClass: 'alert-success', timeout: 4000
      });
      //this.router.navigate([`/client/${this._id}`]);
      //this.clientService.getClient(this._id)
      //  .subscribe(client => this.client = client);
    }
  }

}
