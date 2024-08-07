import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, expect, test, beforeEach } from "vitest";
import { act } from "react-dom/test-utils";
import Post from "../../src/components/Post/Post";
import { likePost } from "../../src/services/posts";
import "@testing-library/jest-dom";

// Mock the likePost service
vi.mock("../../src/services/posts", () => ({
    likePost: vi.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("Post Component Like Functionality", () => {
    const mockPost = {
        _id: "123",
        message: "Test post",
        user_id: { name: "Test User" },
        createdAt: new Date().toISOString(),
        numberOfLikes: 0,
        isLikedByUser: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem("token", "fake-token");
        // Ensure likePost returns a promise
        likePost.mockResolvedValue({ numberOfLikes: 1 });
    });

    test("renders the like button and initial like count", async () => {
        await act(async () => {
            render(<Post post={mockPost} />);
        });
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /0/i })).toBeInTheDocument();
    });

    test("updates like status and count when like button is clicked", async () => {
        await act(async () => {
            render(<Post post={mockPost} />);
        });

        const likeButton = screen.getByRole("button", { name: /0/i });

        await act(async () => {
            fireEvent.click(likeButton);
        });

        await waitFor(() => {
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /1/i })).toBeInTheDocument();
        });

        expect(likePost).toHaveBeenCalledWith("fake-token", "123");
    });

    test("handles error when liking a post fails", async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        likePost.mockRejectedValue(new Error("Failed to like post"));

        await act(async () => {
            render(<Post post={mockPost} />);
        });

        const likeButton = screen.getByRole("button", { name: /0/i });

        await act(async () => {
            fireEvent.click(likeButton);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
        });

        expect(screen.getByText("0")).toBeInTheDocument(); // Like count should not change
    });

    test("renders filled heart icon when post is liked by user", async () => {
        const likedPost = {
            ...mockPost,
            isLikedByUser: true,
            numberOfLikes: 1,
        };
        
        await act(async () => {
            render(<Post post={likedPost} />);
        });

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /1/i })).toBeInTheDocument();
        expect(screen.getByTestId("filled-heart-icon")).toBeInTheDocument();
    });
});