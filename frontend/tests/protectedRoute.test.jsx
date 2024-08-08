import { describe, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../src/App";

const MockLogin = () => <div>Login Page</div>;
const MockProtected = () => <div>Protected Page</div>;

const localStorageMock = (() => {
    let store = {}; // will be the in-memory storage for our mock
    return {
        getItem: vi.fn((key) => store[key] || null), // vi.fn() will act the same as localStorage.getItem() and takes the key and return the value
        setItem: vi.fn((key, value) => { // works like localStorage.setItem()
            store[key] = value.toString();
        }),
        clear: vi.fn(() => { // works like localStorage.clear()
            store = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", { // works like window.localStorage object
    value: localStorageMock,
});

describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("renders children routes when authenticated", () => {
        localStorage.setItem('token', 'fake-token');

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="protected" element={<MockProtected />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Protected Page")).toBeDefined();
    });

    test("redirects to login when not authenticated", () => {
        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route path="/login" element={<MockLogin />} />
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="protected" element={<MockProtected />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Login Page")).toBeDefined();
    });
});