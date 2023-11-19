import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity';
import { faker } from '@faker-js/faker';
import { Cities } from '../shared/cities/cities-list';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: faker.location.country(),
        numeroHabitantes: faker.number.int(),
      });
      ciudadList.push(ciudad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadList.length);
  });

  it('findOne should return a Ciudad by id', async () => {
    const storedCiudad: CiudadEntity = ciudadList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
    expect(ciudad.pais).toEqual(storedCiudad.pais);
    expect(ciudad.numeroHabitantes).toEqual(storedCiudad.numeroHabitantes);
  });

  it('findOne should throw an exception for an invalid Ciudad', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      `The Ciudad with id 0, was not found`,
    );
  });

  it('create should return a new Ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    };
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await service.findOne(newCiudad.id);
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre);
    expect(storedCiudad.pais).toEqual(newCiudad.pais);
    expect(storedCiudad.numeroHabitantes).toEqual(newCiudad.numeroHabitantes);
  });

  it('create should throw an exception for an invalid pais', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    };
    await expect(() => service.create(ciudad)).rejects.toHaveProperty(
      'message',
      `The city must be in the following countries: ${Object.values(Cities)}`,
    );
  });

  it('update should return an updated Ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    ciudad.nombre = faker.location.city();
    ciudad.pais = Cities[faker.number.int({ min: 0, max: 2 })];
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre);
    expect(storedCiudad.pais).toEqual(ciudad.pais);
  });

  it('update should throw an exception for an invalid pais', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    ciudad.nombre = faker.location.city();
    ciudad.pais = faker.location.country();
    await expect(() =>
      service.update(ciudad.id, ciudad),
    ).rejects.toHaveProperty(
      'message',
      `The city must be in the following countries: ${Object.values(Cities)}`,
    );
  });

  it('update should throw an exception for an invalid Ciudad', async () => {
    await expect(() =>
      service.update('0', ciudadList[0]),
    ).rejects.toHaveProperty('message', `The Ciudad with id 0, was not found`);
  });

  it('delete should remove a Ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
    const deletedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid Ciudad', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      `The Ciudad with id 0, was not found`,
    );
  });
});
