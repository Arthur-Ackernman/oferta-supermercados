import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('supermercado')
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('float')
  longitud: number;

  @Column('float')
  latitud: number;

  @Column()
  paginaWeb: string;

  @ManyToOne(() => CiudadEntity, (ciudad) => ciudad.supermercados)
  ciudad: CiudadEntity;
}
