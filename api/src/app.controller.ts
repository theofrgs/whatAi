import { Controller, Get, HttpStatus } from '@nestjs/common';
import { Public } from './services/decorators/controller.decorators';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('health')
  checkHealth() {
    return HttpStatus.OK;
  }
}
