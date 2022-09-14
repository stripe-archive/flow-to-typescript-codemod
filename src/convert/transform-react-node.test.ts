import { transform } from "./utils/testing";

describe("transforms Node to ReactNode", () => {
  it("convert Node to ReactNode", async () => {
    const src = `
      import React, { type Node } from 'react';
      export default function MyComponent(props): Node {
        return <div></div>;
      }`;
    const expected = `
      import React, { ReactNode } from 'react';
      export default function MyComponent(props): ReactNode {
        return <div></div>;
      }`;
    expect(await transform(src)).toBe(expected);
  });
});
