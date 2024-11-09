import { Input } from "./ui/input";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  touched?: boolean;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  touched,
  error,
  ...inputProps
}) => (
  <div>
    <Input {...inputProps} />
    {touched && error && (
      <p className="text-sm text-destructive mt-1">{error}</p>
    )}
  </div>
);

export default FormInput;
