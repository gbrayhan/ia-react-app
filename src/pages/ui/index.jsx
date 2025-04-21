import ModernTable from './resources/ModernTable.jsx'
import ModernTreeTable from './resources/TreeTable.jsx'
import MedicationTable from './resources/DinamicMedicineTable.jsx'
import { useState } from 'react'

import RecurrentMedicationTable from './resources/RecurrentMedicineTable.jsx'

export default function UIPage () {

  const [medicines, setMedicines] = useState([])

  const [recurrentMedicines, setRecurrentMedicines] = useState([])
  return <div>
    <h1 className="font-bold uppercase text-3xl">UI Examples</h1>
    <p>These are some examples of UI components that you can use in your
      project.</p>

    <h2 className="font-bold mt-4 mb-4">Modern Table Example</h2>
    <ModernTable/>

    <h2 className=" font-bold mt-4 mb-4">Modern Tree Table Example</h2>
    <ModernTreeTable/>

    <h2 className="font-bold mt-4 mb-4">Dynamic Medication Table</h2>
    <MedicationTable medicines={medicines} setMedicines={setMedicines}/>


    <h2 className="font-bold mt-4 mb-4">Recurrent Medication Table</h2>
    <RecurrentMedicationTable medicines={recurrentMedicines}
                              setMedicines={setRecurrentMedicines}/>

  </div>
}