import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  type: string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private snackbar: SnackbarService){}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      userName:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password"
  }
  onSignup(){
    if(this.signUpForm.valid){
      //perform logic signup
      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next: (res=>{
          if(res.code == "5"){
            this.snackbar.showError(res.message)
            console.log(res.message)
          } else if(res.code =="1"){
            this.snackbar.showError(res.message)
          } else if(res.code == "2"){
            this.snackbar.showError(res.message)
          }
          else{
              this.snackbar.showSuccess(res.message);
          console.log(res.message);
          this.signUpForm.reset();
          this.router.navigate(['login'])
          }
        
          })
        })
    } else{
      //logic for throwing error
      ValidateForm.validateAllFormFields(this.signUpForm)
    }
  }
}
