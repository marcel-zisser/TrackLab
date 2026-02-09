import { computed, Injectable, signal } from '@angular/core';
import { EventData } from '@tracklab/models';

@Injectable({
  providedIn: 'root',
})
export class CopilotService {
  private readonly year = signal<number>(new Date().getFullYear());
  private readonly event = signal<EventData | null>(null);

  private readonly events = computed<EventData[]>(() => {
    
  });
  
}
