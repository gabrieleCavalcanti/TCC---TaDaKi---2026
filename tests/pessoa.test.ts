import { describe, it, expect, vi } from "vitest";
import { PostController } from "../src/controllers/post.controller";

 describe("Visualizar Posts da Organização", () => {
        it("Deve retornar os posts de uma organização específica", async () => {
            const postsMock = [
                { id_post: 1, titulo: "Post da organização" },
                {id_post: 2,titulo: "Segundo post" }
            ];
            const serviceMock = { selecionaByOrganizacao:vi.fn().mockResolvedValue(postsMock) };
            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_organizacao: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaByOrganizacao(req, res);
            expect(
                serviceMock.selecionaByOrganizacao
            ).toHaveBeenCalledWith(1);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({posts: postsMock});
        });


        it("Deve retornar erro quando o ID da organização for inválido", async () => {

            const serviceMock = {
                selecionaByOrganizacao: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_organizacao: 0
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaByOrganizacao(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID da organização inválido"
                });

            expect(
                serviceMock.selecionaByOrganizacao
            ).not.toHaveBeenCalled();
        });

    });