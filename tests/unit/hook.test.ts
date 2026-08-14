import { formatCpf } from "@/presentation/shared/utils/cpf";

describe("Tests enviroment of testing", () => {
  it("Should return the formated string with the cpf pattern", () => {
    const formatResult = formatCpf("12345678912");

    expect(formatResult).toBe("123.456.789-12");
  });
});
