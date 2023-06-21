import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from './User';

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: 'text'
    })
    content: string;

    @Column({
        type: 'boolean',
        default: false
    })
    is_done: boolean;

    @ManyToOne(() => User, (user) => user.appointments)
    @JoinColumn()
    user: User;

    @Column()
    target_date: Date;

    @Column({
        type: 'boolean',
        default: false
    })
    was_notified: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
