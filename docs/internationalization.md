# Internationalization (i18n)

- [I18next](https://www.i18next.com/) is used for internationalization.
- Next.js's [internationalized routing](https://nextjs.org/docs/advanced-features/i18n-routing) feature is enabled. Toggling between languages is done by changing the URL's path prefix (e.g. `/about` ➡️ `/es/about`).
- Configuration for the i18n routing and i18next libraries are located in [`next-i18next.config.js`](../client/next-i18next.config.js).

## Managing translations

- Translations are managed in the [`i18n`](../client/src/i18n/) directory, where each language has its own directory (e.g. `en` for English content).
- [Namespaces](https://www.i18next.com/principles/namespaces) can be used to organize translations into smaller files. For large sites, it's common to create a namespace for each controller, page, or feature (whatever level makes most sense).
- There are a number of built-in formatters based on [JS's `Intl` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) that can be used in locale strings, and custom formatters can be added as well. [See the i18next formatting docs for details](https://www.i18next.com/translation-function/formatting#built-in-formats).

## Rendering translated content

The `next-i18next` package provides a `useTranslation` hook to access a `t()` method, or a `Trans` component to render localized strings.

The `t()` method can be used to render a single string, or the `Trans` component can be used to render a string with HTML tags.

```tsx
import { Trans, useTranslation } from "next-i18next";

const Page = () => {
  // Optionally pass in the namespace of the translation file to use
  const { t } = useTranslation("claimForm");
  return (
    <>
      <h1>{t("title")}</h1>
      <Trans
        i18nKey="summary"
        t={t}
        components={{
          ul: <ul className="usa-list" />
          li: <li />
          "example-link": <a href="https://example.com" />
        }}
      />
    </>
  );
};
```

Refer to the [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/) documentation for more usage docs.
