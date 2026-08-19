import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";

export class ClienteController {
    constructor(private _service = new ClienteService()) { }

    selecionaTodos = async (req: Request, res: Response) => {
        try {
            const id = req.query.id

            if (id) {
                const id_cliente = Number(id);
                const clienteId = await this._service.selecionaId(id_cliente);
                if (clienteId.length === 0) {
                    return res.status(200).json({ message: 'cliente não localizado' });
                }
                return res.status(200).json({ clienteId });
            }

            const clientes = await this._service.selecionaTodos();
            res.status(200).json({ clientes });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
    editar = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id)
            const { data_nascimento } = req.body;

            console.log({ data_nascimento, id});
            const alterado = await this._service.editar(id, data_nascimento);
            res.status(200).json({ message: 'Cliente Editado Com Sucesso', alterado });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
    
}