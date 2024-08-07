import { render, screen } from "@testing-library/react";
import { vi, expect, test, describe, beforeEach } from "vitest";
import GlobalNavBar from "../../src/components/Post/GlobalNavBar";
import "@testing-library/jest-dom";

describe("GlobalNavBar Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("renders the logo for all users", () => {
        render(<GlobalNavBar />);
        expect(screen.getByTestId("logo-link")).toBeInTheDocument();
    });

    test("does not render navigation icons when user is not logged in", () => {
        render(<GlobalNavBar />);
        expect(screen.queryByTestId("posts-link")).not.toBeInTheDocument();
        expect(screen.queryByTestId("profile-link")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("create-post-link")
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId("logout-link")).not.toBeInTheDocument();
    });

    test("renders navigation icons when user is logged in", () => {
        localStorage.setItem("token", "fake-token");
        render(<GlobalNavBar />);
        expect(screen.getByTestId("posts-link")).toBeInTheDocument();
        expect(screen.getByTestId("profile-link")).toBeInTheDocument();
        expect(screen.getByTestId("create-post-link")).toBeInTheDocument();
        expect(screen.getByTestId("logout-link")).toBeInTheDocument();
    });
});
