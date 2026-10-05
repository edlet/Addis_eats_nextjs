export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
}) {
  const errorId = `${name}-error`;
  const shouldShowError = touched && error;

  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={Boolean(shouldShowError)}
        aria-describedby={
          shouldShowError ? errorId : undefined
        }
      />

      {shouldShowError && (
        <p
          id={errorId}
          className="error-message"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}