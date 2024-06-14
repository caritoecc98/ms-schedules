import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { jwtConstants } from '../constants/jwt.constant';
  import axios from 'axios';
  
@Injectable()
export class AuthGuardSchedule implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_MS_USER_URL}api/v1/auth/verifyToken`, { token });
      if (response.data.valid) {
        return true;
      } else {
        return false;
      }
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.split(' ')[1];                                //acceder al token
    }
    return undefined;
  }
}