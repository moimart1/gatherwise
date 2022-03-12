import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig, Environment } from '../../utils/config';
import { IUser } from './user.interface';

export const extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  private secrets = [];

  constructor(private config: AuthConfig) {
    super({
      passReqToCallback: true,
      secretOrKeyProvider: (req: any, payload: any, done: (err: any, result?: any) => void): any => {
        return this.secretOrKeyProvider(req, payload, done);
      },
      jwtFromRequest: extractJwt,
      audience: config.audience,
      algorithms: config.algorithms ?? ['RS256'],
      // For security reason, force to false if not local environment
      ignoreExpiration: [Environment.Development, Environment.Test].includes(process.env.NODE_ENV as Environment)
        ? config.ignoreExpiration ?? false
        : false,
    });
  }

  private secretOrKeyProvider(req: any, payload: any, done: (err: any, result?: any) => void) {
    const issuerFromPayload = String(req.decodedJwt?.iss);

    if (!this.config.issuer || !issuerFromPayload.startsWith(this.config.issuer)) {
      this.logger.warn(`Issuer '${issuerFromPayload}' unknown`);
      done(new UnauthorizedException('Not authorized'));
      return;
    }

    // Initialize secret function by issuer (one issuer by realm)
    if (!(issuerFromPayload in this.secrets)) {
      this.secrets[issuerFromPayload] = passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // Keycloak style by default for jwksUri
        jwksUri: `${issuerFromPayload}${this.config.jwksPath}`,
      });
    }

    return this.secrets[issuerFromPayload](req, payload, done);
  }

  validate(request: Request, payload: IUser): IUser {
    // Payload is already validate in middleware
    return payload;
  }
}
