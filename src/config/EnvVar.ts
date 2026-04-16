import 'dotenv/config';
import { EnvKey } from './enum/EnvKey';

export class EnvVar {
    private constructor() { };
    // verificando se existe
    public static getString(chave: EnvKey): string {
        const valor = process.env[chave];
        if (valor === undefined) {
            throw new Error(`Variavel ${chave} não definida no env`);
        }
        return valor;
    }

    // converte para numero
    public static getNumber(chave: EnvKey): number {
        const valor = this.getString(chave);
        const valorConvertido = Number(valor);

        if (isNaN(valorConvertido)) {
            throw new Error(`Variavel ${chave} deve ser um numero válido`);
        }
        return valorConvertido;
    }

    // convert para boolean
    public static getBoolean(chave: EnvKey): boolean {
        const valor = this.getString(chave).toLowerCase();
        return ['true', '1', 'yes', 'on'].includes(valor);
    }

    public static get SERVER_PORT(): number {
        return this.getNumber(EnvKey.SERVER_PORT);
    }
    public static get DB_HOST(): string {
        return this.getString(EnvKey.DB_HOST);
    }
    public static get DB_USER(): string {
        return this.getString(EnvKey.DB_USER);
    }
    public static get DB_PASSWORD(): string {
        return this.getString(EnvKey.DB_PASSWORD);
    }
    public static get DB_PORT(): number {
        return this.getNumber(EnvKey.DB_PORT);
    }
    public static get DB_DATABASE(): string {
        return this.getString(EnvKey.DB_DATABASE);
    }
}