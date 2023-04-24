<div align="center">
  <img
    src="./llama.png"
    alt="TypeScript Llama"
    width="160px"
  />
  <h1>Flow to TypeScript Codemod</h1>
  <br />
</div>


For more background on Stripe's TypeScript migration, check Stripe’s [blog
post](https://stripe.com/blog/migrating-to-typescript)!

> __Note__: Flow higher than `v0.92.1` is recommended.

```
typescriptify [command]

Commands:
  typescriptify setup    Set your project up to support TypeScript.
  typescriptify convert  Convert Flow-typed files to TypeScript.
  typescriptify fix      Use the TypeScript compiler to identify and fix errors.

Options:
  --version  Show version number
  --help     Show help
```

Practical examples on kitman-frontend:

* `profiler` is excluded because it cannot be migrated with
  `--ignoreFlowPragma` which is required fol all other packages
  ```
  KITMAN_FRONTEND_PACKAGES=()
  KITMAN_FRONTEND_PACKAGES_PATH=$HOME/dev/kitman-frontend/packages
  ls $KITMAN_FRONTEND_PACKAGES_PATH \
    | grep -v profiler \
    | while read package; do KITMAN_FRONTEND_PACKAGES+=$KITMAN_FRONTEND_PACKAGES_PATH/$package; done
  yarn typescriptify convert \
    -p $KITMAN_FRONTEND_PACKAGES[@] \
    --yarnPath ~/dev/kitman-frontend/node_modules/flow-bin/flow-osx-v0.131.0/flow \
    --ignoreFlowPragma \
    --silenceNonCriticalLogs \
    --useStrictAnyObjectType \
    --useStrictAnyFunctionType \
    --write \
    --delete
  ```
* migrate `profiler`
  ```
  yarn typescriptify convert \
    -p $HOME/dev/kitman-frontend/packages/profiler \
    --yarnPath ~/dev/kitman-frontend/node_modules/flow-bin/flow-osx-v0.131.0/flow \
    --silenceNonCriticalLogs \
    --useStrictAnyObjectType \
    --useStrictAnyFunctionType \
    --write \
    --delete
  ```

### Supporting prop spreads

If a codebase follows the pattern of accepting any prop, and then forwarding
them to another component like this:

```ts
const MyComponent = (props: Props) => {
  const { myProp, ...rest } = props;
  return <AnotherComponent test={myProp} {...rest} />
}
```

Flow was likely typing your extra parameters as `any`, and those will be type
failures in TypeScript. The tool has experimental support for updating prop
types to include the props of the underlying HTML element or component. Add the
`--handleSpreadReactProps` to turn on this transformation.

## 💻 Developing

```bash
# Install dependencies
yarn
# Run on a folder
yarn typescriptify convert -p ../path/to/your/codebase
# Build
yarn build
# Run tests
yarn test
# Type-check
yarn types
# Lint
yarn lint
```

## 📝 Notes

Stripe’ve compiled [notes](NOTES.md) documenting the complex type conversions.
