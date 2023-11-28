// edit-employee.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
})
export class EditEmployeeComponent {
  docForm: FormGroup;
  
 
  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
    this.docForm = this.fb.group({
      id: ['',[Validators.required]],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+([ ]?[a-zA-Z])*')]],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required]],
      conformPassword: ['', [Validators.required]],
      role: [''],
      department: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      dob: ['', [Validators.required]],
      degree: [''],
      img: [''],
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.docForm.patchValue({
        img: file, // store the entire file object in the form
      });
    }
  }

  onSubmit() {
    if (this.docForm.valid) {
      // Get the value after ensuring the form is valid
      const id = this.docForm.get('id')?.value;
  
      if (id !== null) {
        this.http
          .put(`http://localhost:3000/api/editEmployee/${id}`, this.docForm.value)
          .subscribe(
            (response) => {
              console.log('Server response:', response);
              this.snackBar.open('Employee updated successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'end',
              });
            },
            (error) => {
              console.error('Server error:', error);
              this.snackBar.open('Error updating employee. Please try again.', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'end',
                panelClass: ['error-snackbar'],
              });
            }
          );
      } else {
        console.error('Employee ID is null');
      }
    }
  }
}  