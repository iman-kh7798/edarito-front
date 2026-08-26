import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { AppRouter } from "./AppRouter";

describe("AppRouter", () => {
  it("renders the public login route", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Login" })
    ).toBeInTheDocument();
  });
});
