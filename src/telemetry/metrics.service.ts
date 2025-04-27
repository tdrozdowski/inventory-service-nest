import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { metrics } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import {
  MeterProvider,
  MeterProviderOptions,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private meterProvider: MeterProvider;
  private enabled: boolean;
  private meters: Map<string, any> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.initMetrics();
  }

  private initMetrics(): void {
    const telemetryConfig = this.configService.get('telemetry');
    this.enabled = telemetryConfig.enabled && telemetryConfig.metrics.enabled;

    if (!this.enabled) {
      this.logger.log('Metrics are disabled');
      return;
    }

    try {
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: telemetryConfig.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]:
          telemetryConfig.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
          telemetryConfig.environment,
      });

      const metricExporter = new OTLPMetricExporter({
        url: telemetryConfig.metrics.endpoint,
      });

      const metricReader = new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: telemetryConfig.metrics.interval,
      });

      const meterProviderOptions: MeterProviderOptions = {
        resource,
        readers: [metricReader],
      };

      // Create and register the meter provider
      const meterProvider = new MeterProvider(meterProviderOptions);
      metrics.setGlobalMeterProvider(meterProvider);
      this.meterProvider = meterProvider;

      this.logger.log('Metrics initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize metrics', error);
    }
  }

  /**
   * Get a meter for a specific scope
   * @param name The name of the meter
   * @returns The meter
   */
  getMeter(name: string) {
    if (!this.enabled) {
      return null;
    }

    if (!this.meters.has(name)) {
      const meter = metrics.getMeter(name);
      this.meters.set(name, meter);
    }

    return this.meters.get(name);
  }

  /**
   * Record HTTP request duration
   * @param controller The controller name
   * @param method The HTTP method
   * @param route The route path
   * @param statusCode The HTTP status code
   * @param duration The duration in milliseconds
   */
  recordHttpRequestDuration(
    controller: string,
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ): void {
    if (!this.enabled) {
      return;
    }

    const meter = this.getMeter('http');
    if (!meter) {
      return;
    }

    const histogram = meter.createHistogram('http.server.duration', {
      description: 'Duration of HTTP requests',
      unit: 'ms',
    });

    histogram.record(duration, {
      'http.method': method,
      'http.route': route,
      'http.status_code': statusCode.toString(),
      'service.controller': controller,
    });
  }

  /**
   * Record database operation duration
   * @param operation The database operation (query, insert, update, delete)
   * @param table The database table
   * @param duration The duration in milliseconds
   */
  recordDatabaseDuration(
    operation: string,
    table: string,
    duration: number,
  ): void {
    if (!this.enabled) {
      return;
    }

    const meter = this.getMeter('database');
    if (!meter) {
      return;
    }

    const histogram = meter.createHistogram('db.operation.duration', {
      description: 'Duration of database operations',
      unit: 'ms',
    });

    histogram.record(duration, {
      'db.operation': operation,
      'db.table': table,
    });
  }

  /**
   * Increment a counter for a specific event
   * @param name The name of the counter
   * @param value The value to increment by
   * @param attributes Additional attributes for the counter
   */
  incrementCounter(
    name: string,
    value: number = 1,
    attributes: Record<string, string> = {},
  ): void {
    if (!this.enabled) {
      return;
    }

    const meter = this.getMeter('custom');
    if (!meter) {
      return;
    }

    const counter = meter.createCounter(name, {
      description: `Counter for ${name}`,
    });

    counter.add(value, attributes);
  }
}
