import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, createFilterOptions } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form/dist/types";
import { z } from "zod";
import { api } from "../utils/api";
import { Modal } from "@mui/material";
import React from "react";
interface AssignmentModalProps {
  isVisible: boolean;
  onClose: () => void;
}
function AssignmentModal({ isVisible, onClose }: AssignmentModalProps) {
  const schemaValidation = z.object({
    client: z.object({
      id: z.string().optional(),
      inputValue: z.string().optional(),
      label: z.string(),
    }),
    user: z.object({
      id: z.string({ required_error: "Obrigatório" }),
      label: z.string().optional(),
    }),
    shop: z.object({
      id: z.string({ required_error: "Obrigatório" }),
      label: z.string().optional(),
    }),
    service: z.object({
      id: z.string({ required_error: "Obrigatório" }),
      label: z.string().optional(),
    }),
    dateActivity: z.string(),
    observation: z.string().optional(),
  });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schemaValidation),
    defaultValues: {
      client: {
        id: "",
        label: "",
      },
      user: {
        id: "",
        label: "",
      },
      shop: {
        id: "",
        label: "",
      },
      service: {
        id: "",
        label: "",
      },
      dateActivity: moment().format("YYYY-MM-DD"),
    },
  });
  const queryCtx = api.useContext();
  const filter = createFilterOptions<{
    id?: string;
    label: string;
    inputValue?: string;
  }>();

  const createAssignment = api.assignment.create.useMutation({
    onSuccess: () => {
      void queryCtx.assignment.getAssignments.invalidate();
      reset();
    },
  });

  const createObservation = api.observation.create.useMutation({
    onSuccess: () => {
      void queryCtx.observation.getAll.invalidate();
    },
  });

  const createPatient = api.clients.create.useMutation({
    onSuccess: () => {
      void queryCtx.clients.getAll.invalidate();
    },
  });

  const listClients = api.clients.getAll.useQuery({});
  const listUser = api.user.getAll.useQuery({});
  const listShop = api.shop.getAll.useQuery({});
  const listService = api.service.getAll.useQuery({});

  const onSubmit: SubmitHandler<FieldValues> = ({
    observation,
    client,
    ...data
  }) => {
    if (!client.id)
      return createPatient
        .mutateAsync({ name: client.label })
        .then((response) =>
          createAssignment
            .mutateAsync({
              ...data,
              client: { id: response.id, label: response.name },
            })
            .then(({ id }) => {
              if (observation)
                createObservation.mutate({ assignmentId: id, observation });
            })
        );

    createAssignment
      .mutateAsync({
        client: { id: client.id, label: client.label },
        ...data,
      })
      .then(({ id }) => {
        if (observation)
          createObservation.mutate({ assignmentId: id, observation });
      })
      .catch((e) => console.log(e));
  };
  return (
    <Modal
      open={isVisible}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      onClose={onClose}
    >
      <div className="flex flex-col items-center justify-center rounded bg-slate-800 p-5 px-10 shadow-md ">
        <form
          className="flex flex-col items-center justify-items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            control={control}
            name="client"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                freeSolo
                onChange={(_e, v) => {
                  if (typeof v === "string") {
                    onChange({
                      label: v,
                    });
                  } else if (v && v?.inputValue) {
                    // Create a new value from the user input
                    onChange({
                      label: v.inputValue,
                    });
                  } else onChange(v);
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.label
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      label: `Adcionar "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                disableClearable
                options={
                  listClients.data
                    ?.filter((item) => !item.deletedAt)
                    ?.map(({ id, name }) => {
                      return { id, label: name, inputValue: undefined };
                    }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Cliente
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                    </span>
                    {errors.client && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.client.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />

          <Controller
            control={control}
            name="user"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listUser.data
                    ?.filter((item) => !item.deletedAt)
                    ?.map(({ id, name }) => {
                      return { id, label: name ?? "" };
                    }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Usuário
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                    </span>
                    {errors.user && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.user.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />

          <Controller
            control={control}
            name="service"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listService.data
                    ?.filter((item) => !item.deletedAt)
                    ?.map(({ id, name }) => {
                      return { id, label: name };
                    }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Tipo de Serviço
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                    </span>
                    {errors.service && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.service.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />
          <Controller
            control={control}
            name="shop"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listShop.data
                    ?.filter((item) => !item.deletedAt)
                    ?.map(({ id, name }) => {
                      return { id, label: `${name}` };
                    }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Revenda
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                    </span>
                    {errors.shop && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.shop.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />
          <Controller
            control={control}
            name="dateActivity"
            render={({ field: { onChange, ...field } }) => (
              <div>
                <p className=" text-base font-semibold text-stone-100">
                  Revenda
                </p>
                <span className="flex flex-row items-center pl-1.5">
                  <div className="z-10 mr-[-32px] w-[24px]"></div>
                  <input
                    onChange={onChange}
                    value={field.value}
                    type="date"
                    className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 text-stone-100"
                  />
                </span>
                {errors.dateActivity && (
                  <p className="text-sm font-semibold text-red-500">
                    {errors.dateActivity.message}
                  </p>
                )}
              </div>
            )}
          />
          <div>
            <p className=" text-base font-semibold text-stone-100">
              Observação
            </p>
            <textarea
              className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2  text-stone-100"
              {...register("observation")}
            ></textarea>
          </div>
          <div className="row flex justify-center">
            <button
              type="submit"
              className="mt-8 w-80 rounded bg-blue-500 p-2 font-semibold text-slate-100 hover:bg-blue-300"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default React.memo(AssignmentModal);
