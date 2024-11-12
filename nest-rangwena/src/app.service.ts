import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  welcome() {
    return {
      title: 'Rangwena class of 2013',
      vue: this.configService.get<string>('VUE_FRONTEND'),
    };
  }
}
