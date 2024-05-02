import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  static configService: ConfigService;
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshStrategy.extractTokenFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refresh_token.key'),
      signOptions: {
        expiresIn: configService.get<string>('jwt.refresh_token.expiresIn'),
      },
    });
  }
  private static extractTokenFromCookie(req: Request): string | null {
    if (
      req.cookies &&
      configuration().jwt.refresh_token.cookie_name in req.cookies &&
      req.cookies.refresh_token.length > 0
    ) {
      return req.cookies.refresh_token;
    }
    return null;
  }
  async validate(payload: any) {
    const { sub } = payload;
    const validatedUser = this.authService.validateUserJwt(sub);
    return validatedUser;
  }
}
