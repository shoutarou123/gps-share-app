import App from "../App";
import { render, screen } from "@testing-library/react";
import Home from "../compornents/home";
import { BrowserRouter } from "react-router";

describe("title", () => {
  it("should render title", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    expect(screen.getByText("災害時部隊管理システム")).toBeInTheDocument();
  });
});
