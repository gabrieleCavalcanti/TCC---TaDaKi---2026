import { Request, Response, NextFunction } from "express";

export function verificarOrganizacao(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(401).json({
            message: "Usuário não autenticado"
        });
    }

    if (req.user.tipo !== "ORGANIZACAO") {
        return res.status(403).json({
            message: "Apenas organizações podem realizar esta ação"
        });
    }

    next();
}

export function verificarCliente(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(401).json({
            message: "Usuário não autenticado"
        });
    }

    if (req.user.tipo !== "CLIENTE") {
        return res.status(403).json({
            message: "Apenas clientes podem realizar esta ação"
        });
    }

    next();
}