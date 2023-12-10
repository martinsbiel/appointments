import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany} from 'typeorm';
import {Appointment} from './Appointment';
import {faker} from '@faker-js/faker';
import bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 150
    })
    name: string;

    @Column({
        length: 200
    })
    email: string;

    @Column({
        length: 72
    })
    password: string;

    /**
     * User roles:
     * 1 -> Admin
     * 2 -> Regular user
     */
    @Column({
        default: 2
    })
    role: number;

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    public static async mockTestUser(role: number): Promise<User> {
        const user = new User();

        user.email = faker.internet.email();
        user.name = faker.person.fullName();
        user.password = await bcrypt.hash('secret', 10);
        user.role = role;

        return user;
    }
}
