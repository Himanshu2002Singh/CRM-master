import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project, ProjectAdapter } from './project.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private trash: Set<number> = new Set([]);
  private _projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  public readonly projects: Observable<Project[]> = this._projects.asObservable();
  private readonly API_URL = 'http://localhost:3000/projects';

  constructor(private adapter: ProjectAdapter, private httpClient: HttpClient) {
    // Fetch projects from the server when the service is initialized
    this.getAllProjects();
  }

  getAllProjects(): void {
    this.httpClient.get<Project[]>(this.API_URL).subscribe(
      (data) => {
        this._projects.next(data.map((item) => this.adapter.adapt(item)));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private compareProjectGravity(a: Project, b: Project): number {
    if (a.deadline !== null || b.deadline !== null) {
      return -(a.deadline! > b.deadline!) || +(a.deadline! < b.deadline!);
    } else {
      return b.priority - a.priority;
    }
  }

  public getObjects(): Observable<Project[]> {
    return this.projects.pipe(
      map((data) =>
        data
          .filter((item) => !this.trash.has(item.id))
          .sort(this.compareProjectGravity)
      )
    );
  }

  public getObjectById(id: number): Observable<Project | undefined> {
    return this.projects.pipe(
      map((data) =>
        data.find((item) => item.id === id)
      )
    );
  }

  public createObject(project: any): void {
    this.httpClient.post<Project>(this.API_URL, project).subscribe(
      (newProject) => {
        this._projects.next([...this._projects.value, this.adapter.adapt(newProject)]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public updateObject(project: Project): void {
    this.httpClient.put<Project>(`${this.API_URL}/${project.id}`, project).subscribe(
      (updatedProject) => {
        const projects = this._projects.value ;
        const index = projects.findIndex((p) => p.id === updatedProject.id);
        if (index !== -1) {
          projects[index] = this.adapter.adapt(updatedProject);
          this._projects.next([...projects]);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public deleteObject(project: Project): void {
    this.httpClient.delete<void>(`${this.API_URL}/${project.id}`).subscribe(
      () => {
        this._projects.next(this._projects.value.filter((p) => p.id !== project.id));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public detachObject(project: Project): void {
    this.trash.add(project.id);
    this._projects.next(this._projects.value); // Force emit change for projects observers
  }

  public attachObject(project: Project): void {
    this.trash.delete(project.id);
    this._projects.next(this._projects.value); // Force emit change for projects observers
  }
}
