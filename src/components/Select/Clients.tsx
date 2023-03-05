import React from "react";
import { useDebounce, useDiscloseSelect } from "../../hooks";
import { api } from "../../utils/api";
import { Loading } from "../Loading";

interface ClientForm {
  id: string;
  label: string;
}
interface SelectClientsProps {
  inputProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  value: ClientForm;
  onChange: (props: ClientForm) => void;
}

const Client = ({
  onChange,
  value,
  inputProps: { onFocus, ...inputProps },
}: SelectClientsProps) => {
  const { ref, isVisible, onClose, onOpen } = useDiscloseSelect();
  const [searchName, setSearchName] = React.useState("");
  const searchDebounce = useDebounce(searchName, 300);
  const listClients = api.clients.getAll.useQuery({
    name: searchDebounce,
    limit: 10,
  });
  const queryClient = api.useContext();
  const createClient = api.clients.create.useMutation({
    onSuccess: () => queryClient.clients.getAll.invalidate(),
  });
  return (
    <div ref={ref} className="flex flex-col items-center justify-center  gap-5">
      <input
        readOnly
        type="text"
        onFocus={(e) => {
          onOpen();
          onFocus && onFocus(e);
        }}
        value={value.label}
        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
        {...inputProps}
      />
      {isVisible && (
        <div className="absolute top-28 z-[1400] flex w-[360px] flex-col items-center justify-center gap-2 rounded-md bg-slate-700 p-2 shadow-lg">
          <input
            placeholder="Filtrar"
            onChange={(e) => setSearchName(e.target.value)}
            value={searchName}
            className="my-2 w-full rounded border-[1px] border-stone-100 bg-stone-900 p-2 text-stone-100"
          />
          {searchName && (
            <button
              type="button"
              className="flex rounded-md bg-blue-600 p-2 capitalize text-slate-100 transition-colors hover:bg-blue-700"
              onClick={() => {
                createClient
                  .mutateAsync({ name: searchName })
                  .then((response) => {
                    onChange({ label: response.name, id: response.id });
                    onClose();
                  })
                  .catch((e) => console.log(e));
              }}
            >
              Adcionar {searchName}
            </button>
          )}
          <div className="flex max-h-72 w-full flex-col gap-2 overflow-y-scroll">
            {listClients.isLoading ? (
              <div className="flex w-full justify-center">
                <Loading />
              </div>
            ) : (
              listClients.data?.map((client) => (
                <button
                  key={client.id}
                  className="htransition-colors flex gap-2 rounded-md bg-stone-900  p-2 capitalize text-slate-100 transition-colors"
                  onClick={() => {
                    onChange({ label: client.name, id: client.id });
                    onClose();
                  }}
                >
                  {client.name.toLowerCase()}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Client);
