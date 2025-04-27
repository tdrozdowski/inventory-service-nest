import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TelemetryService } from './telemetry.service';
import { MetricsService } from './metrics.service';
import { MetricsInterceptor } from './metrics.interceptor';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    TelemetryService,
    MetricsService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [TelemetryService, MetricsService, LoggerService],
})
export class TelemetryModule implements OnModuleInit {
  constructor(private readonly telemetryService: TelemetryService) {}

  async onModuleInit() {
    await this.telemetryService.init();
  }
}
