import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { jwtConstants } from '../constants/jwt.constant';
  import axios from 'axios';
  
@Injectable()
export class AuthGuardSchedule implements CanActivate {
  constructor(private readonly jwtService: JwtService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    console.log('EXPO_PUBLIC_MS_USER_URL:', process.env.EXPO_PUBLIC_MS_USER_URL);
    try {
      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_MS_USER_URL}api/v1/auth/verifyToken`, { token });
      if (response.data.valid) {
        request.user= response.data.user
        console.log("token valido")
        return true;
      } else {
        console.log("token invalido")
        throw new UnauthorizedException('Invalid token');
      }
    } catch {
      throw new UnauthorizedException('Failed to verify token');
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