export const LoadingSpinner = ({ message = 'Loading…' }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader" />
      <span>{message}</span>
    </div>
  )
}
