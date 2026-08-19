import { RowDataPacket } from "mysql2";

export interface ICliente extends RowDataPacket {
    id_cliente?: number;
    data_nascimento?: Date;
    id_pessoa?: number;
}

export class Cliente {
    private _id_cliente?: number;
    private _data_nascimento: Date;
    private _id_pessoa: number = 0;

    //Construtor
    constructor(data_nascimento: Date, id_pessoa: number, id_cliente?: number) {
        this._data_nascimento = data_nascimento;
        this._id_cliente = id_cliente;
        this._id_pessoa = id_pessoa;
    }

    //GETTERS
    public get IdCliente(): number | undefined {
        return this._id_cliente;
    }

    public get DataNascimento(): Date {
        return this._data_nascimento;
    }

    public get IdPessoa(): number {
        return this._id_pessoa;
    }


    // DP => FACTORY
    public static criar(data_nascimento: Date, id_pessoa: number): Cliente {
        return new Cliente(data_nascimento, id_pessoa);
    }

    public static editar(data_nascimento: Date, id_cliente: number) {
        return new Cliente(data_nascimento, id_cliente);
    }

}



// import { RowDataPacket } from "mysql2";

// export interface ICliente extends RowDataPacket {
//     id_cliente?: number;
//     data_nascimento?: Date;
//     id_pessoa?: number;
// }

// export class Cliente {
//     private _id_cliente?: number;
//     private _data_nascimento: Date = new Date();
//     private _id_pessoa: number = 0;

//     //Construtor
//     constructor(data_nascimento: Date, id_pessoa: number, id_cliente?: number) {
//         this._data_nascimento = data_nascimento;
//         this._id_cliente = id_cliente;
//         this._id_pessoa = id_pessoa;
//     }

//     //GETTERS
//     public get IdCliente(): number | undefined {
//         return this._id_cliente;
//     }

//     public get DataNascimento(): Date {
//         return this._data_nascimento;
//     }

//     public get IdPessoa(): number {
//         return this._id_pessoa;
//     }


//     // DP => FACTORY
//     public static criar(data_nascimento: Date, id_pessoa: number): Cliente {
//         return new Cliente(data_nascimento, id_pessoa);
//     }

//     public static editar(data_nascimento: Date, id_cliente: number) {
//         return new Cliente(data_nascimento, id_cliente);
//     }

// }
