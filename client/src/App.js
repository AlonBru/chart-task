import './App.css';
import {useEffect, useState} from 'react'
import {Brush,Line,LineChart,XAxis,YAxis,CartesianGrid,Legend,Tooltip} from 'recharts'
import axios from 'axios'
import GraphSelector from './GraphSelector'

function App() {
  const [data,setData] =useState()
  const [selected,setSelected] = useState([
    {
      place:'Israel',
      color:'#ff0000'
    },
    {
      place:'Italy',
      color:'#00aa00'
    }
  ])

  const places  = data?Object.keys(data[3]).slice(1):null

  useEffect(()=>{
    axios.get('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv ')
    .then(({data:csv})=>{
      const countries = csv.split('\n')
      .map(dataBlock=>{
        const regex = /".*,.*"/
        //some data lines have names matching the regex (Namely Korea), this is to fix that.
        if(dataBlock.search(regex) !== -1){
          const problemWord = dataBlock.match(regex)[0]
          const fixedWord = problemWord.replace(',','-').replaceAll('"','')
          const fixedData = dataBlock.replace(regex,fixedWord)
          return fixedData.split(',')
        }else{
          return dataBlock.split(',')
        }
      })
      const titles = countries.shift(0)
      const dates = titles.slice(4).map((date,i)=>{
        const dateObject = {date:date}
        countries.forEach(country=>{
          if(dateObject[country[1]]){
            dateObject[country[1]] += Number(country[i+4])
          }else{
            dateObject[country[1]] = Number(country[i+4])
          }
        })
        return dateObject
      })
      console.log(dates)
      setData(dates)
    })
  },[])
 
  const addLine = () => {
    let addSelection = [...selected]
    addSelection.push({place:'Israel',color:'#ff0000'})
    console.log(addSelection)
    setSelected(addSelection)
  }

  const removeLine = (i) => {
    let removeSelection = [...selected]
    removeSelection.splice(i,1)
    setSelected(removeSelection)
  }

  const changeGraph = (newSetting,i) => {
    let newSelection = [...selected]
    newSelection[i] = newSetting
    setSelected(newSelection)

  }
  return (
    <div className="App">
    <button onClick={addLine} >+</button>
      {data
      ?<>
      { 
        selected.map((line,i)=>{
          return <GraphSelector 
          places={places}
          setGraph={changeGraph}
          removeLine={removeLine}
          index={i}
          current={selected[i]}
          />
        })
      }
      <LineChart width={700} height={700} data={data} 
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}> 
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis type="number"/>
        <Brush />
        <Tooltip />
        <Legend onClick={(e)=>console.log(e)} />
        {
         selected.map( ( { place, color } ) =>{
          return <Line 
          type="monotone" 
          dataKey={place} 
          stroke={color}
          key={place} />

         })

        }
      </LineChart>
      </>
      :null}
    </div>
  );
}

export default App;
