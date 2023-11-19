import {
  Controller,
  Get,
  UseInterceptors,
  Body,
  Put,
  Post,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';

@Controller('ciudad')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(
    private readonly ciudadSupermercadoService: CiudadSupermercadoService,
  ) {}

  @Post(':ciudadId/supermercado/:supermercadoId')
  async addSupermarketToCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.addSupermarketToCity(
      ciudadId,
      supermercadoId,
    );
  }

  @Get(':ciudadId/supermercado')
  async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadSupermercadoService.findSupermarketsFromCity(
      ciudadId,
    );
  }

  @Get(':ciudadId/supermercado/:supermercadoId')
  async findSupermarketFromCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.findSupermarketFromCity(
      ciudadId,
      supermercadoId,
    );
  }

  @Put(':ciudadId/supermercados')
  async updateSupermarketsFromCity(
    @Body() SupermercadoDto: SupermercadoDto[],
    @Param('ciudadId') ciudadId: string,
  ) {
    const supermercados = plainToInstance(SupermercadoEntity, SupermercadoDto);
    return await this.ciudadSupermercadoService.updateSupermarketsFromCity(
      ciudadId,
      supermercados,
    );
  }

  @Delete(':ciudadId/supermercado/:supermercadoId')
  @HttpCode(204)
  async deleteSupermarketFromCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.deleteSupermarketFromCity(
      ciudadId,
      supermercadoId,
    );
  }
}
