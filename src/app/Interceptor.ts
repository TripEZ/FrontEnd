import {Injectable} from '@angular/core';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor{


  intercept(request:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{

    request = request.clone({
      setHeaders:{
        "X-API-KEY": 'cc68NTIxNjoyMjI3OkdOUGtlV1ZoTndpSm5WYko',
      }
    });



    return next.handle(request);
  }
}
