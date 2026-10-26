import { Router } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../database/connection.database";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { verificarOrganizacao } from "../middleware/TipoUsuarioMiddleware";

const router = Router();
const auth = new AuthMiddleware();
type MetricRow = RowDataPacket & { total: number };
type OrgRow = RowDataPacket & { id_organizacao: number };
type BestRow = RowDataPacket & { id_post: number; titulo: string; vincularImagem: string | null; status: string; curtidas: number };
router.get("/dashboard/organizacao", auth.authenticate, verificarOrganizacao, async (req, res) => {
  const month = String(req.query.mes ?? "");
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return res.status(400).json({ message: "Mês inválido. Utilize AAAA-MM." });
  const start = `${month}-01 00:00:00`;
  const [year, part] = month.split("-").map(Number);
  const end = `${year + (part === 12 ? 1 : 0)}-${String(part === 12 ? 1 : part + 1).padStart(2,"0")}-01 00:00:00`;
  try {
    const [orgRows] = await db.execute<OrgRow[]>("SELECT id_organizacao FROM organizacao WHERE id_pessoa = ? LIMIT 1", [req.user!.id_login]);
    const org = orgRows[0];
    if (!org) return res.status(404).json({ message: "Nenhuma organização está vinculada a esta conta. Confira o cadastro e o login da organização." });
    const id = org.id_organizacao;
    const [people] = await db.execute<MetricRow[]>(`SELECT COUNT(DISTINCT l.Pessoas_id_pessoa) AS total FROM likes l JOIN posts p ON p.id_post = l.Posts_id_post WHERE p.id_organizacao = ? AND l.data >= ? AND l.data < ?`, [id,start,end]);
    const [likes] = await db.execute<MetricRow[]>(`SELECT COUNT(*) AS total FROM likes l JOIN posts p ON p.id_post = l.Posts_id_post WHERE p.id_organizacao = ? AND l.data >= ? AND l.data < ?`, [id,start,end]);
    const [favorites] = await db.execute<MetricRow[]>(`SELECT COUNT(*) AS total FROM favoritos WHERE id_organizacao = ?`, [id]);
    // A tabela favoritos existente não armazena a data de criação: não inventar contagem mensal.
    const [best] = await db.execute<BestRow[]>(`SELECT p.id_post, p.titulo, p.vincularImagem, p.status, COUNT(l.Posts_id_post) AS curtidas FROM posts p JOIN likes l ON l.Posts_id_post = p.id_post AND l.data >= ? AND l.data < ? WHERE p.id_organizacao = ? GROUP BY p.id_post, p.titulo, p.vincularImagem, p.status ORDER BY curtidas DESC, p.id_post DESC LIMIT 1`, [start,end,id]);
    return res.json({ dashboard: { mes:month, id_organizacao:id, pessoas_curtiram:Number(people[0]?.total ?? 0), curtidas_mes:Number(likes[0]?.total ?? 0), pessoas_favoritaram_total:Number(favorites[0]?.total ?? 0), novos_favoritos_mes:0, favoritos_sem_data:Number(favorites[0]?.total ?? 0), post_mais_curtido: best.length ? { ...best[0], curtidas:Number(best[0].curtidas) } : null } });
  } catch (err) { console.error("Falha nas métricas do dashboard", err); return res.status(500).json({message:"Não foi possível carregar a Dashboard."}); }
});
export default router;
