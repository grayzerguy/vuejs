import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date; // ← זה יתווסף אוטומטית ע"י TypeORM

    @Column({ nullable: true })
    reset_code: string;

    @Column({ nullable: true })
    reset_code_expires_at: Date;
    updated_at: any;



}



