import { Meta } from '@storybook/react'

export default {
  title: 'Core/Typography',
  args: {
    sampleText: 'The quick brown fox jumps over the lazy dog',
  },
} as Meta

const styles: { [name: string]: string } = {
  Display: 'nj-heading--display',
  'Level 1': 'nj-h1',
  'Level 2': 'nj-h2',
  'Level 3': 'nj-h3',
  'Level 4': 'nj-h4',
  'Level 5': 'nj-h5',
  'Level 6': 'nj-h6',
  'Lead or Intro': 'usa-intro',
}

export const Typography = (args: { sampleText: string }) => {
  return (
    <>
      <p>
        The intent of this page is to provide consistent language across
        disciplines for typography styles, and to demonstrate their output and
        mappings in code.
      </p>
      <p>
        <strong>
          Refer to the{' '}
          <a href="https://designsystem.digital.gov/utilities/paragraph-styles/">
            USWDS utility classes
          </a>{' '}
          for more options.
        </strong>
      </p>
      <p className="font-body-2xs">
        <strong>Note</strong>: Heading levels are mentioned below because
        they&apos;re sometimes used in Design communications (such as NJ&apos;s
        own Figma file). Style and HTML semantics are separate concerns however.
        Engineers should determine what the most appropriate heading level
        element (e.g h2, h3) is, to{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#accessibility_concerns">
          avoid skipping heading levels
        </a>
        , and style it to match the desired level.
      </p>
      {Object.entries(styles).map(([name, classes]) => (
        <div
          key={name}
          className="border-top-2px padding-top-4 margin-top-4 measure-6"
        >
          <strong className="text-secondary font-family-mono font-mono-3xs margin-bottom-2">
            {name}
          </strong>
          <div className={classes}>{args.sampleText}</div>
          <div className="font-family-mono font-mono-3xs text-base margin-top-2">
            className=&quot;{classes}&quot;
          </div>
        </div>
      ))}

      <div className="border-top-2px padding-top-4 margin-top-4 measure-6">
        <strong className="text-secondary font-family-mono font-mono-3xs margin-bottom-2">
          Body text (default)
        </strong>
        <p>{args.sampleText}</p>
        <p>
          Body text with <strong>bold text</strong>, <em>italic text</em>, and a{' '}
          <a href="https://nj.gov">link</a>.
        </p>
        <ul className="usa-list">
          <li>Unordered list item</li>
          <li>Unordered list item</li>
        </ul>
        <ol className="usa-list">
          <li>Ordered list item</li>
          <li>Ordered list item</li>
        </ol>
      </div>
    </>
  )
}
