import { describe, it, expect } from "vitest";

import { EnderecoController } from "../src/controllers/endereco.controller";

describe("selecionarTodos", () => {

    it("deve selecionar todos os endereços", async () => {

        const controller = new EnderecoController();

        expect(controller.selecionarTodos).toBeDefined();

    });

     it("deve selecionar endereço pelo ID", () => {
        // ...
    });

    it("deve retornar erro quando o ID for inválido", () => {
        // ...
    });


});
