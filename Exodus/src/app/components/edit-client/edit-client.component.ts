import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  _id: string;
  client: Client = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    leadSource: '',
    leadOwner: '',
    leadStatus: '',
    leadNotes: ''
  };

  constructor(private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService
  ) { }

    ngOnInit() {
      //get id from url
      this._id = this.route.snapshot.params['id'];
      //get client
      this.clientService.getClient(this._id).subscribe(client => {
        this.client = client;
        //console.log(this.client);
      });
    }


    onSubmit({value, valid}: {value: Client, valid: boolean}) {
      if(!valid) {
        this.flashMessage.show('Please fill out the form correctly.', {
          cssClass: 'alert-danger', timeout: 4000
        });
      } else {
        // add id to client
        value._id = this._id;
        // update client
        this.clientService.updateClient(value).subscribe(res => {
          console.log(res);
        });
        this.flashMessage.show('Client updated.', {
          cssClass: 'alert-success', timeout: 4000
        });
        //this.router.navigate([`/client/${this._id}`]);
        //this.clientService.getClient(this._id)
        //  .subscribe(client => this.client = client);
      }
    }

}
