import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { QueryProvider } from "@/app/providers";

import { AppRouter } from "./AppRouter";

describe("AppRouter", () => {
  it("renders the public login route", () => {
    render(
      <QueryProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <AppRouter />
        </MemoryRouter>
      </QueryProvider>
    );

    expect(
      screen.getByRole("textbox", { name: "نام کاربری" })
    ).toBeInTheDocument();
  });
});
