import { useAccordionContext } from "./Accordion.jsx";
import { useAccordionItemContext } from "./AccordionItem.jsx";

export default function AccordionContent({ className, children }) {
  const { id } = useAccordionItemContext();
  const { openItemId } = useAccordionContext();
  const isOpen = id === openItemId;
  return (
    <div
      className={
        isOpen ? `${className ?? ""} open` : `${className ?? ""} close`
      }
    >
      {children}
    </div>
  );
}
