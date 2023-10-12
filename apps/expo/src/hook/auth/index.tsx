import { type ClientInfoResponse } from '@acme/api/src/mkServices/getClientInfo';
import { type Connections, type GetConnectionsResponse } from '@acme/api/src/mkServices/getConnections';
import { type Contracts, type GetContractsResponse } from '@acme/api/src/mkServices/getContracts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { api } from '~/utils/api';

interface ContextProps {
  clientInfo: UseQueryResult<ClientInfoResponse, unknown>;
  connections: UseQueryResult<GetConnectionsResponse, unknown>;
  contracts: UseQueryResult<GetContractsResponse, unknown>;
  handleSetSessionId: (session: string) => void;
  session: string;
  selectedConnection?: ISelectedConnection;
  handleSetSelectedConnection: (connection?: ISelectedConnection) => void;
}

const Context = React.createContext({} as ContextProps);

interface ContextProviderProps {
  children: React.ReactNode;
}


type ISelectedConnection = {
  connection: Connections;
  contract?: Contracts;
}
function ContextProvider(props: ContextProviderProps) {
  const [session, setSession] = React.useState<string>('');
  const [selectedConnection, setSelectedConnection] = React.useState<ISelectedConnection>();
  const router = useRouter();

  const clientInfo = api.mk.getClientInfo.useQuery({ session: session }, {
    enabled: !!session,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const connections = api.mk.getConnections.useQuery({ session: session },
    {
      enabled: !!session,
      refetchOnWindowFocus: false,
      retry: false,
    });
  const contracts = api.mk.getContracts.useQuery({ session: session },
    {
      enabled: !!session,
      refetchOnWindowFocus: false,
      retry: false,
    });
  const handleSetSessionId = (session: string) => setSession(session);
  const handleSetSelectedConnection = (connection?: ISelectedConnection) => setSelectedConnection(connection);


  React.useEffect(() => {
    void AsyncStorage.getItem("_jid").then(async (response) => {
      if (response) {
        handleSetSessionId(response);
        const selectedConnection = await AsyncStorage.getItem("@selectedConnection");

        if (selectedConnection) {
          handleSetSelectedConnection(JSON.parse(selectedConnection));
          router.replace("/home");
        }
        router.replace("/select-plan");
      }
    })
  }, []);


  return (
    <Context.Provider
      value={{
        clientInfo,
        connections,
        contracts,
        handleSetSessionId,
        session,
        selectedConnection,
        handleSetSelectedConnection,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}


//hook
const useContextHook = () => React.useContext(Context);

export { ContextProvider, useContextHook };
