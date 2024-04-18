import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({

  controllers: [AppController],
  providers: [AppService],
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'oussama',
      database: 'postgres',
      autoLoadEntities:true,
      //when the app start will do sync with db, used only on dev stage
      synchronize: true,
  }),
  JwtModule.register({
    global: true,
    secret: "secrete",
    signOptions: { expiresIn: '1h' },
  }),
    AuthModule,
  ],
})
export class AppModule {}
