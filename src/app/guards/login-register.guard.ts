import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterGuard implements CanActivate {
  constructor (private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      var token = localStorage.getItem("accesstokenid");
      
      if(token!=null){
        return true;
      }else{
        this.router.navigateByUrl('/login');
        return false;
      }
  }
  
}
