import { transform } from "./utils/testing";

describe("transform styled-components types", () => {
  it("converts PropsWithTheme<(never), any>", async () => {
    const src = `
      const BoxEnabledChecked = styled(Box)\`
        content: \${(props: PropsWithTheme<(never), any>) => props.theme?.name};
      \`;
    `;
    const expected = `
      const BoxEnabledChecked = styled(Box)\`
        content: \${(props) => props.theme?.name};
      \`;
    `;
    expect(await transform(src)).toBe(expected);
  });

  it("converts PropsWithTheme", async () => {
    const src = `
      const BoxEnabledChecked = styled(Box)\`
        content: \${(props: PropsWithTheme) => props.theme?.name};
      \`;
    `;
    const expected = `
      const BoxEnabledChecked = styled(Box)\`
        content: \${(props) => props.theme?.name};
      \`;
    `;
    expect(await transform(src)).toBe(expected);
  });

  it("converts PropsWithTheme within a large example", async () => {
    const src = `
      const ModalContainer = styled(Dialog)\`
        &&& {
          width: calc(100vw - 240px);
          max-width: \${(props: PropsWithTheme<(never), never>) => props.maxWidth};
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.11);
          border-radius: 5px;
          padding: 24px;
          box-sizing: border-box;

          @media (max-width: 600px) {
            width: calc(100vw - 48px);
            max-height: calc(100vh - 48px);
          }
        }
      \`;
    `;
    const expected = `
      const ModalContainer = styled(Dialog)\`
        &&& {
          width: calc(100vw - 240px);
          max-width: \${(props) => props.maxWidth};
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.11);
          border-radius: 5px;
          padding: 24px;
          box-sizing: border-box;

          @media (max-width: 600px) {
            width: calc(100vw - 48px);
            max-height: calc(100vh - 48px);
          }
        }
      \`;
    `;
    expect(await transform(src)).toBe(expected);
  });
});
