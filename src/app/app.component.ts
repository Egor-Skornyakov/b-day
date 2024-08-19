import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {map, merge, Subject, timer} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  public startDate = new Date('2024-08-20T05:00:00.000Z');
  public clickSubject = new Subject();

  public cheasts = [
    {
      id: '1',
      opened: false,
      date: this.startDate,
      title: 'Title 1',
      text: 'text 1'
    },
    {
      id: '2',
      opened: false,
      date: this.startDate,
      title: 'Title 2',
      text: 'text 2'
    },
    {
      id: '3',
      opened: false,
      date: new Date(),
      title: 'Title 3',
      text: 'text 3'
    },
    {
      id: '4',
      opened: false,
      date: new Date(),
      title: 'Title 4',
      text: 'text 4'
    },
    {
      id: '5',
      opened: false,
      date: new Date(),
      title: 'Title 5',
      text: 'text 5'
    },
    {
      id: '6',
      opened: false,
      date: new Date(),
      title: 'Title 6',
      text: 'text 6'
    },
  ];

  public tick$ = merge(
    this.clickSubject,
    timer(0, 1000)).pipe(
    map(() => {
      const availableItems: number = this.calculateAvailable() > this.cheasts.length ? this.cheasts.length : this.calculateAvailable();
      const openedItems = this.cheasts.filter((i) => i.opened).length;
      const diff = availableItems - openedItems;
      return {
        availableToOpen: diff < 0 ? 0 : diff,
        openedItems,
        countDown: this.calculateCountDown(availableItems)
      };
    })
  );

  ngOnInit() {
    this.fillDatesNstatus();
  }

  public openCheast(cheast: any): void {
    cheast.opened = true;
    const openedCheasts = this.cheasts.filter((cheast) => cheast.opened);
    const openedCheastIds = openedCheasts.map((c) => c.id);
    localStorage.setItem('openedCheasts', JSON.stringify(openedCheastIds));
    this.clickSubject.next(null);
  }

  private calculateAvailable(): number {
    const now = new Date();
    const hoursDiff = Math.floor((now.getTime() - this.startDate.getTime()) / (60 * 60 * 1000));
    return hoursDiff > 0 ? hoursDiff : 0;
  }

  private calculateCountDown(index: number): string {
    const now = new Date();
    const duration = ( this.cheasts[index]?.date.getTime() - now.getTime());
    let milliseconds = Math.floor((duration % 1000) / 100);
    let  seconds: string | number = Math.floor((duration / 1000) % 60);
    let  minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
    let  hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  private fillDatesNstatus() {
    const openedIds = JSON.parse(localStorage.getItem('openedCheasts') || '[]');

    let count = 1;
    this.cheasts.forEach((item) => {
      const wasOpened = !!openedIds.find((id: any) => id === item.id);
      item.date = new Date(this.startDate.getTime() + count * 60 * 60 * 1000);
      item.opened = wasOpened;
      count++;
    })
  }


}
