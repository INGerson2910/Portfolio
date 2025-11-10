import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient){}

  getTasks(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }

  addTask(task: {title: string}): Observable<any>{
    return this.http.post<any>(this.apiUrl, task);
  }

  updateTask(task: any): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
