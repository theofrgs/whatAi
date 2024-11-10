import { Logger } from '@nestjs/common';

export abstract class ALoggerService {
  constructor(protected readonly logger = new Logger(this.constructor.name)) {}
}
