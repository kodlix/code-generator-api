import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export const AuthJwtGuard = NestAuthGuard('jwt');
