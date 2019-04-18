import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { colors } from './utils/colors';
import { Subject } from 'rxjs';

declare var require: any;

@Component({
  selector: 'CalendarComponent',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  modalData: {
    action: string;
    events: CalendarEvent[];
  };

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  events = [
    {
      start: new Date(),
      end: new Date('2019-04-19'),
      title: 'an event',
      color: colors.yellow
    },
    {
      start: new Date(),
      end: new Date('2019-04-19'),
      title: 'another event',
      color: colors.red
    }
  ];

  clickedDate: Date;

  refresh: Subject<any> = new Subject();  

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event.title);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  addEvent(): void {
    var today = new Date();
    var tomorrow = new Date(today.getTime()+(24 * 60 * 60 * 1000));
    this.events = [
      ...this.events,
      {
      start: new Date(today),
      end: new Date(tomorrow),
      title: 'a new event',
      color: {primary: '#1e90ff', secondary:'#D1E8FF'}
        }
    ];
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }
}
