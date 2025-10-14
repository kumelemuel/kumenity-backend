import { Module } from '@nestjs/common';
import { IdentityAccessModule } from './modules/identity-access.module';

@Module({
  imports: [IdentityAccessModule],
})
export class MainModule {}
