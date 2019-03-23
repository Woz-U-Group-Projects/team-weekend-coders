import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  id: string;
  client: Client;

  constructor(private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    //get id from url
    this.id = this.route.snapshot.params['id'];
    //get client
    this.clientService.getClient(this.id).subscribe(client => {
      this.client = client;
      //console.log(this.client);
    });
  }

  onDeleteClick() {
    if(confirm('Are you sure?')) {
      this.clientService.deleteClient(this.client);
      this.flashMessage.show('Client removed', {
        cssClass: 'alert-success', timeout: 4000
      });
      this.router.navigate(['/']);
    }
  }
}
