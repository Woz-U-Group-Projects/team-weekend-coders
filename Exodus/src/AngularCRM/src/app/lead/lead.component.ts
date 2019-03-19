import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LeadService } from '../shared/lead.service';
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css'],
  providers: [LeadService]
})
export class LeadComponent implements OnInit {

  constructor(public leadService: LeadService) { }

  // reset form on component load
  ngOnInit() {
    this.resetForm();
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
  }
    this.leadService.selectedLead = {
      leadOwner: '',
      firstName: '',
      lastName: '',
      mobileNumber: null,
      leadSource: '',
      leadStatus: '',
      email: '',
      leadNotes: ''
  };
}

    // post lead and reset form values
  onSubmit(form: NgForm) {
    this.leadService.postLead(form.value).subscribe((res) => {
      this.resetForm(form);
      console.log('Lead submitted succesfully.');
    });
  }


}


