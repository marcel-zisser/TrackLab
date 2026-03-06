import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CopilotService } from './copilot.service';
import { TracklabStore } from '@tracklab/store';

@Component({
  selector: 'tl-copilot',
  templateUrl: './copilot.component.html',
  styleUrl: './copilot.component.css',
  imports: [RouterModule],
  providers: [CopilotService, TracklabStore]
})
export class CopilotComponent {}
