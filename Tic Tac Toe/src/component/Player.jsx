import { useState } from "react";
export default function Player({ initialName, symbol, isActive, onChangeName }) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  function handleEditClick() {
    //Immediately change isEditing, do not schedule -- guarantee that always work with latest avilable value
    setIsEditing(editing => !editing);
    //setIsEditing(editing => !editing);

    //Schedule setEditing for change
    //setIsEditing(!isEditing); //schedule the state to update true
    //setIsEditing(!isEditing); //schedule the state to update true
    if(isEditing){
      onChangeName(symbol, playerName);
    }
  }
  function handleChange(event){
    setPlayerName(event.target.value);
  }
  let editableplayerName = <span className="player-name">{playerName}</span>;
  //let buttonCaption = 'Edit';
  if (isEditing) {
    editableplayerName = <input type="text" required value={playerName} onChange={handleChange}/>;
    //buttonCaption = 'Save';
  }
  return (
    <li className={isActive ? 'active' : undefined}>
      <span className="player">
        {editableplayerName}
        <span className="payer-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}
