import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  checkHealth() {
    return HttpStatus.OK;
  }
}
