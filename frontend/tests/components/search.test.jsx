import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, expect, test, beforeEach } from "vitest";
import { act } from "react-dom/test-utils";
import Search from "../../src/components/Search/Search";
import { getPosts } from "../../src/services/posts";
import "@testing-library/jest-dom";

// Mock the getPosts service
vi.mock("../../src/services/posts", () => ({
    getPosts: vi.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("Search Component", () => {
    const mockToken = "testToken";
    const mockSampleImage = "test-image.jpg";
    const mockSetIsSearching = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Ensure getPosts returns a promise
        getPosts.mockResolvedValue({ posts: [], token: "newToken" });
    });

    test("renders search input", async () => {
        await act(async () => {
            render(
                <Search
                    navigate={mockNavigate}
                    token={mockToken}
                    sampleImage={mockSampleImage}
                    setIsSearching={mockSetIsSearching}
                />
            );
        });
        expect(
            screen.getByPlaceholderText("Search posts or users...")
        ).toBeInTheDocument();
    });

    test("filters posts based on search input", async () => {
        const mockPosts = [
            { _id: "1", message: "First post", user_id: { name: "User1" } },
            { _id: "2", message: "Second post", user_id: { name: "User2" } },
        ];
        getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

        await act(async () => {
            render(
                <Search
                    navigate={mockNavigate}
                    token={mockToken}
                    sampleImage={mockSampleImage}
                    setIsSearching={mockSetIsSearching}
                />
            );
        });

        const searchInput = screen.getByPlaceholderText(
            "Search posts or users..."
        );

        await act(async () => {
            fireEvent.change(searchInput, { target: { value: "First" } });
        });

        await waitFor(() => {
            expect(screen.getByText("First post")).toBeInTheDocument();
            expect(screen.queryByText("Second post")).not.toBeInTheDocument();
        });
    });

    test('displays "No matching posts found" when no results', async () => {
        const mockPosts = [
            { _id: "1", message: "First post", user_id: { name: "User1" } },
            { _id: "2", message: "Second post", user_id: { name: "User2" } },
        ];
        getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

        await act(async () => {
            render(
                <Search
                    navigate={mockNavigate}
                    token={mockToken}
                    sampleImage={mockSampleImage}
                    setIsSearching={mockSetIsSearching}
                />
            );
        });

        const searchInput = screen.getByPlaceholderText(
            "Search posts or users..."
        );

        await act(async () => {
            fireEvent.change(searchInput, {
                target: { value: "NonexistentPost" },
            });
        });

        await waitFor(() => {
            expect(
                screen.getByText("No matching posts found")
            ).toBeInTheDocument();
        });
    });

    test("calls setIsSearching with true when searching", async () => {
        await act(async () => {
            render(
                <Search
                    navigate={mockNavigate}
                    token={mockToken}
                    sampleImage={mockSampleImage}
                    setIsSearching={mockSetIsSearching}
                />
            );
        });

        const searchInput = screen.getByPlaceholderText(
            "Search posts or users..."
        );

        await act(async () => {
            fireEvent.change(searchInput, { target: { value: "Test" } });
        });

        expect(mockSetIsSearching).toHaveBeenCalledWith(true);
    });

    test("calls setIsSearching with false when search input is cleared", async () => {
        await act(async () => {
            render(
                <Search
                    navigate={mockNavigate}
                    token={mockToken}
                    sampleImage={mockSampleImage}
                    setIsSearching={mockSetIsSearching}
                />
            );
        });

        const searchInput = screen.getByPlaceholderText(
            "Search posts or users..."
        );

        await act(async () => {
            fireEvent.change(searchInput, { target: { value: "Test" } });
            fireEvent.change(searchInput, { target: { value: "" } });
        });

        expect(mockSetIsSearching).toHaveBeenCalledWith(false);
    });
});
