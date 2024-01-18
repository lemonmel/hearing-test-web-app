import { useState } from 'react'
import Statistics from './components/Statistics';
import Info from './components/Info';
import Sidebar from './components/Sidebar';

function App() {
  const [selectedNavItem, setSelectedNavItem] = useState('Statistic');

  return (
    <div className="App">
      <Sidebar setSelectedNavItem={setSelectedNavItem} />
      {selectedNavItem === 'Statistic' && <Statistics />}
      {selectedNavItem === 'Info' && <Info />}
    </div>
  )
}

export default App
