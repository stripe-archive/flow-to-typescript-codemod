// import a js file to force an error message that includes an absolute path to be made relative
import foo from './test-javascript-input';

// Testing removing unused

const error1: string = 0;

// Line above suppression
// @ts-expect-error not actually error
export const foo = () => {
  console.log(
    // Other comment
    "foo",
    // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type '{ customer: string; ephemeralKey: string; } | null'.
    "bar",
    "baz"
  );

  const error2: string = 0;

  /* @ts-expect-error not actually error */
  return "bar";
};

const error1: string = 0;

// Testing suppression inside tagged template literal (a la styled components)
type Bar = { baz: {} }
type StringProducer = (arg0: Bar) => string;

export function foo2(_strings: TemplateStringsArray, ...stringProducers: Array<StringProducer>) {
  return '';
}

const bar = foo2`
  hello
  ${({baz}: Bar) => baz.bun}
  world
  ${({baz}: Bar) => baz.bun}
  again
  ${({baz}: Bar) => baz.bun}
  and
  ${({baz}: Bar) => baz.bun}
  again
`

// Testing single line template literal
const baz = foo2`${({baz}: Bar) => baz.bun}`
