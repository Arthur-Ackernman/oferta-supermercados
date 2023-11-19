import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async addSupermarketToCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<CiudadEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        `The Supermercado with id ${supermercadoId}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        `The Ciudad with id ${ciudadId}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    ciudad.supermercados = [...ciudad.supermercados, supermercado];
    return await this.ciudadRepository.save(ciudad);
  }

  async findSupermarketsFromCity(
    ciudadId: string,
  ): Promise<SupermercadoEntity[]> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        `The Ciudad with id ${ciudadId}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }

    return ciudad.supermercados;
  }

  async findSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        `The Supermercado with id ${supermercadoId}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        `The Ciudad with id ${ciudadId}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(
      (e) => e.id === supermercado.id,
    );

    if (!ciudadSupermercado) {
      throw new BusinessLogicException(
        `The Supermercado with id ${supermercadoId}, was not found in the Ciudad with id ${ciudadId}`,
        BusinessError.NOT_FOUND,
      );
    }

    return ciudadSupermercado;
  }

  async updateSupermarketsFromCity(
    ciudadId: string,
    supermercados: SupermercadoEntity[],
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad)
      throw new BusinessLogicException(
        `The Ciudad with id ${ciudadId}, was not found`,
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < supermercados.length; i++) {
      const supermercado: SupermercadoEntity =
        await this.supermercadoRepository.findOne({
          where: { id: supermercados[i].id },
        });
      if (!supermercado)
        throw new BusinessLogicException(
          `The Supermercado with id ${supermercados[i].id}, was not found`,
          BusinessError.NOT_FOUND,
        );
    }

    ciudad.supermercados = supermercados;
    return await this.ciudadRepository.save(ciudad);
  }

  async deleteSupermarketFromCity(ciudadId, supermercadoId) {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
        relations: ['ciudad'],
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        `The Supermercado with id ${supermercadoId}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        `The Ciudad with id ${ciudadId}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }

    const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(
      (e) => e.id === supermercado.id,
    );

    if (!ciudadSupermercado) {
      throw new BusinessLogicException(
        `The Supermercado with id ${supermercadoId}, is not associated to the Ciudad with id ${ciudadId}`,
        BusinessError.NOT_FOUND,
      );
    }

    ciudad.supermercados = ciudad.supermercados.filter(
      (e) => e.id !== supermercado.id,
    );
    return await this.ciudadRepository.save(ciudad);
  }
}
