import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoController } from './supermercado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  providers: [SupermercadoService],
  controllers: [SupermercadoController],
})
export class SupermercadoModule {}
