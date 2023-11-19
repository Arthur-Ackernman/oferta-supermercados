import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../../supermercado/supermercado.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [CiudadEntity, SupermercadoEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity]),
];
