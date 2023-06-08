import { mk } from "./mk";

export interface ClientInfoRequest {
    id: number;
}

export type ClientInfoResponse = {
    id: number;
    dataCadastro: Date;
    nome: string;
    cpf: string;
    email: string;
    classificacao: string;
    nascimento: null;
    tipo: string;
    fone: string;
    estadoId: number;
    estadoCobrancaId: number;
    cidadeId: number;
    cidadeCobrancaId: number;
    bairroId: number;
    bairroCobrancaId: number;
    logradouroId: number;
    logradouroCobrancaId: number;
    numero: number;
    numeroCobranca: number;
    cep: string;
    cepCobranca: string;
    provedorEmpresaId: number;
    provedorEmpresa: ProvedorEmpresa;
}

export interface ProvedorEmpresa {
    id: number;
    nome: string;
    cnpj: string;
    ie: string;
    endereco: string;
    municipio: string;
    uf: string;
    cep: string;
    fone: string;
}


export const getClientInfo = async (params: ClientInfoRequest) => {
    const data = await mk.get<ClientInfoResponse>(
        `/core-api/pessoas/id?id=${params.id}`,
    );
    console.log(data.data);
    return data.data;
};
