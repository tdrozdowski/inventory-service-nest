import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('authorize')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post()
  async authorize(@Headers('authorization') authHeader: string) {
    // Check if Authorization header exists
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Check if it's Basic auth
    if (!authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Basic authentication is required');
    }

    try {
      // Extract and decode credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [clientId, secret] = credentials.split(':');

      // Validate credentials
      if (!this.authService.validateBasicAuth(clientId, secret)) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const token = await this.authService.generateToken(clientId);

      // Return token in JSON format
      return { token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid authorization header');
    }
  }
}
