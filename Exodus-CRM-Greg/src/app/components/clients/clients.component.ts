import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';

import { Client } from '../../models/Client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[];
  private clientsSub: Subscription;

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getClients()
      .subscribe(clients => this.clients = clients);
    //this.clientsSub = this.clientService.getClientUpdateListener()
    //  .subscribe((clients: Client[]) => {
    //    this.clients = clients;
    //    console.log(clients);
    //  });
      //console.log(this.clients);
  }
}
