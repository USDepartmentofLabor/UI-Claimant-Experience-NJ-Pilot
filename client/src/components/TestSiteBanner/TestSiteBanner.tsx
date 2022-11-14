import styles from './TestSiteBanner.module.scss'
import { useTranslation } from 'react-i18next'

export const TestSiteBanner = () => {
  const { t } = useTranslation('common')
  return <div className={styles.banner}>{t('test_banner')}</div>
}
