import { Injectable } from '@nestjs/common';
import { AppInfo, info, toString } from '../utils/info';
@Injectable()
export class AppService {
  info(): AppInfo {
    return info;
  }

  infoToString(): string {
    return toString();
  }
}
