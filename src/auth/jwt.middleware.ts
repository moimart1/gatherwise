import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import { extractJwt } from './jwt.strategy';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Add decodedJwt attribute to request
    req['decodedJwt'] = decode(extractJwt(req)) as JwtPayload;
    next();
  }
}
