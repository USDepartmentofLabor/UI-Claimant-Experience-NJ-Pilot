import classNames from 'classnames'

export const BannerFlag = ({
  alt,
  className,
  ...imgProps
}: JSX.IntrinsicElements['img']) => {
  const classes = classNames('usa-banner__header-flag', className)

  return <img className={classes} alt={alt} {...imgProps} />
}
