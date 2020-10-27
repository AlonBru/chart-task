import './App.css';
import {useEffect, useState} from 'react'
import {Brush,Line,LineChart,XAxis,YAxis,CartesianGrid,Legend,Tooltip, Label} from 'recharts'
import axios from 'axios'
import GraphSelector from './GraphSelector'

function App() {
  const [data,setData] =useState()
  const [world,setWorld] =useState()
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
  const w =window.innerWidth-50
  const places  = data?Object.keys(data[3]).slice(1):null
  console.log('pla',places)
  useEffect(()=>{
    axios.get('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv ')
    .then(({data:csv})=>{
      const dataBlocks = csv.split('\n')
      dataBlocks.pop() // the last \n is in the array as an empty string
      const countries = dataBlocks
      .map((dataBlock,i)=>{
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
        let fixedDate = date.split('/')
        let month = fixedDate.shift()
        fixedDate.splice(1,0,month)
        const dateObject = {date:fixedDate.join('/')}
        i===2&&console.log(1,dateObject)
        countries.forEach(country=>{
          if(dateObject[country[1]]){
            dateObject[country[1]] += Number(country[i+4])
          }else{
            dateObject[country[1]] = Number(country[i+4])
          }
        })
        i===2&&console.log(2,dateObject)
        return dateObject
      })
      setData(dates)
      const worldData = dates.map((dateData=>{
        let {date} = dateData
        delete dateData.date
        const worldTotal = Object.keys(dateData)
        .map(country=>dateData[country])
        .reduce((acc,cur)=>acc+cur,0)
        return {date, worldTotal }
      }))
      setWorld(worldData)
    })
  },[])
 
  data&&console.log('data',data.map(d=>d.date))
  console.log('world',world)
  const addLine = () => {
    let addSelection = [...selected]
    addSelection.push({place:'Israel',color:'#ff0000'})
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
    <h2>Total Confirmed Patients per Country</h2>
    <button onClick={addLine} >add Country to graph</button>
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
      <LineChart width={w} height={700} data={data} 
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}> 
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis type="number"  />
        <Brush />
        <Tooltip />
        <Legend />
        {
         selected.map( ( { place, color } ) =>{
          return <Line 
          type="monotone" 
          dataKey={place} 
          stroke={color}
          dot={false}
          key={place} />

         })

        }
      </LineChart>
      <h2>Total Confirmed Patient Worldwide</h2>     
      <LineChart width={w} height={700} data={world} 
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}> 
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis  dataKey="date" />
        <YAxis type="number"/>
        <Brush />
        <Tooltip />
        <Legend 
          iconType='wye'
        />
        <Line 
        type="monotone" 
        dataKey='worldTotal'
        stroke='#d00'
        dot={false}
         />
      </LineChart>
      </> 
      :null}
    </div>
  );
}

export default App;
