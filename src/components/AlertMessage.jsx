export const AlertMessage = ({ variant = 'error', children }) => {
  return <div className={`alert-message ${variant}`}>{children}</div>
}
