import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.role; 

    const isAdmin = userRoles.includes('admin');
    
    if (!isAdmin) {
        console.log("is not admin")
      throw new UnauthorizedException('Access restricted to admin users');
    }
    console.log("is admin")
    return true;
  }
}