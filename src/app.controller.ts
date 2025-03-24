import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get hello message',
    description: 'Returns a hello message from the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Hello message retrieved successfully',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
