import { Component,OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStoreService } from 'src/app/services/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type: string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, 
    private auth: AuthService,
     private router: Router,
     private snackBar: SnackbarService,
     private userStore: UserStoreService,
     private toast: NgToastService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password"
  }

  onLogin() {
    if (this.loginForm.valid) {
  // Display success message using MatSnackBar
      console.log(this.loginForm.value);
      // Send the object to the database
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res => {
            if(res.code == "3"){
              this.snackBar.showError(res.message)
            }
           else{
            this.loginForm.reset();
            localStorage.setItem("userId", res.id)
            this.auth.storeToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();
            this.userStore.setRoleForStore(tokenPayload.role);
            this.userStore.setFullNameStore(tokenPayload.unique_name)
            this.snackBar.showSuccess("Login successful")
            console.log(res.message)
            this.router.navigate(['dashboard']);
           }
          })
        });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      // this.openSnackBar('Your form is invalid', 'error'); // Display invalid form message using MatSnackBar
    }
  }
  
  
  // openSnackBar(message: string, messageType: string) {
  //   let panelClass: string[];
  
  //   if (messageType === 'error') {
  //     panelClass = ['custom-snackbar', 'error-snackbar'];
  //   } else if (messageType === 'success') {
  //     panelClass = ['custom-snackbar', 'success-snackbar'];
  //   } else {
  //     panelClass = ['custom-snackbar'];
  //   }
  
  //   this.snackBar.open(message, 'Close', {
  //     duration: 3000,  // Display duration in milliseconds
  //     horizontalPosition: 'end',
  //     verticalPosition: 'top',
  //     panelClass: panelClass
  //   });
  // }
  
  }
