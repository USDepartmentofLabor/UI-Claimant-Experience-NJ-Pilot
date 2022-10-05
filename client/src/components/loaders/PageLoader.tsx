import { useTranslation } from 'react-i18next'

const PageLoader = () => {
  const { t } = useTranslation('common')
  return (
    <div id="page-loading" data-testid="page-loading">
      {t('page_loader')}
    </div>
  )
}

export default PageLoader
