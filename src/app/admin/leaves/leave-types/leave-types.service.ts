import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeaveTypes } from './leave-types.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class LeaveTypesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:3000/api/leavetypes';
  isTblLoading = true;
  dataChange: BehaviorSubject<LeaveTypes[]> = new BehaviorSubject<LeaveTypes[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData!: LeaveTypes;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): LeaveTypes[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllLeavess(): void {
    this.subs.sink = this.httpClient.get<LeaveTypes[]>(this.API_URL).subscribe({
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

  editLeaveType(leaveType: LeaveTypes): void {
    this.dialogData = leaveType;
    this.httpClient.put(`${this.API_URL}/${leaveType.id}`, leaveType)
        .subscribe({
          next: () => {
            this.dialogData = leaveType;
          },
          error: (error: HttpErrorResponse) => {
             // error code here
             console.error('Error updating leave:', error);
          },
        });
  }

  deleteLeaveType(id: number): void {
    console.log(id);

    this.httpClient.delete(`${this.API_URL}/${id}` )
        .subscribe({
          next: () => {
            console.log(id);
          },
          error: (error: HttpErrorResponse) => {
             // error code here
             console.error('Delete leaves Error:', error);
          },
        });
  }

  getLeaveTypeDetails(leaveType: LeaveTypes): void {
    // Implement your details logic here
    console.log('Viewing Details:', leaveType);
    // You may want to show a modal or navigate to a details page with more information
  }

}
