import { useContext, createContext, useState } from "react";
import AccordionItem from "./AccordionItem.jsx";
import AccordionTitle from "./AccordionTitle.jsx";
import AccordionContent from "./AccordionContent.jsx";

const AccordionContext = createContext({
  openItemId: null,
  toggleItem: () => {},
});

//creating custome hook so that user can use hook
export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  //this hook can be used in other component where react may not provide with Accodion component, to handle it we ave to check whether context exist or not
  if (!ctx) {
    throw new Error(
      "<Accordion related component must be wrapped by <Accordion>"
    );
  }
  return ctx;
}

export default function Accordion({ children, className }) {
  const [openItemId, setOpenItemId] = useState(null);
  const toggleItem = (id) => {
    setOpenItemId((prevId) => (id === prevId ? null : id));
  };
  const contextValue = {
    openItemId, //initally no item should be opened
    toggleItem
  };
  return (
    <AccordionContext.Provider value={contextValue}>
      <ul className={className}>{children}</ul>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
Accordion.Title = AccordionTitle;
Accordion.Content = AccordionContent;