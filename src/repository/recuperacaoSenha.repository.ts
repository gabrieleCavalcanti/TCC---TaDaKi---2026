import { db } from "../database/connection.database";
import { IRecuperacaoSenha } from "../models/recuperacaoSenha.model";
import { ResultSetHeader } from "mysql2/promise";

export class RecuperacaoSenhaRepository {

    // CRIAR RECUPERAÇÃO DE SENHA

    async criarRecuperacao(
        idPessoaLogin: number,
        tokenHash: string,
        dataExpiracao: Date
    ): Promise<void> {

        const sql = `
            INSERT INTO recuperacao_senha
            (
                id_pessoa_login,
                token_hash,
                data_expiracao,
                usado
            )
            VALUES (?, ?, ?, FALSE);
        `;

        const values = [
            idPessoaLogin,
            tokenHash,
            dataExpiracao
        ];

        await db.execute<ResultSetHeader>(sql, values);
    }

    // BUSCAR RECUPERAÇÃO PELO TOKEN: quando enviar para o usuário um e-mail ele verifica se o token existe

    async buscarPorToken(
        tokenHash: string
    ): Promise<IRecuperacaoSenha[]> {

        const sql = `
            SELECT
                id_recuperacao,
                id_pessoa_login,
                token_hash,
                data_expiracao,
                usado
            FROM recuperacao_senha
            WHERE token_hash = ?
            LIMIT 1;
        `;

        const values = [tokenHash];

        const [rows] = await db.execute<IRecuperacaoSenha[]>(
            sql,
            values
        );

        return rows;
    }


    // MARCAR TOKEN COMO USADO: depois que a senha for alterada

    async marcarComoUsado(
        idRecuperacao: number
    ): Promise<void> {

        const sql = `
            UPDATE recuperacao_senha
            SET usado = TRUE
            WHERE id_recuperacao = ?;
        `;

        const values = [idRecuperacao];

        await db.execute<ResultSetHeader>(
            sql,
            values
        );
    }

    // INVALIDAR RECUPERAÇÕES ANTERIORES: o usuário solicitar mais de um link

    async invalidarRecuperacoesAnteriores(
        idPessoaLogin: number
    ): Promise<void> {

        const sql = `
            UPDATE recuperacao_senha
            SET usado = TRUE
            WHERE id_pessoa_login = ?
              AND usado = FALSE;
        `;

        const values = [idPessoaLogin];

        await db.execute<ResultSetHeader>(
            sql,
            values
        );
    }
}