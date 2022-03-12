import { Controller, Get } from '@nestjs/common';
import { AppInfo } from '../utils/info';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Get application informations. Useful to know what is running
   */
  @Get()
  info(): AppInfo {
    return this.appService.info();
  }
}
