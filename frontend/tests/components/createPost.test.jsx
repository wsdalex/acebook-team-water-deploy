import { render, screen, fireEvent } from "@testing-library/react";
import { CreatePostForm } from "../../src/pages/CreatePost/CreatePostForm";
// import { createPost } from "../../src/services/posts";
import { describe, test, expect} from "vitest";
import { BrowserRouter } from "react-router-dom";

describe("CreatePostForm", () => {
    test("renders form elements and handles input", () => {
        render(
            <BrowserRouter>
                <CreatePostForm />
            </BrowserRouter>
        );

        // Check if the form elements are rendered
        const heading = screen.getByRole("heading", { name: /create post/i });
        expect(heading).toBeDefined(); // jest matcher that checks if a value is not undefined and that the element is in the DOM

        const messageInput = screen.getByLabelText(/message/i);
        expect(messageInput).toBeDefined();

        const submitButton = screen.getByRole("button", {
            name: /create post/i,
        });
        expect(submitButton).toBeDefined();

        // Test input handling
        fireEvent.change(messageInput, { target: { value: "Test message" } });
        expect(messageInput.value).toBe("Test message");
    });
});
