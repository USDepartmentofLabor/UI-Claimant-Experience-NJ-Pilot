# Revert JSON Schema dialect to Draft 2019-09

- Status: Decided
- Deciders: James DeHart
- Date: 1/25/2023

Json schema is a fairly new schema language written for JSON documents. Being fairly new,
the implementations of said schema language have quite a few inconsistencies with both the description of the language itself and other implementations.
In our case, the most popular Java implementation of the schema language validation [json-schema-validator](https://github.com/networknt/json-schema-validator) has
a frustrating inconsistency where it does not recognize the [Items](https://json-schema.org/understanding-json-schema/reference/array.html) keyword for describing arrays
in the Draft 2020-12 version of the implementation. This is likely a result of the change in meaning of the keywords [items, additionalItems,
and prefixItem](https://json-schema.org/draft/2020-12/release-notes.html#changes-to-items-and-additionalitems). The result of this bug is that any array that is a part of the json payload
we deliver to the Nava API is completely ignored and not validated. This means that ANY array can pass through to the Nava API, no matter how malformed it is. We need to find an alternative
to our current setup of `json-schema-validator` and the 2020-12 dialect so that arrays like the employer array can be validated.

## Assumptions

- We want the entire claimant input payload to be validated.
- We will continue to use json schema validation on the backend until at least the end of Truss' contract.

## Constraints

- Can't just replace json schema.

## Considered Alternatives

- Keeping both the implementation and dialect the same but [fooling the parser](https://github.com/networknt/json-schema-validator/issues/587) to validate by using `"prefixItems": [{}]` before the `"items"` declaration of the array.
- Keeping the dialect at 2020-12 but using a different implementation of the json schema validation like [jsonschemafriend](https://github.com/jimblackler/jsonschemafriend).
- Revert the dialect to Draft 2019-09 (which correctly validates `items`) and continue to use `json-schema-validator`

## Pros and Cons of the Alternatives

### Option 1

- `+` We will be able to continue to gain the benefits of being up-to-date on the schema language version.
- `+` We will still be able to use `json-schema-validator` which is the fastest implementation on Java.
- `-` This approach has valid syntax but ignores the problem that the 2020 implementation is known to have bugs.
- `-` In the debug messages the `items` keyword is still listed as unknown (even though it works).
- `-` This is a hack.

### Option 2

- `+` Benefits of staying up to date on schema language
- `±` There can be no confirmation that other implementations are more robust at implementing the 2020 version of the schema.
- `-` All other Java implementations are both slower and almost unused completely by other open source projects.

### Option 3

- `+` Still get to use `json-schema-validator`
- `-` Don't get to use the latest additions to schema language in the 2020 version.

## Decision Outcome

Option 3.

Option 3 simply is the most stable solution out of all three of these options and that is why it is being selected.
There is nothing that the 2020 version of the schema actually benefits us with currently so any pluses given to the 2020
version are really quite irrelevant to what we are doing. Additionally, while the argument can be made that this implementation can't be trusted with a bug like this,
the other implementations are so unused that I would consider those options even less trustworthy regardless of performance issues.
