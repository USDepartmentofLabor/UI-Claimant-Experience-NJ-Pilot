import styles from './BetaBanner.module.scss'
import { useTranslation } from 'react-i18next'

export const BetaBanner = () => {
  const { t } = useTranslation('common')

  return (
    <section className="bg-primary-lighter">
      <div className={styles['beta-banner']}>
        <strong>{t('beta_banner.description')}&nbsp;</strong>
        {t('beta_banner.disclaimer')}
      </div>
    </section>
  )
}
