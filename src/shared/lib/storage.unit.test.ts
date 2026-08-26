import { clearToken, getToken, setToken } from "./storage";

describe("token storage", () => {
  beforeEach(() => {
    clearToken();
  });

  it("stores and clears the access token", () => {
    setToken("access-token");

    expect(getToken()).toBe("access-token");

    clearToken();

    expect(getToken()).toBeNull();
  });
});
