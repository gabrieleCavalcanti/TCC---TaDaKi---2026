import nodemailer from "nodemailer";

import { EnvVar } from "../config/EnvVar";

export class EmailService {

    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EnvVar.EMAIL_USER,
                pass: EnvVar.EMAIL_PASSWORD
            }
        });
    }

    async enviarEmail(
        destinatario: string,
        assunto: string,
        mensagem: string
    ): Promise<void> {

        await this.transporter.sendMail({
            from: `"TaDaKi" <${EnvVar.EMAIL_USER}>`,
            to: destinatario,
            subject: assunto,
            text: mensagem
        });
    }
}