import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from "jwt-decode";


// const jwt_decode = require('jwt-decode');
// import * as jwt_decode from "jwt-decode";
// import * as jwt from 'jsonwebtoken';
// import { decode as jwt_decode } from 'jwt-decode';



import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token: any = localStorage.getItem('token');
    console.log(token);

    var tokenPayLoad: any;
    try {
      console.log("enters here but doesnt")
      tokenPayLoad = jwtDecode(token);
      console.log("Decoded payload:", tokenPayLoad);
      console.log("role", tokenPayLoad.role);

    } catch (error) {
      console.log("Error decoding token:", error);
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let expectedRole = '';

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayLoad.role) {
        expectedRole = tokenPayLoad.role;
      }
    }

    if (tokenPayLoad.role == 'user' || tokenPayLoad.role == 'admin') {
      if (this.auth.isAuthenticated() && tokenPayLoad.role == expectedRole) {
        return true;
      }
      this.snackbarService.openSnackbar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/cafe/dashboard']);
      return false;
    }
    else {
      this.router.navigate(['/']);
      localStorage.clear;
      return false;
    }
  }
}
