import { useSession } from "next-auth/react";
import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { Spinner } from "~/components/Spinner";
import { messageSend } from "~/utils/socket/pub/message-send";

type SendMessageProps = {
  phone: string;
}

export const SendMessage = ({ phone }: SendMessageProps) => {
  const session = useSession();
  const ref = useRef<HTMLDivElement>(null);

  if (!session.data) return (<Spinner />);

  const handleSubmit = (e: KeyboardEvent<HTMLDivElement> | FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault();
    if (!ref.current) return;

    messageSend({ phone, message: `*${session.data.user.name}*: ${ref.current.textContent}` });
    ref.current.textContent = "";
  }

  return (<form onSubmit={handleSubmit} className="flex gap-3 w-full p-4 items-end ease-in">
    <div
      ref={ref}
      contentEditable
      role="textbox"
      content="Digite uma mensagem123"
      onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
      spellCheck
      aria-autocomplete="list"
      title="Digite uma mensagem"
      className="outline-none rounded max-h-[7.35em] min-h-[1.47em] user-select-text whitespace-pre-wrap break-words w-full bg-slate-500 p-2 text-slate-100 "
    >
    </div>
    <button

      type="submit"
      className="rounded-md h-fit border-slate-100 bg-slate-500 p-2 text-slate-100 shadow-lg hover:opacity-80 transition-opacity font-bold"
    >
      Enviar
    </button>
  </form>)
}