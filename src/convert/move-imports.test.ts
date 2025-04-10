import dedent from "dedent";
import { transform } from "./utils/testing";

jest.mock("../runner/migration-reporter/migration-reporter.ts");
jest.mock("./flow/type-at-pos.ts");

describe("imports", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("move react-router-dom imports", () => {
    it("react-router-dom stays and history stays", async () => {
      const src = dedent(`
      import {type RouterHistory as H, useLocation} from 'react-router-dom';
      import {createMemoryHistory} from 'history';
      `);
      const expected = dedent(`
      import {useLocation} from 'react-router-dom';
      import {History as H, createMemoryHistory} from 'history';
      `);
      expect(await transform(src)).toBe(expected);
    });

    it("react-router-dom stays and history is added", async () => {
      const src = dedent(`
      import {type RouterHistory as H, useLocation} from 'react-router-dom';
      `);
      const expected = dedent(`
      import {History as H} from 'history';
      import {useLocation} from 'react-router-dom';
      `);
      expect(await transform(src)).toBe(expected);
    });

    it("react-router-dom is removed and history stays", async () => {
      const src = dedent(`
      import {type RouterHistory as H} from 'react-router-dom';
      import {createMemoryHistory} from 'history';
      `);
      const expected = dedent(`
      import {History as H, createMemoryHistory} from 'history';
      `);
      expect(await transform(src)).toBe(expected);
    });

    it("react-router-dom is removed and history is added", async () => {
      const src = dedent(`
      import {type RouterHistory as H} from 'react-router-dom';
      const h: H | null = null;
      `);
      const expected = dedent(`
      import {History as H} from 'history';
      const h: H | null = null;
      `);
      expect(await transform(src)).toBe(expected);
    });
  });
});
