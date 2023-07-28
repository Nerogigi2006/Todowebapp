
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  @ViewChild ('myModal') myModal:any;
  @ViewChild('myViewModal') myViewModal:any
  public Users:any = []; 
  Status = ["Todo", 'Inprogress', "Done"]
  public role:string = "";
  public fullName : string = "";
  TodoForm! : FormGroup
  admin: boolean = false;
  Todos: any;
  progress: any;
  isChecked: boolean = false;
  Todores: any;
  Done: any;
  searchText: any;

  constructor(private api: ApiServiceService, private auth : AuthService, private userStore: UserStoreService, private fb : FormBuilder, private snackbar:SnackbarService){}
  ngOnInit(): void {
    const userId = localStorage.getItem("userId");
 this.api.GetTodoStatus(userId).subscribe({
  next:(res=>{
    console.log("response", res)
    this.Todos= res;
  })
 })

 this.api.GetInprogressStatus(userId).subscribe({
  next:(res)=>{
    this.progress = res
     this.progress.forEach((item:any) => {
      const endTime = new Date(item.endDate).getTime();
      console.log(endTime, 'Time')
      const currentTime = new Date().getTime();
      
      // If the current time is greater than or equal to the end time, show the SweetAlert popup
      if (currentTime >= endTime) {   
        Swal.fire({
          icon: 'warning',
          title: 'Task End Time Reached!',
          text: `The task "${item.subject}" has reached its end time.`,
        });
      }
    });
  }
 })

 this.api.GetDoneStatus(userId).subscribe({
  next:(res)=>{
    this.Done = res;
  }
 })



 this.api.getTodobyUserId(localStorage.getItem('userId')).subscribe

    this.TodoForm=  this.fb.group ({
      id: [''],
      subject:['', Validators.required],
      description:['',Validators.required],
      userId:['',Validators.required],
      status: [''],
      startDate:[''],
      endDate:['',Validators.required]
    })

    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      console.log(this.role,'role' )
      if(this.role == 'User'){
        this.admin = true;
      }
      // this.admin.value.datecreated = new Date;
    })
  }
  
addNewTask(){
  this.TodoForm.reset()
  this.myModal.nativeElement.showModal();
}

selectedTodo: any;

ViewTask(todo: any) {
  this.isChecked = true; // Always set it to true when opening the modal
  this.selectedTodo = todo;
  this.myViewModal.nativeElement.showModal();
  this.TodoForm.patchValue({
    id: todo.id,
    subject: todo.subject,
    description: todo.description,
    status : todo.status,
    userId : todo.userId,
    startDate: todo.startDate,
    endDate: todo.endDate
  });
}

onSearch() {
  const userId = localStorage.getItem("userId");
  if(this.searchText == null ||  this.searchText.trim() === ""){
    this.api.GetTodoStatus(userId).subscribe({
      next:(res=>{
        console.log("response", res)
        this.Todos= res;
      })
     })
    
     this.api.GetInprogressStatus(userId).subscribe({
      next:(res)=>{
        this.progress = res
         this.progress.forEach((item:any) => {
          const endTime = new Date(item.endDate).getTime();
          console.log(endTime, 'Time')
          const currentTime = new Date().getTime();
          
          // If the current time is greater than or equal to the end time, show the SweetAlert popup
          if (currentTime >= endTime) {   
            Swal.fire({
              icon: 'warning',
              title: 'Task End Time Reached!',
              text: `The task "${item.subject}" has reached its end time.`,
            });
          }
        });
      }
     })
    
     this.api.GetDoneStatus(userId).subscribe({
      next:(res)=>{
        this.Done = res;
      }
     }) 
  } else{
  this.api.searchTodo(userId,this.searchText ).subscribe({
    next: (res) => {
      console.log(res[0].status, 'search');
      // Update the respective lists based on the status
      if(res[0].status == 'Todo'){
        this.Todos = res;
      } else if (res[0].status == 'Inprogress'){
        this.progress = res;
      }
      else{
        this.Done = res;
      }
    },
    error: (err) => {
      console.log('Error occurred while searching:', err);
    }
  })};
}


 

updateTodo(){
  this.api.updateTodo(this.TodoForm.value.id, this.TodoForm.value).subscribe({
    next:((res:any)=>{
      this.Todores = res
      this.ngOnInit()
      this.snackbar.showSuccess(res.message)
      console.log(this.Todores, 'update')
    })
  })
}

deleteTodo(){
  this.api.deleteTodo(this.TodoForm.value.id).subscribe({
    next: ((res: any) => {
      this.ngOnInit()
      this.snackbar.showSuccess(res.message)
    })
  })
}

saveTodo(){
  this.TodoForm.value.userId= localStorage.getItem("userId");
    if(this.TodoForm){
      this.api.saveTodo(this.TodoForm.value)
      .subscribe({
        next:(res=>{
          this.ngOnInit()
          this.snackbar.showSuccess(res.message)
        })
      })
    }
}

  logout(){
    this.auth.signOut();
  }

}
