import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employees } from './employees.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class EmployeesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:3000/allemployees';
  isTblLoading = true;
  dataChange: BehaviorSubject<Employees[]> = new BehaviorSubject<Employees[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData!: Employees;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Employees[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllEmployeess(): void {
    this.subs.sink = this.httpClient.get<Employees[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  addEmployees(employees: Employees): void {
    this.dialogData = employees;

    this.httpClient.post(this.API_URL, employees)
      .subscribe({
        next: () => {
          this.dialogData = employees;
          this.getAllEmployeess();
        },
        error: (error: HttpErrorResponse) => {
           // error code here
           console.error('Add Employees Error:', error);
        },
      });
  }
  updateEmployees(employees: Employees): void {
    this.httpClient.put<Employees>(`${this.API_URL}/${employees.id}`, employees).subscribe({
      next: () => {
        this.dialogData = employees;
        this.getAllEmployeess(); // Refresh the data after updating
      },
      error: (error: HttpErrorResponse) => {
        // Handle error
        console.error('Error updating employee:', error);
      },
    });
  }
  deleteEmployees(id: number): void {
    console.log(id);

    this.httpClient.delete(`${this.API_URL}/${id}`).subscribe({
          next: () => {
            console.log(id);
            this.getAllEmployeess();
          },
          error: (error: HttpErrorResponse) => {
             // error code here
             console.error('Delete Employees Error:', error);
          },
        });
  }
}
