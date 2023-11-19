import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cities } from '../shared/cities/cities-list';

@Injectable()
export class CiudadService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({ relations: ['supermercados'] });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['supermercados'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        `The Ciudad with id ${id}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }

    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (!Object.values(Cities).includes(ciudad.pais)) {
      throw new BusinessLogicException(
        `The city must be in the following countries: ${Object.values(Cities)}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const ciudadToUpdate: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudadToUpdate) {
      throw new BusinessLogicException(
        `The Ciudad with id ${id}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }

    if (!Object.values(Cities).includes(ciudad.pais)) {
      throw new BusinessLogicException(
        `The city must be in the following countries: ${Object.values(Cities)}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.ciudadRepository.save({ ...ciudadToUpdate, ...ciudad });
  }

  async delete(id: string): Promise<void> {
    const ciudadToDelete: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudadToDelete) {
      throw new BusinessLogicException(
        `The Ciudad with id ${id}, was not found`,
        BusinessError.NOT_FOUND,
      );
    }
    await this.ciudadRepository.delete(ciudadToDelete);
  }
}
