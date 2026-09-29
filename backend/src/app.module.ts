import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompatibilityModule } from './compatibility/compatibility.module';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UsersModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('DB_PASSWORD');

        console.log('DB_HOST:', configService.get<string>('DB_HOST'));
        console.log('DB_PORT:', configService.get<number>('DB_PORT'));
        console.log('DB_USERNAME:', configService.get<string>('DB_USERNAME'));
        console.log('DB_DATABASE:', configService.get<string>('DB_DATABASE'));
        console.log('DB_PASSWORD definida:', password !== undefined);
        console.log('Longitud de DB_PASSWORD:', password?.length);

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password,
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: true,

          migrations: [
            __dirname + '/database/migrations/*{.ts,.js}',
          ],

          synchronize: false,
        };
      },
    }),

    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),

    UsersModule,

    AuthModule,

    CompatibilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
