// src/entity/audit-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    action: string;

    @Column({ nullable: true })
    ip_address: string;

    @CreateDateColumn()
    created_at: Date;
}
