<<<<<<< HEAD
import {
  Component,
  OnInit
} from '@angular/core';
import {
  ClientService
} from '../../services/client.service';
import {
  Client
} from '../../models/Client';
import {
  Router,
  ActivatedRoute,
  Params
} from '@angular/router';
import {
  FlashMessagesService
} from 'angular2-flash-messages';
=======
import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
>>>>>>> 67f55c13e5d7ec54efd5f5a5e44af1165425f8c6

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  _id: string;
  client: Client;
  clients: Client[];
  show = false;

  constructor(private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute,
              private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    //get id from url
    this._id = this.route.snapshot.params['id'];
    //get client
    this.clientService.getClient(this._id)
      .subscribe(client => this.client = client);
  }

  onDeleteClick() {
    if (confirm('Are you sure?')) {
      this._id = this.route.snapshot.params['id'];
      this.clientService.deleteClient(this._id).subscribe(message => {
        console.log(message);
        
      });
      this.flashMessage.show('Client removed', {
        cssClass: 'alert-success',
        timeout: 4000
      });
      this.router.navigate(['/']);
      this.clientService.getClients()
<<<<<<< HEAD
        .subscribe((clients: Client[]) => {
          this.clients = clients;
          console.log(this.clients);
        });
=======
      .subscribe(clients => this.clients = clients);
>>>>>>> 67f55c13e5d7ec54efd5f5a5e44af1165425f8c6
    }
  }
}