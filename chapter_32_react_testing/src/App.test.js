import { render, screen } from "@testing-library/react";
import App from "./App";
test('renders App test case', () => {
    render(<App />);
    const headerElement = screen.getByText('Hello Test!');
    expect(headerElement).toBeInTheDocument();
})