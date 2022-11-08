import React from 'react'
import { useTranslation } from 'react-i18next'
import njLogo from '@newjersey/njwds/src/img/nj-logo-gray-20.png'
import {
  Link,
  Identifier,
  IdentifierMasthead,
  IdentifierLogos,
  IdentifierLogo,
  IdentifierIdentity,
  IdentifierLinks,
  IdentifierLink,
  IdentifierLinkItem,
  IdentifierGov,
  GridContainer,
} from '@trussworks/react-uswds'

export const Footer = () => {
  const { t } = useTranslation('common', { keyPrefix: 'footer' })

  return (
    <footer role="contentinfo">
      <GridContainer className="usa-footer__return-to-top">
        <Link href="#">{t('return_top')}</Link>
      </GridContainer>
      <Identifier>
        <IdentifierMasthead aria-label={t('identifier_aria')}>
          <IdentifierLogos>
            <IdentifierLogo href="https://nj.gov">
              <img
                key="logo"
                src={njLogo.src}
                className="usa-identifier__logo-img"
                alt={t('logo_alt')}
              />
            </IdentifierLogo>
          </IdentifierLogos>
          <IdentifierIdentity domain="unemployment.nj.gov">
            {t('official')}
            <Link href="https://nj.gov">{t('state')}</Link>
          </IdentifierIdentity>
        </IdentifierMasthead>
        <IdentifierLinks navProps={{ 'aria-label': t('links') }}>
          <IdentifierLinkItem key="gov">
            <IdentifierLink href="https://nj.gov/governor/admin/about/">
              {t('gov')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="ltgov">
            <IdentifierLink href="https://nj.gov/governor/admin/lt/">
              {t('ltgov')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="home">
            <IdentifierLink href="https://nj.gov/">{t('home')}</IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="services">
            <IdentifierLink href="https://nj.gov/nj/gov/njgov/alphaserv.html">
              {t('services')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="departments">
            <IdentifierLink href="https://nj.gov/nj/gov/deptserv/">
              {t('departments')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="faqs">
            <IdentifierLink href="https://nj.gov/faqs/">
              {t('faqs')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="contact">
            <IdentifierLink href="https://nj.gov/nj/feedback.html">
              {t('contact')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="privacy">
            <IdentifierLink href="https://nj.gov/nj/privacy.html">
              {t('privacy')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="legal">
            <IdentifierLink href="https://nj.gov/nj/legal.html">
              {t('legal')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="accessibility">
            <IdentifierLink href="https://nj.gov/nj/accessibility.html">
              {t('accessibility')}
            </IdentifierLink>
          </IdentifierLinkItem>
          <IdentifierLinkItem key="opra">
            <IdentifierLink href="https://nj.gov/opra/">
              {t('opra')}
            </IdentifierLink>
          </IdentifierLinkItem>
        </IdentifierLinks>
        <IdentifierGov aria-label={t('gov_aria')}>
          {t('copyright')}
        </IdentifierGov>
      </Identifier>
    </footer>
  )
}
