import classNames from 'classnames'

export const BannerIcon = ({
  src,
  alt,
  className,
  ...imgProps
}: JSX.IntrinsicElements['img']) => {
  const classes = classNames('usa-banner__icon usa-media-block__img', className)

  return (
    <img
      className={classes}
      src={src}
      alt={alt}
      aria-hidden="true"
      {...imgProps}
    />
  )
}
