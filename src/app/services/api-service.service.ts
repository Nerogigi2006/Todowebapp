import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private baseUrl: string = 'https://localhost:7138/api/Staff/';
  private todoUrl: string ='https://localhost:7209/api/Todolist/'
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(this.baseUrl)
  }

  saveTodo(todoObj:any){
    return this.http.post<any>(`${this.todoUrl}addtodolist`,todoObj);
  }
  getTodobyUserId(userId:any){
    return this.http.get<any>('https://localhost:7209/api/Todolist/tickets/user/' + userId);
  }
  GetInprogressStatus(userId:any){
    return this.http.get<any>('https://localhost:7209/api/Todolist/Todo?status=Inprogress&userId=' + userId)
  }
  GetTodoStatus(userId:any){
    return this.http.get<any>('https://localhost:7209/api/Todolist/Todo?status=Todo&userId=' + userId)
  }
  GetDoneStatus(userId:any){
    return this.http.get<any>('https://localhost:7209/api/Todolist/Todo?status=Done&userId=' + userId)
  }
  updateTodo(Id:any, TodoData:any): Observable<any>{
    const url = `${this.todoUrl}updatetodolist/${Id}`
    return this.http.put<any>( url, TodoData)
  }
  deleteTodo(id:any){
    return this.http.delete<any>('https://localhost:7209/api/Todolist/deletetodolist/' + id);
  }
  searchTodo(userId:any,searchText:any){
    return this.http.get<any>(`https://localhost:7209/api/Todolist/searchtodolist?userId=${userId}&query=${searchText}`)
  }
}
