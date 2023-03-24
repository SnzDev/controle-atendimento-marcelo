import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Modal } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form/dist/types";
import { z } from "zod";
import { api } from "../utils/api";
import { SelectClient } from "./Select";
interface AssignmentModalProps {
  isVisible: boolean;
  onClose: () => void;
}
function AssignmentModal({ isVisible, onClose }: AssignmentModalProps) {
  const schemaValidation = z.object({
    client: z.object({
      id: z.string({ required_error: "Obrigatório" }).min(3, "Obrigatório"),
      label: z.string({ required_error: "Obrigatório" }),
    }),
    user: z.object({
      id: z.string({ required_error: "Obrigatório" }).min(3, "Obrigatório"),
      label: z.string().optional(),
    }),
    shop: z.object({
      id: z.string({ required_error: "Obrigatório" }).min(3, "Obrigatório"),
      label: z.string().optional(),
    }),
    service: z.object({
      id: z.string({ required_error: "Obrigatório" }).min(3, "Obrigatório"),
      label: z.string().optional(),
    }),
    region: z.object({
      id: z.string({ required_error: "Obrigatório" }).min(3, "Obrigatório"),
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
      region: {
        id: "",
        label: "",
      },
      dateActivity: moment().format("YYYY-MM-DD"),
    },
    shouldFocusError: false,
  });
  const queryCtx = api.useContext();

  const createAssignment = api.assignment.create.useMutation({
    onSuccess: () => {
      void queryCtx.assignment.getAssignments.invalidate();
      void queryCtx.assignment.getAssignment.invalidate();
      reset();
    },
  });

  const createObservation = api.observation.create.useMutation({
    onSuccess: () => {
      void queryCtx.observation.getAll.invalidate();
      void queryCtx.assignment.getAssignments.invalidate();
      void queryCtx.assignment.getAssignment.invalidate();
    },
  });

  const listUser = api.user.getAll.useQuery({});
  const listShop = api.shop.getAll.useQuery({});
  const listService = api.service.getAll.useQuery({});
  const listRegion = api.region.getAll.useQuery({});

  const onSubmit: SubmitHandler<FieldValues> = ({ observation, ...data }) => {
    createAssignment
      .mutateAsync({
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
          <div>
            <p className=" text-base font-semibold text-stone-100">Cliente</p>
            <span className="flex flex-row items-center pl-1.5">
              <Image
                src="/icons/User.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <Controller
                control={control}
                name="client"
                render={({ field: { onChange, value, ...field } }) => (
                  <SelectClient
                    inputProps={{ ...field }}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </span>
            {errors.client && (
              <p className="text-sm font-semibold text-red-500">
                {errors.client?.id?.message}
              </p>
            )}
          </div>

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
                        {errors.user?.id?.message}
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
                        {errors.service?.id?.message}
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
                        {errors.shop?.id?.message}
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
            name="region"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listRegion.data
                    ?.filter((item) => !item.deletedAt)
                    ?.map(({ id, name }) => {
                      return { id, label: `${name}` };
                    }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Região
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
                    {errors.region && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.region?.id?.message}
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
                  Data do atendimento
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
