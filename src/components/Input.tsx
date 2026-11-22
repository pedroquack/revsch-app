import { InputHTMLAttributes } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...rest
}: InputProps) {
  const inputId = id || rest.name;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field${error ? " input-field-error" : ""}${
          className ? ` ${className}` : ""
        }`}
        {...rest}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}
