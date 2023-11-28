import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent {
  docForm: FormGroup;
  hide3 = true;
  agree3 = false;
  constructor(private fb: FormBuilder , private http: HttpClient,  private snackBar: MatSnackBar) {
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
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
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
      const formData = new FormData();
      Object.keys(this.docForm.value).forEach((key) => {
        formData.append(key, this.docForm.value[key]);
      });

      this.http.post('http://localhost:3000/api/addEmployee', formData)
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
            this.docForm.reset();
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

