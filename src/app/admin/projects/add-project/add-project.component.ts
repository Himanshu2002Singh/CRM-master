import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddprojectsComponent {
  projectForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  public Editor: any = ClassicEditor;
 
  constructor(private fb: UntypedFormBuilder ,private http: HttpClient,  private snackBar: MatSnackBar) {
    this.projectForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      department: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      client: ['', [Validators.required]],
      price: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      team: ['', [Validators.required]],
      status: ['', [Validators.required]],
      fileUpload: [''],
    });
  }
  onSubmit() {
    console.log('Form Value', this.projectForm.value);
    if (this.projectForm.valid) {
      const formData = new FormData();
      Object.keys(this.projectForm.value).forEach((key) => {
        formData.append(key, this.projectForm.value[key]);
      });
  

  this.http.post('http://localhost:3000/api/addprojects', formData)
        .subscribe(
          (response) => {
            console.log('Server response:', response);
            // Show a success Smessage
            this.snackBar.open('Employee added successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'end',
            });

            // You can also reset the form or redirect to another page after success
            this.projectForm.reset();
          },
          (error) => {
            console.error('Server error:', error);
            // Show an error message
            this.snackBar.open('Error adding employee. Please try again.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'end',
              panelClass: ['error-snackbar'], // You can define a custom CSS class for styling
            });
          }
        );
    }
  }
}
