import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}
  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({
      relations: ['ciudad'],
    });
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
        relations: ['ciudad'],
      });
    if (!supermercado) {
      throw new BusinessLogicException(
        `The Supermercado with id ${id}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }

    return supermercado;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    if (supermercado.nombre.length <= 10) {
      throw new BusinessLogicException(
        `The name must be less than 10 characters`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.supermercadoRepository.save(supermercado);
  }

  async update(
    id: string,
    supermercado: SupermercadoEntity,
  ): Promise<SupermercadoEntity> {
    const supermercadoToUpdate: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!supermercadoToUpdate) {
      throw new BusinessLogicException(
        `The Supermercado with id ${id}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    if (supermercado.nombre.length <= 10) {
      throw new BusinessLogicException(
        `The name must be less than 10 characters`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.supermercadoRepository.save({
      ...supermercadoToUpdate,
      ...supermercado,
    });
  }

  async delete(id: string): Promise<void> {
    const supermercadoToDelete: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!supermercadoToDelete) {
      throw new BusinessLogicException(
        `The Supermercado with id ${id}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    await this.supermercadoRepository.delete(supermercadoToDelete);
  }
}
