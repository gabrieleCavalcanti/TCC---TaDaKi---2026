import type { Pool, RowDataPacket } from "mysql2/promise";
export class DashboardRepository {
  constructor(private pool: Pick<Pool, "execute">) {}
  async organization(personId: number) {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT o.id_organizacao FROM organizacao o INNER JOIN pessoas p ON p.id_pessoa=o.id_pessoa WHERE o.id_pessoa=? AND p.tipo='ORGANIZACAO'",
      [personId],
    );
    return Number(rows[0]?.id_organizacao) || null;
  }
  async summary(org: number, start: string, end: string) {
    const [likes] = await this.pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT l.Pessoas_id_pessoa) AS pessoas, COUNT(DISTINCT l.Posts_id_post,l.Pessoas_id_pessoa) AS curtidas FROM likes l INNER JOIN posts p ON p.id_post=l.Posts_id_post WHERE p.id_organizacao=? AND l.data>=? AND l.data<?`,
      [org, start, end],
    );
    const [top] = await this.pool.execute<RowDataPacket[]>(
      `SELECT p.id_post,p.titulo,p.vincularImagem,p.status,COUNT(DISTINCT l.Pessoas_id_pessoa) AS curtidas FROM posts p INNER JOIN likes l ON l.Posts_id_post=p.id_post WHERE p.id_organizacao=? AND l.data>=? AND l.data<? GROUP BY p.id_post,p.titulo,p.vincularImagem,p.status ORDER BY curtidas DESC,p.id_post DESC LIMIT 1`,
      [org, start, end],
    );
    const [favorites] = await this.pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT id_cliente) AS total,COUNT(DISTINCT CASE WHEN data_favoritado>=? AND data_favoritado<? THEN id_cliente END) AS mes,COUNT(DISTINCT CASE WHEN data_favoritado IS NULL THEN id_cliente END) AS sem_data FROM favoritos WHERE id_organizacao=?`,
      [start, end, org],
    );
    return {
      pessoas_curtiram: Number(likes[0]?.pessoas ?? 0),
      curtidas_mes: Number(likes[0]?.curtidas ?? 0),
      post_mais_curtido: top.length
        ? { ...top[0], curtidas: Number(top[0].curtidas) }
        : null,
      pessoas_favoritaram_total: Number(favorites[0]?.total ?? 0),
      novos_favoritos_mes: Number(favorites[0]?.mes ?? 0),
      favoritos_sem_data: Number(favorites[0]?.sem_data ?? 0),
    };
  }
}
