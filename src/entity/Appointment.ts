import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from './User';
import {faker} from '@faker-js/faker';

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

    public static async mockTestAppointment(user: User): Promise<Appointment> {
        const appointment = new Appointment();

        appointment.title = faker.lorem.sentence(5);
        appointment.content = faker.lorem.paragraph();
        appointment.user = user;
        appointment.target_date = faker.date.soon({days: 1});

        return appointment;
    }
}
