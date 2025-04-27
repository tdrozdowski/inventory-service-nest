import { registerAs } from '@nestjs/config';

export default registerAs('telemetry', () => ({
  enabled: process.env.TELEMETRY_ENABLED === 'true' || false,
  serviceName: process.env.TELEMETRY_SERVICE_NAME || 'inventory-service',
  serviceVersion: process.env.TELEMETRY_SERVICE_VERSION || '1.0.0',
  environment: process.env.TELEMETRY_ENVIRONMENT || 'development',
  otlpEndpoint: process.env.TELEMETRY_OTLP_ENDPOINT || 'http://localhost:4318',
  metrics: {
    enabled: process.env.TELEMETRY_METRICS_ENABLED === 'true' || false,
    interval: parseInt(process.env.TELEMETRY_METRICS_INTERVAL || '1000', 10),
    endpoint: process.env.TELEMETRY_METRICS_ENDPOINT || process.env.TELEMETRY_OTLP_ENDPOINT || 'http://localhost:4318/v1/metrics',
  },
  tracing: {
    enabled: process.env.TELEMETRY_TRACING_ENABLED === 'true' || false,
    endpoint: process.env.TELEMETRY_TRACING_ENDPOINT || process.env.TELEMETRY_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    sampler: process.env.TELEMETRY_TRACING_SAMPLER || 'always_on',
    samplingRatio: parseFloat(process.env.TELEMETRY_TRACING_SAMPLING_RATIO || '1.0'),
  },
  logging: {
    enabled: process.env.TELEMETRY_LOGGING_ENABLED === 'true' || false,
    endpoint: process.env.TELEMETRY_LOGGING_ENDPOINT || process.env.TELEMETRY_OTLP_ENDPOINT || 'http://localhost:4318/v1/logs',
    level: process.env.TELEMETRY_LOGGING_LEVEL || 'info',
  },
}));
