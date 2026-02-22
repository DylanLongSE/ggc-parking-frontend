import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

describe("CollapsibleSection", () => {
  it("renders title as a button", () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Content</p>
      </CollapsibleSection>
    );
    expect(screen.getByRole("button", { name: /test section/i })).toBeInTheDocument();
  });

  it("is collapsed by default", () => {
    render(
      <CollapsibleSection title="Test">
        <p>Hidden</p>
      </CollapsibleSection>
    );
    // Content is in the DOM but hidden via grid-rows-[0fr] + overflow-hidden
    const content = screen.getByText("Hidden");
    expect(content.closest(".overflow-hidden")?.parentElement).toHaveClass(
      "grid-rows-[0fr]"
    );
  });

  it("can be open by default", () => {
    render(
      <CollapsibleSection title="Test" defaultOpen>
        <p>Visible</p>
      </CollapsibleSection>
    );
    expect(
      screen.getByText("Visible").closest(".overflow-hidden")?.parentElement
    ).toHaveClass("grid-rows-[1fr]");
  });

  it("expands when clicked", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection title="Test">
        <p>Content</p>
      </CollapsibleSection>
    );

    await user.click(screen.getByRole("button", { name: /test/i }));
    expect(
      screen.getByText("Content").closest(".overflow-hidden")?.parentElement
    ).toHaveClass("grid-rows-[1fr]");
  });

  it("collapses when clicked again", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection title="Test" defaultOpen>
        <p>Content</p>
      </CollapsibleSection>
    );

    await user.click(screen.getByRole("button", { name: /test/i }));
    expect(
      screen.getByText("Content").closest(".overflow-hidden")?.parentElement
    ).toHaveClass("grid-rows-[0fr]");
  });

  it("rotates chevron when open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CollapsibleSection title="Test">
        <p>Content</p>
      </CollapsibleSection>
    );

    expect(container.querySelector(".rotate-180")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /test/i }));
    expect(container.querySelector(".rotate-180")).toBeInTheDocument();
  });
});
