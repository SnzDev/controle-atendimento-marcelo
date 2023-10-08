import React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { api } from '~/utils/api';
import { type ClientInfoResponse } from '@acme/api/src/mkServices/getClientInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface ContextProps {
  clientInfo: UseQueryResult<ClientInfoResponse, unknown>;
  handleSetSessionId: (session: string) => void;
  session: string;
}

const Context = React.createContext({} as ContextProps);

interface ContextProviderProps {
  children: React.ReactNode;
}

function ContextProvider(props: ContextProviderProps) {
  const [session, setSession] = React.useState<string>('');
  const router = useRouter();

  const clientInfo = api.mk.getClientInfo.useQuery({ session: session }, {
    enabled: !!session,
    refetchOnWindowFocus: false,
  });
  const handleSetSessionId = (session: string) => setSession(session);


  React.useEffect(() => {
    void AsyncStorage.getItem("_jid").then((response) => {
      if (response) {
        handleSetSessionId(response);
        router.replace("/Home");
      }
    })
  }, []);


  return (
    <Context.Provider
      value={{
        clientInfo,
        handleSetSessionId,
        session
      }}
    >
      {props.children}
    </Context.Provider>
  );
}


//hook
const useContextHook = () => React.useContext(Context);

export { ContextProvider, useContextHook };
