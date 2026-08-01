import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        const synchronize =
          configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true';

        const useSsl = configService.get<string>('DB_SSL', 'false') === 'true';

        return {
          type: 'postgres' as const,

          ...(databaseUrl
            ? {
                url: databaseUrl,
              }
            : {
                host: configService.getOrThrow<string>('DB_HOST'),

                port: Number(configService.get<string>('DB_PORT', '5432')),

                database: configService.getOrThrow<string>('DB_NAME'),

                username: configService.getOrThrow<string>('DB_USERNAME'),

                password: configService.getOrThrow<string>('DB_PASSWORD'),
              }),

          autoLoadEntities: true,

          synchronize,

          ssl: useSsl
            ? {
                rejectUnauthorized: false,
              }
            : false,
        };
      },
    }),

    AuthModule,
    CustomersModule,
    ServiceRequestsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
