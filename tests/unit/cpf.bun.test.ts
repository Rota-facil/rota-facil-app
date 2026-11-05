import { describe, expect, it } from "bun:test";
import { formatCpf } from "../../src/presentation/shared/utils/cpf";

describe("formatCpf", () => {
  it("retorna o CPF formatado", () => {
    expect(formatCpf("12345678912")).toBe("123.456.789-12");
  });
});
