import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret'
    });
  }

  async validate(payload: any) {
    // payload: { user_id, role, email, iat, exp }
    return {
      user_id: payload.user_id,
      role: payload.role,
      email: payload.email
    };
  }
}


