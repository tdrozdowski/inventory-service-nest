# OpenTelemetry Integration

This document describes the OpenTelemetry integration in the Inventory Service NestJS application.

## Overview

OpenTelemetry is an observability framework that provides a collection of tools, APIs, and SDKs to instrument, generate, collect, and export telemetry data (metrics, logs, and traces) for analysis.

This integration provides:
- Custom metrics for each endpoint
- Tracing for HTTP requests and database operations
- Logging via OpenTelemetry

## Configuration

All OpenTelemetry configuration is done via environment variables, which can be provided by a Kubernetes ConfigMap.

### Environment Variables

#### General Configuration
- `TELEMETRY_ENABLED`: Enable or disable telemetry (default: false)
- `TELEMETRY_SERVICE_NAME`: Name of the service (default: inventory-service)
- `TELEMETRY_SERVICE_VERSION`: Version of the service (default: 1.0.0)
- `TELEMETRY_ENVIRONMENT`: Environment (development, staging, production) (default: development)
- `TELEMETRY_OTLP_ENDPOINT`: OpenTelemetry collector endpoint (default: http://localhost:4318)

#### Metrics Configuration
- `TELEMETRY_METRICS_ENABLED`: Enable or disable metrics (default: false)
- `TELEMETRY_METRICS_INTERVAL`: Metrics export interval in milliseconds (default: 1000)
- `TELEMETRY_METRICS_ENDPOINT`: Metrics endpoint (default: http://localhost:4318/v1/metrics)

#### Tracing Configuration
- `TELEMETRY_TRACING_ENABLED`: Enable or disable tracing (default: false)
- `TELEMETRY_TRACING_ENDPOINT`: Tracing endpoint (default: http://localhost:4318/v1/traces)
- `TELEMETRY_TRACING_SAMPLER`: Tracing sampler (always_on, always_off, trace_id_ratio) (default: always_on)
- `TELEMETRY_TRACING_SAMPLING_RATIO`: Sampling ratio for trace_id_ratio sampler (default: 1.0)

#### Logging Configuration
- `TELEMETRY_LOGGING_ENABLED`: Enable or disable logging (default: false)
- `TELEMETRY_LOGGING_ENDPOINT`: Logging endpoint (default: http://localhost:4318/v1/logs)
- `TELEMETRY_LOGGING_LEVEL`: Logging level (error, warn, info, debug, verbose) (default: info)

## Kubernetes ConfigMap

A sample Kubernetes ConfigMap is provided in `k8s/base/configmap.yaml`. This ConfigMap includes all the necessary environment variables for OpenTelemetry configuration.

## Custom Metrics

The following custom metrics are available:

### HTTP Request Metrics
- `http.server.duration`: Duration of HTTP requests in milliseconds
  - Labels:
    - `http.method`: HTTP method (GET, POST, PUT, DELETE, etc.)
    - `http.route`: Route path
    - `http.status_code`: HTTP status code
    - `service.controller`: Controller name

### Database Operation Metrics
- `db.operation.duration`: Duration of database operations in milliseconds
  - Labels:
    - `db.operation`: Database operation (query, insert, update, delete)
    - `db.table`: Database table

### Custom Counters
- `endpoint.calls`: Number of calls to each endpoint
  - Labels:
    - `controller`: Controller name
    - `handler`: Handler name
    - `method`: HTTP method
    - `route`: Route path
    - `status`: HTTP status code

## Usage

### Automatic Instrumentation

The application is automatically instrumented for HTTP requests and NestJS controllers. No additional code is required to collect metrics for these operations.

### Manual Instrumentation

To manually record database operation durations, inject the `MetricsService` and use the `recordDatabaseDuration` method:

```typescript
import { Injectable } from '@nestjs/common';
import { MetricsService } from '../telemetry/metrics.service';

@Injectable()
export class SomeService {
  constructor(private readonly metricsService: MetricsService) {}

  async someMethod() {
    const startTime = Date.now();
    
    // Database operation
    const result = await this.someDbOperation();
    
    // Record duration
    const duration = Date.now() - startTime;
    this.metricsService.recordDatabaseDuration('query', 'some_table', duration);
    
    return result;
  }
}
```

To increment a custom counter, use the `incrementCounter` method:

```typescript
this.metricsService.incrementCounter('some_counter', 1, {
  label1: 'value1',
  label2: 'value2',
});
```

### Logging

To use the OpenTelemetry logger, inject the `LoggerService` and use it like the NestJS Logger:

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../telemetry/logger.service';

@Injectable()
export class SomeService {
  private readonly logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger.setContext(SomeService.name);
  }

  someMethod() {
    this.logger.log('This is a log message');
    this.logger.error('This is an error message', new Error('Some error').stack);
    this.logger.warn('This is a warning message');
    this.logger.debug('This is a debug message');
    this.logger.verbose('This is a verbose message');
  }
}
```

## OpenTelemetry Collector

To collect and export telemetry data, you need to set up an OpenTelemetry Collector. The collector can be configured to export data to various backends such as Prometheus, Jaeger, Zipkin, Elasticsearch, etc.

A sample OpenTelemetry Collector configuration is not included in this repository, but you can find examples in the [OpenTelemetry Collector documentation](https://opentelemetry.io/docs/collector/).
