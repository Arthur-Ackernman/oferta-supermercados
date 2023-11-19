import {
  Controller,
  Get,
  UseInterceptors,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { plainToInstance } from 'class-transformer';

@Controller('supermercado')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.supermercadoService.findAll();
  }

  @Get(':supermercadoId')
  async findOne(supermercadoId: string) {
    return await this.supermercadoService.findOne(supermercadoId);
  }

  @Post()
  async create(@Body() supermercadoDto: SupermercadoDto) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.supermercadoService.create(supermercado);
  }

  @Put(':supermercadoId')
  async update(
    @Param('supermercadoId') supermercadoId: string,
    @Body() supermercadoDto: SupermercadoDto,
  ) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.supermercadoService.update(supermercadoId, supermercado);
  }

  @Delete(':supermercadoId')
  @HttpCode(204)
  async delete(@Param('supermercadoId') supermercadoId: string) {
    return await this.supermercadoService.delete(supermercadoId);
  }
}
