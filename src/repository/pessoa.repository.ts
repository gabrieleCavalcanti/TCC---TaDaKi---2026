import { db } from "../database/connection.database";
import { IPessoa, Pessoa } from "../models/pessoa.model";
import { ResultSetHeader, PoolConnection } from "mysql2/promise";

export class PessoaRepository {
    // não precisa te findAll
    async findAll(): Promise<IPessoa[]> {
        const [rows] = await db.execute<IPessoa[]>(
            'SELECT * FROM pessoas;'
        );
        return rows;
    }

    // precisa ter um de cliente e um de org
    async findId(id_pessoa: number): Promise<IPessoa[]> {
        const sql = 'SELECT * FROM pessoas WHERE id_pessoa=?;';
        const values = [id_pessoa];
        const [rows] = await db.execute<IPessoa[]>(sql, values);
        return rows;
    }

    // precisa ter um de cliente e um de org
    async findNome(nome_pessoa: string): Promise<IPessoa[]> {
        const sql = 'SELECT * FROM pessoas WHERE nome=?;';
        const values = [nome_pessoa];
        const [rows] = await db.execute<IPessoa[]>(sql, values);
        return rows;
    }

    // async create(dados: Pessoa, infoExtra: any): Promise<void> {
    //     const connection: PoolConnection = await db.getConnection();

    //     try {
    //         await connection.beginTransaction();

    //         const sqlPessoa = `INSERT INTO pessoas (nome, tipo) VALUES (?, ?);`;

    //         if (!dados.Tipo) {
    //             throw new Error("Tipo é obrigatório");
    //         }

    //         const valuesPessoa = [dados.Nome, dados.Tipo];

    //         const [resultPessoa] = await connection.execute<ResultSetHeader>(sqlPessoa, valuesPessoa);

    //         const tiposValidos = [
    //             'CLIENTE',
    //             'ORGANIZACAO'
    //         ];

    //         if (!tiposValidos.includes(dados.Tipo)) {
    //             throw new Error('Tipo inválido');
    //         }

    //         if (dados.Tipo === 'CLIENTE') {
    //             const id_pessoa = resultPessoa.insertId;
    //             const sqlCliente = `INSERT INTO clientes (data_nascimento, id_pessoa)VALUES (?, ?);`;

    //             await connection.execute<ResultSetHeader>(sqlCliente, [infoExtra.data_nascimento, id_pessoa]);
    //         }

    //         // FORNECEDOR
    //         if (dados.Tipo === 'ORGANIZACAO') {
    //             const id_pessoa = resultPessoa.insertId;
    //             const sqlFornecedor = `INSERT INTO organizacao (cpf, cnpj, data_criacao, id_pessoa, id_area_atuacao)VALUES (?, ?, ?, ?, ?); `;

    //             await connection.execute<ResultSetHeader>(
    //                 sqlFornecedor,
    //                 [infoExtra.cpf, infoExtra.cnpj, infoExtra.data_criacao, id_pessoa, infoExtra.id_area_atuacao]
    //             );
    //         }

    //         await connection.commit();

    //     } catch (error) {
    //         await connection.rollback();
    //         throw error;

    //     } finally {
    //         connection.release();
    //     }
    // }

    async create(dados: Pessoa, infoExtra: any): Promise<void> {
    const connection: PoolConnection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // =========================
        // CADASTRA PESSOA
        // =========================
        const sqlPessoa = `
            INSERT INTO pessoas (nome, tipo)
            VALUES (?, ?);
        `;

        if (!dados.Tipo) {
            throw new Error("Tipo é obrigatório");
        }

        const tiposValidos = [
            "CLIENTE",
            "ORGANIZACAO"
        ];

        if (!tiposValidos.includes(dados.Tipo)) {
            throw new Error("Tipo inválido");
        }

        const valuesPessoa = [
            dados.Nome,
            dados.Tipo
        ];

        const [resultPessoa] =
            await connection.execute<ResultSetHeader>(
                sqlPessoa,
                valuesPessoa
            );

        const id_pessoa = resultPessoa.insertId;
        console.log("TIPO:", dados.Tipo);
console.log("DADOS:", dados);
console.log("INFO EXTRA:", infoExtra);

        // =========================
        // CLIENTE
        // =========================
        if (dados.Tipo === "CLIENTE") {

            const sqlCliente = `
                INSERT INTO clientes
                (data_nascimento, id_pessoa)
                VALUES (?, ?);
            `;

            await connection.execute<ResultSetHeader>(
                sqlCliente,
                [
                    infoExtra.data_nascimento,
                    id_pessoa
                ]
            );
        }

        // =========================
        // ORGANIZAÇÃO
        // =========================
        if (dados.Tipo === "ORGANIZACAO") {

            const sqlOrganizacao = `
                INSERT INTO organizacao
                (cpf, cnpj, data_criacao, id_pessoa, id_area_atuacao)
                VALUES (?, ?, ?, ?, ?);
            `;

            await connection.execute<ResultSetHeader>(
                sqlOrganizacao,
                [
                    infoExtra.cpf,
                    infoExtra.cnpj,
                    infoExtra.data_criacao,
                    id_pessoa,
                    infoExtra.id_area_atuacao
                ]
            );
        }

        // =========================
        // LOGIN
        // =========================
        const sqlLogin = `
            INSERT INTO login
            (id_pessoa_login, username, password_hash)
            VALUES (?, ?, ?);
        `;

        await connection.execute<ResultSetHeader>(
            sqlLogin,
            [
                id_pessoa,
                infoExtra.username,
                infoExtra.password_hash
            ]
        );

        await connection.commit();

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }
}

    async update(dados: Pessoa, infoExtra: any): Promise<void> {

        const connection: PoolConnection = await db.getConnection();

        try {

            await connection.beginTransaction();

            if (!dados.Id) { throw new Error("Id é obrigatório"); }

            // busca a pessoa atual
            const sqlBusca = `SELECT tipo FROM pessoas WHERE id_pessoa = ?;`;

            const [rows]: any = await connection.execute(sqlBusca, [dados.Id]);

            if (rows.length === 0) {
                throw new Error("Pessoa não encontrada");
            }

            const tipo = rows[0].tipo;

            // atualiza pessoa
            const sqlPessoa = `UPDATE pessoas SET nome = ? WHERE id_pessoa = ?;`;

            await connection.execute<ResultSetHeader>(sqlPessoa, [dados.Nome, dados.Id]);

            // CLIENTE
            if (tipo === 'CLIENTE') {
                const sqlCliente = `UPDATE clientes SET data_nascimento = ? WHERE id_pessoa = ?; `;

                await connection.execute<ResultSetHeader>(sqlCliente, [infoExtra.data_nascimento, dados.Id]);
            }

            // ORGANIZACAO
            if (tipo === 'ORGANIZACAO') {

                const cpf = infoExtra.cpf?.trim();
                const cnpj = infoExtra.cnpj?.trim();

                const sqlOrganizacao = `UPDATE organizacao SET cpf=?, cnpj=?, data_criacao=?, id_area_atuacao=? WHERE id_pessoa=?; `;

                await connection.execute<ResultSetHeader>(
                    sqlOrganizacao,
                    [
                        cpf ?? null,
                        cnpj ?? null,
                        infoExtra.data_criacao,
                        infoExtra.id_area_atuacao,
                        dados.Id
                    ]
                );
            }

            await connection.commit();

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }

    async findClientes(): Promise<IPessoa[]> {
        const [rows] = await db.execute<IPessoa[]>(
            `SELECT * FROM vw_pessoas_clientes;`
        );

        // CREATE VIEW vw_pessoas_clientes AS
        // 	SELECT 
        //                 pessoas.id_pessoa,
        //                 pessoas.nome,
        //                 pessoas.tipo,
        //                 clientes.data_nascimento
        //             FROM pessoas
        //             INNER JOIN clientes 
        //             ON pessoas.id_pessoa = clientes.id_pessoa
        //             WHERE pessoas.tipo = "CLIENTE"
        //             ORDER BY pessoas.nome ASC;
        return rows;
    }

    async findOrganizacao(): Promise<IPessoa[]> {
        const [rows] = await db.execute<IPessoa[]>(
            `SELECT * FROM vw_pessoas_organizacao;`
        );

        //CREATE VIEW vw_pessoas_organizacao AS
        // SELECT 
        //                 pessoas.id_pessoa,
        //                 pessoas.nome,
        //                 pessoas.tipo,
        //                 organizacao.cpf,
        //                 organizacao.cnpj,
        //                 organizacao.data_criacao,
        //                 organizacao.id_area_atuacao
        //             FROM pessoas
        //             INNER JOIN organizacao 
        //             ON pessoas.id_pessoa = organizacao.id_pessoa
        //             WHERE pessoas.tipo = "ORGANIZACAO"
        //             ORDER BY pessoas.nome ASC;
        return rows;
    }


    // não sera necessario ter clinte e org, do repository pra frente, pq os selectes, insert e update ta em pessoa
}