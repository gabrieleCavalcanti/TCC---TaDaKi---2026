import type { Request, Response } from "express";
import type { DashboardRepository } from "../repository/dashboard.repository";
import { monthPeriod } from "../services/dashboard.model";
export class DashboardController {
  constructor(private repository: DashboardRepository) {}
  summary = async (req: Request, res: Response) => {
    if (!req.user)
      return res
        .status(401)
        .json({ message: "Entre para acessar o dashboard." });
    if (String(req.user.tipo).toUpperCase() !== "ORGANIZACAO")
      return res
        .status(403)
        .json({ message: "Dashboard disponível apenas para organizações." });
    let period;
    try {
      period = monthPeriod(req.query.mes);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
    try {
      const org = await this.repository.organization(req.user.id_login);
      if (!org)
        return res
          .status(403)
          .json({ message: "Sua conta não está vinculada a uma organização." });
      const dashboard = await this.repository.summary(
        org,
        period.start,
        period.end,
      );
      return res.json({
        dashboard: { ...dashboard, mes: period.month, id_organizacao: org },
      });
    } catch (error) {
      if ((error as { code?: string }).code === "ER_BAD_FIELD_ERROR")
        return res
          .status(503)
          .json({
            message:
              "Aplique a migração 001_favoritos_data.sql para habilitar o dashboard.",
          });
      console.error(error);
      return res
        .status(500)
        .json({ message: "Não foi possível carregar o dashboard." });
    }
  };
}
