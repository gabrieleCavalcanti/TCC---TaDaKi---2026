import { describe, it, expect, vi } from "vitest";
import { PostController } from "../src/controllers/post.controller";


describe("PostController", () => {


    describe("Selecionar todos os posts", () => {

        it("Deve retornar todos os posts", async () => {

            const postsMock = [
                {
                    id_post: 1,
                    titulo: "Primeiro post"
                },
                {
                    id_post: 2,
                    titulo: "Segundo post"
                }
            ];

            const serviceMock = {
                selecionarTodos: vi.fn().mockResolvedValue(postsMock)
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {};

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionarTodos(req, res);

            expect(
                serviceMock.selecionarTodos
            ).toHaveBeenCalled();

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    posts: postsMock
                });
        });


        it("Deve retornar erro 500 quando o service apresentar erro", async () => {

            const serviceMock = {
                selecionarTodos: vi.fn()
                    .mockRejectedValue(new Error("Erro ao buscar posts"))
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {};

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionarTodos(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: "Erro ao buscar posts"
                });
        });

    });


    // =========================================================
    // CRIAR POST
    // =========================================================

    describe("Criar Post", () => {

        it("Deve criar um post com dados válidos", async () => {

            const novoPost = {
                id_post: 1,
                titulo: "Meu novo post"
            };

            const serviceMock = {
                criar: vi.fn().mockResolvedValue(novoPost)
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: " Meu novo post ",
                    descricao: "Descrição do post",
                    id_categoria: 2,
                    id_organizacao: 5
                },
                file: {
                    filename: "imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(serviceMock.criar)
                .toHaveBeenCalledWith(
                    "imagem.jpg",
                    "Meu novo post",
                    "Descrição do post",
                    2,
                    5
                );

            expect(res.status)
                .toHaveBeenCalledWith(201);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Post criado com sucesso",
                    novo: novoPost,
                    imagem: "imagem.jpg",
                    status: "PUBLICADO"
                });
        });


        it("Deve retornar erro quando o título não for informado", async () => {

            const serviceMock = {
                criar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: "",
                    descricao: "Descrição",
                    id_categoria: 1,
                    id_organizacao: 1
                },
                file: {
                    filename: "imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "O título do post é obrigatório"
                });

            expect(serviceMock.criar)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando o título tiver apenas espaços", async () => {

            const serviceMock = {
                criar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: "     ",
                    descricao: "Descrição",
                    id_categoria: 1,
                    id_organizacao: 1
                },
                file: {
                    filename: "imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "O título do post é obrigatório"
                });
        });


        it("Deve retornar erro quando a categoria for inválida", async () => {

            const serviceMock = {
                criar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: "Meu post",
                    descricao: "Descrição",
                    id_categoria: 0,
                    id_organizacao: 1
                },
                file: {
                    filename: "imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID da categoria inválido"
                });

            expect(serviceMock.criar)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando a organização for inválida", async () => {

            const serviceMock = {
                criar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: "Meu post",
                    descricao: "Descrição",
                    id_categoria: 1,
                    id_organizacao: 0
                },
                file: {
                    filename: "imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID da organização inválido"
                });

            expect(serviceMock.criar)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando a imagem não for enviada", async () => {

            const serviceMock = {
                criar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: "Meu post",
                    descricao: "Descrição",
                    id_categoria: 1,
                    id_organizacao: 1
                },
                file: undefined
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "A imagem do post é obrigatória"
                });

            expect(serviceMock.criar)
                .not.toHaveBeenCalled();
        });


        it("Deve usar descrição vazia quando ela não for informada", async () => {

            const novoPost = {
                id_post: 1,
                titulo: "Meu post"
            };

            const serviceMock = {
                criar: vi.fn().mockResolvedValue(novoPost)
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: "Meu post",
                    id_categoria: 1,
                    id_organizacao: 1
                },
                file: {
                    filename: "imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(serviceMock.criar)
                .toHaveBeenCalledWith(
                    "imagem.jpg",
                    "Meu post",
                    "",
                    1,
                    1
                );
        });


        it("Deve retornar erro 500 quando ocorrer erro ao criar o post", async () => {

            const serviceMock = {
                criar: vi.fn()
                    .mockRejectedValue(new Error("Erro no banco"))
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                body: {
                    titulo: "Meu post",
                    descricao: "Descrição",
                    id_categoria: 1,
                    id_organizacao: 1
                },
                file: {
                    filename: "imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.criar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: "Erro no banco"
                });
        });

    });


    // =========================================================
    // EDITAR POST
    // =========================================================

    describe("Editar Post", () => {

        it("Deve editar um post com dados válidos", async () => {

            const postExistente = [
                {
                    id_post: 1,
                    vincularImagem: "imagem-antiga.jpg"
                }
            ];

            const postAlterado = {
                id_post: 1,
                titulo: "Post alterado"
            };

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue(postExistente),

                editar: vi.fn()
                    .mockResolvedValue(postAlterado)
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                },
                body: {
                    titulo: "Post alterado",
                    descricao: "Nova descrição",
                    id_categoria: 2,
                    id_organizacao: 3
                },
                file: {
                    filename: "nova-imagem.jpg"
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(serviceMock.selecionaById)
                .toHaveBeenCalledWith(1);

            expect(serviceMock.editar)
                .toHaveBeenCalledWith(
                    1,
                    "nova-imagem.jpg",
                    "Post alterado",
                    "Nova descrição",
                    2,
                    3
                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Post alterado com sucesso",
                    alterado: postAlterado,
                    imagem: "nova-imagem.jpg"
                });
        });


        it("Deve retornar erro quando o ID do post for inválido", async () => {

            const serviceMock = {
                selecionaById: vi.fn(),
                editar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 0
                },
                body: {}
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID do post inválido"
                });

            expect(serviceMock.editar)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando o post não existir", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue([]),

                editar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                },
                body: {}
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Post não encontrado"
                });

            expect(serviceMock.editar)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando o título for inválido", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue([
                        {
                            id_post: 1,
                            vincularImagem: "imagem.jpg"
                        }
                    ]),

                editar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                },
                body: {
                    titulo: "",
                    id_categoria: 1,
                    id_organizacao: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "O título do post é obrigatório"
                });

            expect(serviceMock.editar)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando a categoria for inválida", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue([
                        {
                            id_post: 1,
                            vincularImagem: "imagem.jpg"
                        }
                    ]),

                editar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                },
                body: {
                    titulo: "Post alterado",
                    id_categoria: 0,
                    id_organizacao: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID da categoria inválido"
                });
        });


        it("Deve retornar erro quando a organização for inválida", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue([
                        {
                            id_post: 1,
                            vincularImagem: "imagem.jpg"
                        }
                    ]),

                editar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                },
                body: {
                    titulo: "Post alterado",
                    id_categoria: 1,
                    id_organizacao: 0
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID da organização inválido"
                });
        });


        it("Deve manter a imagem antiga quando nenhuma nova imagem for enviada", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue([
                        {
                            id_post: 1,
                            vincularImagem: "imagem-antiga.jpg"
                        }
                    ]),

                editar: vi.fn()
                    .mockResolvedValue({})
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                },
                body: {
                    titulo: "Post alterado",
                    descricao: "Descrição",
                    id_categoria: 1,
                    id_organizacao: 1
                },
                file: undefined
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(serviceMock.editar)
                .toHaveBeenCalledWith(
                    1,
                    "imagem-antiga.jpg",
                    "Post alterado",
                    "Descrição",
                    1,
                    1
                );
        });


        it("Deve retornar erro quando ocorrer erro ao editar", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue([
                        {
                            id_post: 1,
                            vincularImagem: "imagem.jpg"
                        }
                    ]),

                editar: vi.fn()
                    .mockRejectedValue(new Error("Erro ao editar post"))
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                },
                body: {
                    titulo: "Post alterado",
                    descricao: "Descrição",
                    id_categoria: 1,
                    id_organizacao: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.editar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro ao editar post"
                });
        });

    });


    // =========================================================
    // ARQUIVAR POST
    // =========================================================

    describe("Arquivar Post", () => {

        it("Deve arquivar um post com ID válido", async () => {

            const serviceMock = {
                arquivar: vi.fn().mockResolvedValue(undefined)
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.arquivar(req, res);

            expect(serviceMock.arquivar)
                .toHaveBeenCalledWith(1);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Post arquivado com sucesso",
                    id_post: 1,
                    status: "ARQUIVADO"
                });
        });


        it("Deve retornar erro quando o ID do post for inválido", async () => {

            const serviceMock = {
                arquivar: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 0
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.arquivar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID do post inválido"
                });

            expect(serviceMock.arquivar)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando o service apresentar erro", async () => {

            const serviceMock = {
                arquivar: vi.fn()
                    .mockRejectedValue(new Error("Erro ao arquivar"))
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.arquivar(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Erro ao arquivar"
                });
        });

    });


    // =========================================================
    // SELECIONAR POST POR ID
    // =========================================================

    describe("Selecionar Post por ID", () => {

        it("Deve retornar um post pelo ID", async () => {

            const postMock = [
                {
                    id_post: 1,
                    titulo: "Meu post",
                    vincularImagem: "imagem.jpg"
                }
            ];

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue(postMock)
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaById(req, res);

            expect(serviceMock.selecionaById)
                .toHaveBeenCalledWith(1);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    post: postMock
                });
        });


        it("Deve retornar erro quando o ID não for válido", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 0
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaById(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "O ID do post deve ser um número válido"
                });

            expect(serviceMock.selecionaById)
                .not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando o post não for encontrado", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockResolvedValue([])
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 999
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaById(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Post não encontrado"
                });
        });


        it("Deve retornar erro quando ocorrer erro no service", async () => {

            const serviceMock = {
                selecionaById: vi.fn()
                    .mockRejectedValue(new Error("Erro no banco"))
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_post: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaById(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: "Erro no banco"
                });
        });

    });


    // =========================================================
    // SELECIONAR POR CATEGORIA
    // =========================================================

    describe("Selecionar Posts por Categoria", () => {

        it("Deve retornar posts de uma categoria", async () => {

            const postsMock = [
                {
                    id_post: 1,
                    titulo: "Post da categoria"
                },
                {
                    id_post: 2,
                    titulo: "Outro post"
                }
            ];

            const serviceMock = {
                selecionaByCategoria: vi.fn()
                    .mockResolvedValue(postsMock)
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_categoria: 2
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaByCategoria(req, res);

            expect(serviceMock.selecionaByCategoria)
                .toHaveBeenCalledWith(2);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    posts: postsMock
                });
        });


        it("Deve retornar erro quando o ID da categoria for inválido", async () => {

            const serviceMock = {
                selecionaByCategoria: vi.fn()
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_categoria: 0
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaByCategoria(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(400);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "ID da categoria inválido"
                });

            expect(
                serviceMock.selecionaByCategoria
            ).not.toHaveBeenCalled();
        });


        it("Deve retornar erro quando ocorrer erro no service", async () => {

            const serviceMock = {
                selecionaByCategoria: vi.fn()
                    .mockRejectedValue(new Error("Erro ao buscar categoria"))
            };

            const controller =
                new PostController(serviceMock as any);

            const req: any = {
                query: {
                    id_categoria: 1
                }
            };

            const res: any = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn().mockReturnThis()
            };

            await controller.selecionaByCategoria(req, res);

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: "Erro ao buscar categoria"
                });
        });

    });


    // =========================================================
    // SELECIONAR POR ORGANIZAÇÃO
    // =========================================================

    describe("Selecionar Posts da Organização", () => {

        it("Deve retornar os posts de uma organização específica", async () => {

            const postsMock = [
                {
                    id_post: 1,
                    titulo: "Post da organização"
                },
                {
                    id_post: 2,
                    titulo: "Segundo post"
                }
            ];

            const serviceMock = {
                selecionaByOrganizacao:
                    vi.fn().mockResolvedValue(postsMock)
            };

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

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    posts: postsMock
                });
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


        it("Deve retornar erro quando ocorrer erro no service", async () => {

            const serviceMock = {
                selecionaByOrganizacao:
                    vi.fn().mockRejectedValue(
                        new Error("Erro ao buscar organização")
                    )
            };

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

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({
                    message: "Ocorreu um erro no servidor",
                    errorMessage: "Erro ao buscar organização"
                });
        });

    });

});