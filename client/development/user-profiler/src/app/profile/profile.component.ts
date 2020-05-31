import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestService } from '../global/services/request.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  errorMessage: string;
  seconds = 5;
  user_id: string;
  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),
    Validators.minLength(10)]),
    dob: new FormControl('', Validators.required),
  })

  get email() {
    return this.profileForm.get('email');
  }
  get firstname() {
    return this.profileForm.get('firstname');
  }
  get lastname() {
    return this.profileForm.get('lastname');
  }
  get phone() {
    return this.profileForm.get('phone');
  }
  get dob() {
    return this.profileForm.get('dob');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requests: RequestService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let token = params['token'];
      this.getUserDetail(token);
    });
  }

  getUserDetail(token) {
    this.errorMessage = "";
    this.user_id = "";
    this.requests.getRequest('/api/get-token-user/' + token).subscribe((data) => {
      if (data['message']) {
        this.showMessage(data['message']);
      } else {
        this.profileForm.setValue({
          email: data['email'],
          firstname: data['firstname'],
          lastname: data['lastname'],
          phone: data['phone'],
          dob: new Date(data['dob']).toISOString().substring(0, 10),
        });
        this.user_id = data['user_id'];
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.requests.patchRequest("/api/users/" + this.user_id, this.profileForm.value).subscribe((data) => {
        if (data['message']) {
          this.showMessage(data['message']);
        } else {
          this.showMessage("Successfully Updated");
        }
      });
    }
  }

  showMessage(message) {
    this.errorMessage = message;
    var interval = setInterval(() => {
      this.seconds--;
      if (this.seconds == 0){
        clearInterval(interval);
        this.router.navigate(['/home']);
      }
    }, 1000);
  }

}
