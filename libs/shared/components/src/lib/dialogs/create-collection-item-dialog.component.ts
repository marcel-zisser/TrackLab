import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'tl-create-collection-item-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Textarea,
    InputText,
    Message,
    FloatLabel,
  ],
  templateUrl: './create-collection-item-dialog.component.html',
  styleUrl: './create-collection-item-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCollectionItemDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(DynamicDialogRef);

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.ref.close(this.form.value);
  }
}
