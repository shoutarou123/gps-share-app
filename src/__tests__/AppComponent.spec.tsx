import App from "../App";
import { render, screen } from "@testing-library/react";
import Home from "../compornents/home";

describe("title", () => {
  it("should render title", () => {
    render(<Home />);
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});