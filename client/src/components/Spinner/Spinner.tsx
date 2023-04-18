function Spinner(props: {
  className?: string
  'data-testid'?: string
  label?: string
}) {
  return (
    <div
      className={`display-flex ${props.className ?? ''}`}
      data-testid={props['data-testid']}
    >
      <img
        src="/spinner.svg"
        className="width-2 flex-align-self-center margin-right-1"
        data-testid="spinner"
        aria-hidden
        alt=""
      />
      {props.label}
    </div>
  )
}

export default Spinner
