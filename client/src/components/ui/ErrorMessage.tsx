interface Props {
  message: string;
}

export const ErrorMessage = ({ message }: Props) => (
  <div className="error-message" role="alert">
    <span>⚠️</span> {message}
  </div>
);
