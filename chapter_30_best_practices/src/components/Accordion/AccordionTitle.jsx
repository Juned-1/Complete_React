import { Children } from "react";
import { useAccordionContext } from "./Accordion.jsx";
import { useAccordionItemContext } from "./AccordionItem.jsx";

export default function AccordionTitle({ className, children }) {
  const { id } = useAccordionItemContext();
  const { toggleItem } = useAccordionContext({ id, children });
  return (
    <h3 className={className} onClick={() => toggleItem(id)}>
      {children}
    </h3>
  );
}
