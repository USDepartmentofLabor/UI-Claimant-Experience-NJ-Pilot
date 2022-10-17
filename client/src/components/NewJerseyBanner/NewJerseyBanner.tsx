import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import dotGovIcon from 'uswds/src/img/icon-dot-gov.svg'
import httpsIcon from 'uswds/src/img/icon-https.svg'
import nj_flag_small from 'assets/img/nj_flag_small.png'
import {
  BannerHeader,
  BannerContent,
  Banner,
  BannerButton,
  BannerGuidance,
  BannerFlag,
  BannerIcon,
  MediaBlockBody,
  BannerLockImage,
} from '@trussworks/react-uswds'

export const NewJerseyBanner = () => {
  const { t } = useTranslation('common', { keyPrefix: 'banner' })

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Banner aria-label={t('aria_label')}>
      <BannerHeader
        isOpen={isOpen}
        flagImg={
          <BannerFlag
            src={nj_flag_small.src}
            alt={t('flag_alt')}
            aria-hidden
            data-testid="nj-flag-img"
          />
        }
        headerText={t('header_text')}
        headerActionText={t('header_action')}
      >
        <BannerButton
          isOpen={isOpen}
          aria-controls="gov-banner"
          onClick={() => setIsOpen((previousIsOpen) => !previousIsOpen)}
        >
          {t('header_action')}
        </BannerButton>
      </BannerHeader>
      <BannerContent
        id="gov-banner"
        isOpen={isOpen}
        data-testid="banner-content"
      >
        <div className="grid-row grid-gap-lg">
          <BannerGuidance
            className="tablet:grid-col-6"
            data-testid="dot-gov-guidance"
          >
            <BannerIcon src={dotGovIcon.src} alt="" />
            <MediaBlockBody>
              <p>
                <strong>{t('dot_gov_title')}</strong>
                <br />
                <Trans t={t} i18nKey="dot_gov_description" />
              </p>
            </MediaBlockBody>
          </BannerGuidance>
          <BannerGuidance
            className="tablet:grid-col-6"
            data-testid="https-guidance"
          >
            <BannerIcon src={httpsIcon.src} alt="" />
            <MediaBlockBody>
              <p>
                <strong>{t('https_title')}</strong>
                <br />
                <Trans
                  t={t}
                  i18nKey="https_description_1"
                  components={{
                    strong: <strong />,
                  }}
                />{' '}
                ({' '}
                <BannerLockImage
                  title={t('lock_title')}
                  description={t('lock_description')}
                  svgProps={{ 'aria-hidden': true }}
                />{' '}
                ){' '}
                <Trans
                  t={t}
                  i18nKey="https_description_2"
                  components={{
                    strong: <strong />,
                  }}
                />
              </p>
            </MediaBlockBody>
          </BannerGuidance>
        </div>
      </BannerContent>
    </Banner>
  )
}
