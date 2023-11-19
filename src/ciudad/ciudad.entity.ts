import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('ciudad')
export class CiudadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  pais: string;

  @Column()
  numeroHabitantes: number;

  @OneToMany(() => SupermercadoEntity, (supermercado) => supermercado.ciudad)
  supermercados: SupermercadoEntity[];
}
