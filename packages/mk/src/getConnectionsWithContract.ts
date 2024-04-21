import { getConnections } from "./getConnections";
import { getContracts } from "./getContracts";

type GetConnectionsWithContractProps = {
  personCode: number;
  token: string;
}


export const getConnectionsWithContract = async (props: GetConnectionsWithContractProps) => {

  const connections = await getConnections(props);
  const contracts = await getContracts(props);

  if (connections.status !== "OK" || contracts.status !== "OK") return;

  const locations = connections.Conexoes.map((connection) => ({
    ...connection,
    contract: contracts.ContratosAtivos.find((contract) => contract.codcontrato === connection.contrato) ?? null
  }))

  return locations;

}

export type ConnectionWithContract = ReturnType<Awaited<typeof getConnectionsWithContract>>;