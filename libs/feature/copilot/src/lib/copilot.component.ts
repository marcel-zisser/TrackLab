import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'tl-copilot',
  templateUrl: './copilot.component.html',
  styleUrl: './copilot.component.css',
})
export class CopilotComponent implements OnInit{

ngOnInit() {
  this.getLiveData().subscribe(data => {
    console.log(data)
  });
}


  getLiveData(): Observable<any> {
  return new Observable(observer => {
    const source = new EventSource('http://localhost:3000/api/copilot/live-data/stream');

    source.onmessage = event => {
      observer.next(JSON.parse(event.data));
    };

    source.onerror = err => observer.error(err);

    return () => source.close();
  });
}

}
