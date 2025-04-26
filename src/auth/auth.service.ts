import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateToken(clientId: string): Promise<string> {
    // Create payload with subject as client_id
    const payload = {
      sub: clientId,
    };

    // Generate and return JWT token
    return this.jwtService.sign(payload);
  }

  validateBasicAuth(clientId: string, secret: string): boolean {
    // This is a placeholder for client validation logic
    // In a real implementation, we would validate against a database or other source

    // For now, accept any non-empty credentials
    return !!clientId && !!secret;
  }
}
