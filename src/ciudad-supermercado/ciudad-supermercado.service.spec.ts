import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { faker } from '@faker-js/faker';
import { Cities } from '../shared/cities/cities-list';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();

    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await supermercadoRepository.save({
          nombre: faker.lorem.word(11),
          longitud: faker.location.longitude(),
          latitud: faker.location.latitude(),
          paginaWeb: faker.internet.url(),
        });
      supermercadosList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: Cities[faker.number.int({ min: 0, max: 2 })],
      numeroHabitantes: faker.number.int(),
      supermercados: supermercadosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add a Supermercado to a Ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.lorem.word(11),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        paginaWeb: faker.internet.url(),
      });
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: Cities[faker.number.int({ min: 0, max: 2 })],
      numeroHabitantes: faker.number.int(),
    });
    const result: CiudadEntity = await service.addSupermarketToCity(
      newCiudad.id,
      newSupermercado.id,
    );
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(result.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(result.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(result.supermercados[0].paginaWeb).toBe(newSupermercado.paginaWeb);
  });

  it('addSupermarketToCity should throw an error if the Supermercado does not exist', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: Cities[faker.number.int({ min: 0, max: 2 })],
      numeroHabitantes: faker.number.int(),
    });
    await expect(() =>
      service.addSupermarketToCity(newCiudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The Supermercado with id 0, was not found',
    );
  });

  it('addSupermarketToCity should throw an error if the Supermercado does not exist', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.lorem.word(11),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        paginaWeb: faker.internet.url(),
      });
    await expect(() =>
      service.addSupermarketToCity('0', newSupermercado.id),
    ).rejects.toHaveProperty('message', 'The Ciudad with id 0, was not found');
  });

  it('findSupermarketFromCity should return a Supermecado from a Ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercados: SupermercadoEntity =
      await service.findSupermarketFromCity(ciudad.id, supermercado.id);
    expect(storedSupermercados).not.toBeNull();
    expect(storedSupermercados.nombre).toBe(supermercado.nombre);
    expect(storedSupermercados.longitud).toBe(supermercado.longitud);
    expect(storedSupermercados.latitud).toBe(supermercado.latitud);
    expect(storedSupermercados.paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('findSupermarketFromCity should throw an error if the Supermercado does not exist', async () => {
    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The Supermercado with id 0, was not found',
    );
  });

  it('findSupermarketFromCity should throw an error if the Ciudad does not exist', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() =>
      service.findSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty('message', 'The Ciudad with id 0, was not found');
  });

  it('findSupermarketsFromCity should return a list of Supermercados from a Ciudad', async () => {
    const supermercados: SupermercadoEntity[] =
      await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(supermercadosList.length);
  });

  it('findSupermarketsFromCity should throw an error if the Ciudad does not exist', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty('message', 'The Ciudad with id 0, was not found');
  });

  it('updateSupermarketsFromCity should update Supermercados from a Ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.lorem.word(11),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        paginaWeb: faker.internet.url(),
      });
    const updatedCiudad: CiudadEntity =
      await service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].longitud).toBe(
      newSupermercado.longitud,
    );
    expect(updatedCiudad.supermercados[0].latitud).toBe(
      newSupermercado.latitud,
    );
    expect(updatedCiudad.supermercados[0].paginaWeb).toBe(
      newSupermercado.paginaWeb,
    );
  });

  it('updateSupermarketsFromCity should throw an error if the Ciudad does not exist', async () => {
    await expect(() =>
      service.updateSupermarketsFromCity('0', []),
    ).rejects.toHaveProperty('message', 'The Ciudad with id 0, was not found');
  });

  it('updateSupermarketsFromCity should throw an error if the Supermercado does not exist', async () => {
    const newSupermercado: SupermercadoEntity = supermercadosList[0];
    newSupermercado.id = '0';
    await expect(() =>
      service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The Supermercado with id 0, was not found',
    );
  });

  it('deleteSupermarketFromCity should delete a Supermercado from a Ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);
    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });
    const deletedSupermercado: SupermercadoEntity =
      storedCiudad.supermercados.find((s) => s.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermarketFromCity should throw an error if the Supermercado does not exist', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The Supermercado with id 0, was not found',
    );
  });

  it('deleteSupermarketFromCity should throw an error if the Ciudad does not exist', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty('message', 'The Ciudad with id 0, was not found');
  });

  it('deleteSupermarketsFromCity should throw an error for an non associate Supermercado', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.word(11),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(),
      paginaWeb: faker.internet.url(),
    });
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      `The Supermercado with id ${supermercado.id}, is not associated to the Ciudad with id ${ciudad.id}`,
    );
  });
});
