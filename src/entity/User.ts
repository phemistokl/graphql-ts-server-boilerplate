import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string | undefined;

  @Column("varchar", { length: 255 }) email: string | undefined;

  @Column("text") password: string | undefined;
}
