import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  private sdk: NodeSDK;

  constructor(private readonly configService: ConfigService) {}

  async init(): Promise<void> {
    const telemetryConfig = this.configService.get('telemetry');

    if (!telemetryConfig.enabled) {
      this.logger.log('Telemetry is disabled');
      return;
    }

    try {
      // Set a timeout for initialization to prevent hanging
      const initPromise = this.initWithTimeout(telemetryConfig);
      await Promise.race([
        initPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('OpenTelemetry initialization timed out')), 5000)
        )
      ]);
    } catch (error) {
      this.logger.error('Failed to initialize OpenTelemetry', error);
      this.logger.warn('Continuing application startup without OpenTelemetry');
    }
  }

  private async initWithTimeout(telemetryConfig: any): Promise<void> {
    try {
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: telemetryConfig.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: telemetryConfig.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: telemetryConfig.environment,
      });

      const traceExporter = new OTLPTraceExporter({
        url: telemetryConfig.tracing.endpoint,
        timeoutMillis: 3000, // Add timeout for exporter
      });

      this.sdk = new NodeSDK({
        resource,
        traceExporter,
        instrumentations: [
          getNodeAutoInstrumentations(),
          new ExpressInstrumentation(),
          new HttpInstrumentation(),
          new NestInstrumentation(),
        ],
      });

      // Initialize the SDK
      await this.sdk.start();
      this.logger.log('OpenTelemetry initialized successfully');

      // Gracefully shut down the SDK on process exit
      process.on('SIGTERM', () => {
        this.sdk
          .shutdown()
          .then(() => this.logger.log('OpenTelemetry SDK shut down successfully'))
          .catch((error) => this.logger.error('Error shutting down OpenTelemetry SDK', error))
          .finally(() => process.exit(0));
      });
    } catch (error) {
      throw error;
    }
  }
}
