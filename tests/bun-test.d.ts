declare module "bun:test" {
  export const describe: typeof import("@jest/globals").describe;
  export const it: typeof import("@jest/globals").it;
  export const expect: typeof import("@jest/globals").expect;
}
