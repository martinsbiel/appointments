import {CronJob} from 'cron';
import Logger from '../config/logger';
import {AppDataSource} from './data-source';
import {Appointment} from './entity/Appointment';
import nodemailer from 'nodemailer';

const job = new CronJob('* */10 * * * *', async () => {
	try {
        const appointments = await AppDataSource.getRepository(Appointment).find({
            where: {
                was_notified: false
            },
            relations: {
                user: true
            }
        });

        appointments.map(async item => {
            const now = new Date();
            const targetDate = item.target_date;
            const diffTime = targetDate.getTime() - now.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if(diffDays <= 1 && diffDays >= 0){
                const transporter = nodemailer.createTransport({
                    host: String(process.env.MAIL_HOST),
                    port: Number(process.env.MAIL_PORT),
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS
                    }
                });

                transporter.sendMail({
                    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
                    to: item.user.email,
                    subject: `Hey ${item.user.name}, don't forget!`,
                    html: `Hello <strong>${item.user.name}</strong>, you're being notified for the following appointment: <strong>${item.title}</strong>, here is all the information about it:<br>
                    Description: ${item.content}<br>
                    Created at: ${item.created_at}<br>
                    Scheduled date: ${item.target_date}
                    `,
                });

                Logger.info(`Email to ${item.user.name} has been sent!`);

                // update was_notified
                AppDataSource.getRepository(Appointment).merge(item, {
                    was_notified: true
                });
        
                await AppDataSource.getRepository(Appointment).save(item);
            }
        });
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);
    }
});

export default job;