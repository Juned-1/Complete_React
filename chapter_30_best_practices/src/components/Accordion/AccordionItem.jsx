import { createContext, useContext } from "react";

const AccordionItemContext = createContext({
    id : null,
});

export function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      "Accordion-Item related component must be wrapped in <Accordion.Item>"
    );
  }
  return ctx;
}
export default function AccordionItem({ id, className, children }) {
  return (
    <AccordionItemContext.Provider value={{id}}>
      <li className={className}>{children}</li>
    </AccordionItemContext.Provider>
  );
}
