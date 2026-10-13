export default function ErrorComponent({ message, className }) {
  return <div className={`bg-red-900 p-2 ${className}`}>{message}</div>;
}
