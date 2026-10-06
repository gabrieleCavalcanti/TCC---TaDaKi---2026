import { db } from "../database/connection.database";
import { IEndereco } from "../models/endereco.model";
import { ResultSetHeader } from "mysql2/promise";

export class EnderecoRepository {
  async findAll(): Promise<IEndereco[]> {
    const sql = `
            SELECT * 
            FROM enderecos 
            ORDER BY municipio ASC;  `;

    const [rows] = await db.execute<IEndereco[]>(sql);
    return rows;
  }

  async findById(id_endereco: number): Promise<IEndereco[]> {
    const sql = `
            SELECT *
            FROM enderecos
            WHERE id_endereco = ?;
        `;

    const [rows] = await db.execute<IEndereco[]>(sql, [id_endereco]);
    return rows;
  }

  async create(
    dados: Omit<IEndereco, "id_endereco">,
  ): Promise<ResultSetHeader> {
    const sql = `
            INSERT INTO enderecos
            (rua, numero, bairro, municipio, cep, uf, id_pessoa)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

    const [rows] = await db.execute<ResultSetHeader>(sql, [
      dados.rua,
      dados.numero,
      dados.bairro,
      dados.municipio,
      dados.cep,
      dados.uf,
      dados.id_pessoa,
    ]);

    return rows;
  }

  async update(
    id_endereco: number,
    dados: Omit<IEndereco, "id_endereco">,
  ): Promise<ResultSetHeader> {
    const sql = `
            UPDATE enderecos
            SET 
                rua = ?,
                numero = ?,
                bairro = ?,
                municipio = ?,
                cep = ?,
                uf = ?,
                id_pessoa = ?
            WHERE id_endereco = ?;
        `;

    const [rows] = await db.execute<ResultSetHeader>(sql, [
      dados.rua,
      dados.numero,
      dados.bairro,
      dados.municipio,
      dados.cep,
      dados.uf,
      dados.id_pessoa,
      id_endereco,
    ]);

    return rows;
  }

  async findByPessoa(id_pessoa: number): Promise<IEndereco[]> {
    const sql = `
            SELECT 
                id_endereco,
                rua,
                numero,
                bairro,
                municipio,
                cep,
                uf,
                id_pessoa
            FROM enderecos
            WHERE id_pessoa = ?;
        `;

    const [rows] = await db.execute<IEndereco[]>(sql, [id_pessoa]);
    return rows;
  }

  async findByMunicipio(municipio: string): Promise<IEndereco[]> {
    const sql = `
            SELECT 
                id_endereco,
                rua,
                numero,
                bairro,
                municipio,
                cep,
                uf,
                id_pessoa
            FROM enderecos
            WHERE municipio = ?;
        `;

    const [rows] = await db.execute<IEndereco[]>(sql, [municipio]);
    return rows;
  }

  async findByCep(cep: string): Promise<IEndereco[]> {
    const sql = `
            SELECT 
                id_endereco,
                rua,
                numero,
                bairro,
                municipio,
                cep,
                uf,
                id_pessoa
            FROM enderecos
            WHERE cep = ?;
        `;

    const [rows] = await db.execute<IEndereco[]>(sql, [cep]);
    return rows;
  }
}