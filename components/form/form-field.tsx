import Link from "next/link";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Route } from "next";

// type RegisterErrors = {
//   name?: string
//   email?: string
//   password?: string
//   confirm?: string
// }

type FormErrors = Partial<Record<string, string>>

type FormFieldType = {
  htmlFor: string,
  label: string,
  name: string,
  type: string,
  autocomplete: string,
  forgetPasswordLink?: boolean
  placeholder: string,
  state?: {
    errors?: FormErrors
    // errors?: RegisterErrors,
    redirectTo?: string
  } | null,
}

const inputCls = "h-11 px-4 rounded-xl bg-[#1f1c18] border-white/[0.09] text-zinc-100 placeholder:text-[#3d3830] focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/10 dark:bg-[#1f1c18]"
const labelCls = "text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a5248]"
const errorCls = "text-rose-400/80 text-xs"

export function FormField ({type, autocomplete, forgetPasswordLink, name, label, placeholder, state, htmlFor, ...props }:FormFieldType) {
  return (
    <Field>
      <FieldLabel
        htmlFor={htmlFor}
        className={labelCls}
      >
        {label}
      </FieldLabel>
     {forgetPasswordLink && (
        <Link
          href={"/forgot-password" as Route}
          className="text-[10px] tracking-wide text-[#5e5448] hover:text-amber-400/80 transition-colors"
        >
          Forgot password?
        </Link>
     )}
      <Input
        id={htmlFor}
        name={name}
        type={type}
        autoComplete={autocomplete}
        placeholder={placeholder}
        className={inputCls}
        {...props}
      />
      <FieldError className={errorCls} errors={[{ message: state?.errors?.[name] }]} />
    </Field>
  )
}