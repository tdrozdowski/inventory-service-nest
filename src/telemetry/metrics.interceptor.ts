import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      tap({
        next: () => this.recordMetrics(context, startTime, 200),
        error: (error) => {
          const statusCode = error.status || 500;
          this.recordMetrics(context, startTime, statusCode);
        },
      }),
    );
  }

  private recordMetrics(
    context: ExecutionContext,
    startTime: number,
    statusCode: number,
  ): void {
    const duration = Date.now() - startTime;
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const { method, route } = request;

    // Get controller and handler names
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    // Record HTTP request duration
    this.metricsService.recordHttpRequestDuration(
      controllerName,
      method,
      route?.path || request.url,
      statusCode,
      duration,
    );

    // Increment endpoint counter
    this.metricsService.incrementCounter('endpoint.calls', 1, {
      controller: controllerName,
      handler: handlerName,
      method,
      route: route?.path || request.url,
      status: statusCode.toString(),
    });
  }
}
