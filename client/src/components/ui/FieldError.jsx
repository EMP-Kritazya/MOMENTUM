function FieldError({ id, children }) {
    if (!children) return null

    return (
        <p id={id} className="mt-2 text-sm font-medium text-red-400">
            {children}
        </p>
    )
}
export default FieldError