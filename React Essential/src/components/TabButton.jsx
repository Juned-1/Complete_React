export default function TabButton({children, isSelected, ...props}) {
  //console.log("TAB BUTTON COMPONENET IS EXECUTED");
  return (
    <li>
        <button className={isSelected ? 'active' : undefined} {...props}>{children}</button>
    </li>
  )
}
