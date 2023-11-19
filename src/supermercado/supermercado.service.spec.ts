import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadoList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadoList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: SupermercadoEntity = await repository.save({
        nombre: faker.lorem.word(11),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        paginaWeb: faker.internet.url(),
      });
      supermercadoList.push(ciudad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadoList.length);
  });

  it('findOne should return a Supermercado by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadoList[0];
    const supermercado: SupermercadoEntity = await service.findOne(
      storedSupermercado.id,
    );
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre);
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud);
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud);
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb);
  });

  it('findOne should throw an exception for an invalid Supermercado', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      `The Supermercado with id 0, was not found`,
    );
  });

  it('create should create a Supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.lorem.word(11),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(),
      paginaWeb: faker.internet.url(),
      ciudad: null,
    };
    const newSupermercado: SupermercadoEntity =
      await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await service.findOne(
      newSupermercado.id,
    );
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb);
  });

  it('create should throw an exception for a short name', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.lorem.word(9),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(),
      paginaWeb: faker.internet.url(),
      ciudad: null,
    };
    await expect(() => service.create(supermercado)).rejects.toHaveProperty(
      'message',
      `The name must be less than 10 characters`,
    );
  });

  it('update should update a Supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    supermercado.nombre = faker.lorem.word(11);
    supermercado.longitud = faker.location.longitude();
    supermercado.latitud = faker.location.latitude();
    supermercado.paginaWeb = faker.internet.url();
    const updatedSupermercado: SupermercadoEntity = await service.update(
      supermercado.id,
      supermercado,
    );
    expect(updatedSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await service.findOne(
      updatedSupermercado.id,
    );
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb);
  });

  it('update should throw an exception for a short name', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    supermercado.nombre = faker.lorem.word(9);
    supermercado.longitud = faker.location.longitude();
    supermercado.latitud = faker.location.latitude();
    supermercado.paginaWeb = faker.internet.url();
    await expect(() =>
      service.update(supermercado.id, supermercado),
    ).rejects.toHaveProperty(
      'message',
      `The name must be less than 10 characters`,
    );
  });

  it('update should throw an exception for an invalid Supermercado', async () => {
    await expect(() =>
      service.update('0', supermercadoList[0]),
    ).rejects.toHaveProperty(
      'message',
      `The Supermercado with id 0, was not found`,
    );
  });

  it('delete should remove a Supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid Supermercado', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      `The Supermercado with id 0, was not found`,
    );
  });
});
