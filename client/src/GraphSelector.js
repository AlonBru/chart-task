
function GraphSelector({
  places,
  setGraph,
  removeLine,
  current,
  index
}) {
  return (
    <div className="graph-selector" id={index}>
      <select onChange={({target:{value}}) => {
          setGraph({place:value,color:current.color},index)
          }
        }>
        {places.map(place => (
          <option 
          key={place}
          selected={place===current.place}
          value={place}>
            {place}
          </option>
        ))}
      </select>
      <input 
      type='color' 
      defaultValue={current.color} 
      onBlur={({target:{value}}) => {
          console.log(value)
          setGraph({place:current.place,color:value},index)
      }}/>

      <button onClick={()=>{removeLine(index)}}>X</button>
    </div>
  );
}

export default GraphSelector;
