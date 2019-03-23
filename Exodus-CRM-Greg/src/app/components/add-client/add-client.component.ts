import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from "angular2-flash-messages";
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client'
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {
  client: Client = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  }

  disableBalanceOnAdd: boolean = true;

  constructor(private flashMessage: FlashMessagesService,
    private clientService: ClientService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit({value, valid}: {value: Client, valid: boolean}) {
    //console.log(value, valid);
    if(!valid) {
      this.flashMessage.show("Please fill ouu the form correctly", {
        cssClass: 'alert-danger', timeout: 4000
      }); 
    } else {
      //add new client
      this.clientService.newClient(value);

      //show flash message
      this.flashMessage.show("New client added", {
        cssClass: 'alert-success', timeout: 4000
      }); 

      //redirect to dashboard
      this.router.navigate(['/']);
    }
  }

}
