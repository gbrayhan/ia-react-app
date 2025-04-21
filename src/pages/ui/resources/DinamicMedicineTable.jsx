import { useState } from 'react'
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ACESO_BACKEND_URL } from '../../../config.js'
import { useAuth } from '../../../contexts/UserContext.jsx'
import PropTypes from 'prop-types'

const timeUnits = [
  { key: 'horas', label: 'Hora/s' },
  { key: 'dias', label: 'Día/s' },
  { key: 'mes-30', label: 'Mes/es (30 días)' },
  { key: 'mes-calendario', label: 'Mes/es (calendario)' }]

const differenceInDays = (d1, d2) => (d2 - d1) / (1000 * 3600 * 24)

const addMonths = (date, months) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

const computeSufficiency = (med) => {
  const dosage = parseFloat(med.dosage)
  const frequency = parseFloat(med.frequencyQuantity)
  const durationVal = parseFloat(med.durationQuantity)
  const qty = parseFloat(med.quantity)
  if (isNaN(dosage) || isNaN(frequency) || isNaN(durationVal) || isNaN(qty)) {
    return {
      excedente: { cantidad: 0, unidad: med.unitType || '' },
      faltante: { cantidad: 0, unidad: med.unitType || '' },
      lastIntakeDate: med.applicationDate,
      lastPossibleFillDate: med.applicationDate,
    }
  }
  let doseIntervalDays = 0
  if (med.frecuencia_unidad === 'horas') {
    doseIntervalDays = frequency / 24
  } else if (med.frecuencia_unidad === 'dias') {
    doseIntervalDays = frequency
  } else if (med.frecuencia_unidad === 'mes-30') {
    doseIntervalDays = frequency * 30
  } else if (med.frecuencia_unidad === 'mes-calendario') {
    doseIntervalDays = differenceInDays(new Date(med.applicationDate),
      addMonths(new Date(med.applicationDate), frequency))
  }
  let durationInDays = 0
  if (med.durationUnit === 'horas') {
    durationInDays = durationVal / 24
  } else if (med.durationUnit === 'dias') {
    durationInDays = durationVal
  } else if (med.durationUnit === 'mes-30') {
    durationInDays = durationVal * 30
  } else if (med.durationUnit === 'mes-calendario') {
    durationInDays = differenceInDays(new Date(med.applicationDate),
      addMonths(new Date(med.applicationDate), durationVal))
  }
  const totalDoses = durationInDays / doseIntervalDays
  const requiredAmount = dosage * totalDoses
  const packagingAmount = parseFloat(med.unitQuantity) || 0
  const suppliedAmount = qty * packagingAmount
  const epsilon = 0.001
  const diff = suppliedAmount - requiredAmount
  let excedente = 0
  let faltante = 0
  if (diff > epsilon) {
    excedente = diff
  } else if (diff < -epsilon) {
    faltante = Math.abs(diff)
  }
  if (med.unitType && med.unitType.toLowerCase().includes('tabletas')) {
    excedente = Math.round(excedente)
    faltante = Math.round(faltante)
  } else {
    excedente = parseFloat(excedente.toFixed(2))
    faltante = parseFloat(faltante.toFixed(2))
  }
  const numberOfDosesSupplied = suppliedAmount / dosage
  const lastIntakeDate = new Date(med.applicationDate)
  lastIntakeDate.setDate(
    lastIntakeDate.getDate() + (numberOfDosesSupplied - 1) * doseIntervalDays)
  const lastPossibleFillDate = new Date(med.applicationDate)
  lastPossibleFillDate.setDate(
    lastPossibleFillDate.getDate() + numberOfDosesSupplied * doseIntervalDays)
  return {
    excedente: { cantidad: excedente, unidad: med.unitType || '' },
    faltante: { cantidad: faltante, unidad: med.unitType || '' },
    lastIntakeDate,
    lastPossibleFillDate,
  }
}

const getDosisUnidadOptions = (type) => {
  const mapping = {
    inyectable: [
      { key: 'ml', label: 'mililitros' },
      { key: 'ui', label: 'unidades internacionales' }],
    tableta: [
      { key: 'tabletas', label: 'tableta/s' }],
    capsula: [
      { key: 'capsulas', label: 'capsula/s' }],
    parche: [
      { key: 'parches', label: 'parche/s' }],
    topico: [
      { key: 'mg', label: 'miligramos' }, { key: 'g', label: 'gramos' }],
    gota: [
      { key: 'gotas', label: 'gota/s' }],
  }
  if (type && mapping[type.toLowerCase()]) {
    return mapping[type.toLowerCase()]
  }
  const allOptions = new Set()
  Object.values(mapping).
    forEach(arr => arr.forEach(item => allOptions.add(JSON.stringify(item))))
  return Array.from(allOptions).map(item => JSON.parse(item))
}

const initialMedicineData = {
  medicineId: '',
  description: '',
  salePrice: '',
  quantity: '',
  dosage: '',
  dosis_unidad: '',
  coldChain: false,
  isControlled: false,
  pmp: '',
  type: '',
  frequencyQuantity: '',
  frecuencia_unidad: '',
  durationQuantity: '',
  durationUnit: 'días',
  applicationDate: new Date(),
  applicationLocation: '',
  applicationPerson: '',
  notes: '',
  unitQuantity: '',
  unitType: '',
  shortage: null,
  excess: null,
  lastIntakeDate: new Date(),
  lastPossibleFillDate: new Date(),
}

const MedicationTable = ({ medicines, setMedicines }) => {
  const { state: authState } = useAuth()
  const accessToken = authState.accessToken
  const [selectedMedicines, setSelectedMedicines] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentMedicine, setCurrentMedicine] = useState(null)
  const [editIndex, setEditIndex] = useState(-1)
  const [medicineOptions, setMedicineOptions] = useState([])
  const [medicineInputValue, setMedicineInputValue] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  const showToast = (message, severity) => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleOpenModal = (medicine = null, index = -1) => {
    setCurrentMedicine(medicine || { ...initialMedicineData })
    setEditIndex(index)
    setOpenModal(true)
    setMedicineInputValue('')
    setMedicineOptions([])
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setCurrentMedicine(null)
    setEditIndex(-1)
  }

  const handleSaveMedicine = () => {
    const salePrice = parseFloat(currentMedicine.salePrice) || 0
    const quantity = parseFloat(currentMedicine.quantity) || 0
    const medicineCost = salePrice * quantity
    const sufficiency = computeSufficiency(currentMedicine)
    const medicineToSave = { ...currentMedicine, medicineCost, ...sufficiency }
    const newMedicines = [...medicines]
    if (editIndex === -1) {
      newMedicines.push(medicineToSave)
    } else {
      newMedicines[editIndex] = medicineToSave
    }
    setMedicines(newMedicines)
    handleCloseModal()
    showToast('Medicamento guardado', 'success')
  }

  const handleDeleteMedicines = () => {
    const newMedicines = medicines.filter(
      (_, index) => !selectedMedicines.includes(index))
    setMedicines(newMedicines)
    setSelectedMedicines([])
    showToast('Medicamento(s) eliminado(s)', 'success')
  }

  const handleMedicineChange = (field, value) => {
    setCurrentMedicine({ ...currentMedicine, [field]: value })
  }

  const handleSelectMedicine = (event, index) => {
    const selectedIndex = selectedMedicines.indexOf(index)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedMedicines, index)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedMedicines.slice(1))
    } else if (selectedIndex === selectedMedicines.length - 1) {
      newSelected = newSelected.concat(selectedMedicines.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedMedicines.slice(0, selectedIndex),
        selectedMedicines.slice(selectedIndex + 1))
    }
    setSelectedMedicines(newSelected)
  }

  const totalCost = medicines.reduce(
    (acc, med) => acc + (parseFloat(med.medicineCost) || 0), 0)

  return (<>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Button variant="text" color="primary"
                    onClick={() => handleOpenModal()} className="text-sm mr-2">
              Agregar
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => handleOpenModal(medicines[selectedMedicines[0]],
                selectedMedicines[0])}
              disabled={selectedMedicines.length !== 1}
              className="text-sm mr-2"
            >
              Editar
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={handleDeleteMedicines}
              disabled={selectedMedicines.length === 0}
              className="text-sm"
            >
              Eliminar
            </Button>
          </div>
          <div>
            <Typography variant="subtitle1" className="text-right">
              Total Costo de la Receta: {totalCost.toFixed(2)}
            </Typography>
          </div>
        </div>
        <TableContainer component={Paper}
                        className="max-h-[calc(100vh-400px)] overflow-y-auto">
          <Table stickyHeader aria-label="tabla de medicamentos">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedMedicines.length > 0 &&
                      selectedMedicines.length < medicines.length}
                    checked={medicines.length > 0 &&
                      selectedMedicines.length === medicines.length}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedMedicines(medicines.map((_, index) => index))
                      } else {
                        setSelectedMedicines([])
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Medicamento</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Red Fría</TableCell>
                <TableCell>Controlado</TableCell>
                <TableCell>PMP</TableCell>
                <TableCell>Precio de Venta</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Costo Medicamentos</TableCell>
                <TableCell>Excedente</TableCell>
                <TableCell>Faltante</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Dosis</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Frecuencia</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Duración</TableCell>
                <TableCell>Fecha de Aplicación</TableCell>
                <TableCell>Fecha Última Ingesta</TableCell>
                <TableCell>Fecha Último Posible Surtido</TableCell>
                <TableCell>Lugar de Aplicación</TableCell>
                <TableCell>Persona que Aplica</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((medicine, index) => {
                const {
                  excedente,
                  faltante,
                  lastIntakeDate,
                  lastPossibleFillDate,
                } = computeSufficiency(medicine)
                return (<TableRow
                    key={index}
                    selected={selectedMedicines.indexOf(index) !== -1}
                    onClick={(event) => handleSelectMedicine(event, index)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedMedicines.indexOf(index) !== -1}/>
                    </TableCell>
                    <TableCell>{medicine.description ||
                      medicine.medicineId}</TableCell>
                    <TableCell>{medicine.type}</TableCell>
                    <TableCell>{medicine.coldChain ? 'Si' : 'No'}</TableCell>
                    <TableCell>{medicine.isControlled ? 'Si' : 'No'}</TableCell>
                    <TableCell>{medicine.pmp}</TableCell>
                    <TableCell>{medicine.salePrice}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>{medicine.medicineCost}</TableCell>
                    <TableCell>
                      {excedente.cantidad !== 0
                        ? `${excedente.cantidad} ${excedente.unidad}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {faltante.cantidad !== 0
                        ? `${faltante.cantidad} ${faltante.unidad}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {medicine.dosage} {medicine.dosis_unidad}
                    </TableCell>
                    <TableCell>{`${medicine.frequencyQuantity} ${medicine.frecuencia_unidad}`}</TableCell>
                    <TableCell>{`${medicine.durationQuantity} ${medicine.durationUnit}`}</TableCell>
                    <TableCell>
                      {medicine.applicationDate ? new Date(
                        medicine.applicationDate).toLocaleDateString() : ''}
                    </TableCell>
                    <TableCell>
                      {lastIntakeDate ? new Date(
                        lastIntakeDate).toLocaleDateString() : ''}
                    </TableCell>
                    <TableCell>
                      {lastPossibleFillDate ? new Date(
                        lastPossibleFillDate).toLocaleDateString() : ''}
                    </TableCell>
                    <TableCell>{medicine.applicationLocation}</TableCell>
                    <TableCell>{medicine.applicationPerson}</TableCell>
                  </TableRow>)
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md"
              fullWidth>
        <DialogTitle>
          {editIndex === -1 ? 'Agregar Medicamento' : 'Editar Medicamento'}
        </DialogTitle>
        <DialogContent>
          {currentMedicine && currentMedicine.quantity &&
            currentMedicine.dosage && currentMedicine.frequencyQuantity &&
            currentMedicine.frecuencia_unidad &&
            currentMedicine.durationQuantity && currentMedicine.durationUnit &&
            currentMedicine.type && currentMedicine.unitQuantity &&
            currentMedicine.unitType && (() => {
              const dosage = parseFloat(currentMedicine.dosage)
              const frequency = parseFloat(currentMedicine.frequencyQuantity)
              const durationVal = parseFloat(currentMedicine.durationQuantity)
              const qty = parseFloat(currentMedicine.quantity)
              if (isNaN(dosage) || isNaN(frequency) || isNaN(durationVal) ||
                isNaN(qty)) {
                return null
              }
              let doseIntervalDays = 0
              if (currentMedicine.frecuencia_unidad === 'horas') {
                doseIntervalDays = frequency / 24
              } else if (currentMedicine.frecuencia_unidad === 'dias') {
                doseIntervalDays = frequency
              } else if (currentMedicine.frecuencia_unidad === 'mes-30') {
                doseIntervalDays = frequency * 30
              } else if (currentMedicine.frecuencia_unidad ===
                'mes-calendario') {
                doseIntervalDays = differenceInDays(
                  new Date(currentMedicine.applicationDate),
                  addMonths(new Date(currentMedicine.applicationDate),
                    frequency))
              }
              let durationInDays = 0
              if (currentMedicine.durationUnit === 'horas') {
                durationInDays = durationVal / 24
              } else if (currentMedicine.durationUnit === 'dias') {
                durationInDays = durationVal
              } else if (currentMedicine.durationUnit === 'mes-30') {
                durationInDays = durationVal * 30
              } else if (currentMedicine.durationUnit === 'mes-calendario') {
                durationInDays = differenceInDays(
                  new Date(currentMedicine.applicationDate),
                  addMonths(new Date(currentMedicine.applicationDate),
                    durationVal))
              }
              const totalDoses = durationInDays / doseIntervalDays
              const requiredAmount = dosage * totalDoses
              const packagingAmount = parseFloat(
                currentMedicine.unitQuantity) || 0
              const suppliedAmount = qty * packagingAmount
              const epsilon = 0.001
              const diffValue = suppliedAmount - requiredAmount
              let color = ''
              let message = ''
              let extraMessage = ''
              if (Math.abs(diffValue) < epsilon) {
                color = '#10B981'
                message = `La cantidad es exacta para el tratamiento de ${durationInDays} días`
              } else if (diffValue > 0) {
                color = '#FFA500'
                message = `La cantidad suministrada es mayor a la requerida. El tratamiento es para ${durationInDays} días`
                const formattedDiff = currentMedicine.unitType.toLowerCase().
                  includes('tableta')
                  ? Math.round(diffValue)
                  : diffValue.toFixed(2)
                extraMessage = `Excedente: ${formattedDiff} ${currentMedicine.unitType}`
              } else {
                color = '#FFA500'
                message = `La cantidad suministrada es menor a la requerida. El tratamiento es para ${durationInDays} días`
                const formattedDiff = currentMedicine.unitType.toLowerCase().
                  includes('tableta')
                  ? Math.round(Math.abs(diffValue))
                  : Math.abs(diffValue).toFixed(2)
                extraMessage = `Faltante: ${formattedDiff} ${currentMedicine.unitType}`
              }
              const numberOfDosesSupplied = suppliedAmount / dosage
              const lastDoseDate = new Date(currentMedicine.applicationDate)
              lastDoseDate.setDate(
                lastDoseDate.getDate() + (numberOfDosesSupplied - 1) *
                doseIntervalDays)
              const lastSupplyDate = new Date(currentMedicine.applicationDate)
              lastSupplyDate.setDate(
                lastSupplyDate.getDate() + numberOfDosesSupplied *
                doseIntervalDays)
              return (<Typography
                  variant="subtitle1"
                  style={{
                    backgroundColor: color,
                    color: '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                  }}
                >
                  {message}
                  {extraMessage && (<>
                      <br/>
                      {extraMessage}
                    </>)}
                  <br/>
                  Última fecha de toma: {lastDoseDate.toLocaleDateString()}
                  <br/>
                  Último día posible de
                  surtido: {lastSupplyDate.toLocaleDateString()}
                </Typography>)
            })()}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Autocomplete
              value={currentMedicine?.medicineId ? currentMedicine : null}
              onChange={(event, newValue) => {
                if (newValue) {
                  setCurrentMedicine({
                    ...currentMedicine,
                    medicineId: newValue.id,
                    description: newValue.description,
                    coldChain: newValue.coldChain,
                    isControlled: newValue.isControlled,
                    pmp: newValue.msrp,
                    salePrice: newValue.salePrice,
                    type: newValue.type,
                    unitQuantity: newValue.unitQuantity,
                    unitType: newValue.unitType,
                  })
                }
              }}
              inputValue={medicineInputValue}
              onInputChange={(event, newInputValue) => {
                setMedicineInputValue(newInputValue)
                if (newInputValue.length >= 3 && accessToken) {
                  fetch(
                    `${ACESO_BACKEND_URL}/api/medicines/search-paginated?page=1&limit=8&description_like=${newInputValue}`,
                    {
                      headers: { Authorization: `Bearer ${accessToken}` },
                    }).then(response => response.json()).then(data => {
                    if (data && data.medicines) setMedicineOptions(
                      data.medicines)
                  }).catch(err => console.error(err))
                }
              }}
              options={medicineOptions}
              getOptionLabel={(option) => option.description || ''}
              renderInput={(params) => (
                <TextField {...params} label="Medicamento" variant="outlined"
                           size="small" fullWidth/>)}
              fullWidth
            />
            <div>
              <Typography variant="caption" display="block">
                Tipo de Medicamento
              </Typography>
              <Typography variant="body1">{currentMedicine?.type ||
                '-'}</Typography>
            </div>
            <TextField
              label="Cantidad"
              value={currentMedicine?.quantity || ''}
              onChange={(e) => handleMedicineChange('quantity', e.target.value)}
              size="small"
              fullWidth
              type="number"
            />
            <TextField
              label="Precio de Venta"
              value={currentMedicine?.salePrice || ''}
              onChange={(e) => handleMedicineChange('salePrice',
                e.target.value)}
              size="small"
              fullWidth
              type="number"
            />
            <div className="flex gap-2">
              <TextField
                label="Dosis"
                value={currentMedicine?.dosage || ''}
                onChange={(e) => handleMedicineChange('dosage', e.target.value)}
                size="small"
                fullWidth
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Unidad</InputLabel>
                <Select
                  value={currentMedicine?.dosis_unidad || ''}
                  onChange={(e) => handleMedicineChange('dosis_unidad',
                    e.target.value)}
                  label="Unidad"
                >
                  {getDosisUnidadOptions(currentMedicine?.type).
                    map((option) => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.label}
                      </MenuItem>))}
                </Select>
              </FormControl>
            </div>
            <div className="flex gap-2">
              <TextField
                label="Frecuencia"
                value={currentMedicine?.frequencyQuantity || ''}
                onChange={(e) => handleMedicineChange('frequencyQuantity',
                  e.target.value)}
                size="small"
                type="number"
                fullWidth
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Unidad</InputLabel>
                <Select
                  value={currentMedicine?.frecuencia_unidad || ''}
                  onChange={(e) => handleMedicineChange('frecuencia_unidad',
                    e.target.value)}
                  label="Unidad"
                >
                  {timeUnits.map(
                    (unit) => (<MenuItem key={unit.key} value={unit.key}>
                        {unit.label}
                      </MenuItem>))}
                </Select>
              </FormControl>
            </div>
            <div className="flex gap-2">
              <TextField
                label="Duración"
                value={currentMedicine?.durationQuantity || ''}
                onChange={(e) => handleMedicineChange('durationQuantity',
                  e.target.value)}
                size="small"
                type="number"
                fullWidth
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Unidad</InputLabel>
                <Select
                  value={currentMedicine?.durationUnit || ''}
                  onChange={(e) => handleMedicineChange('durationUnit',
                    e.target.value)}
                  label="Unidad"
                >
                  {timeUnits.map(
                    (unit) => (<MenuItem key={unit.key} value={unit.key}>
                        {unit.label}
                      </MenuItem>))}
                </Select>
              </FormControl>
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha de Aplicación"
                value={currentMedicine?.applicationDate || null}
                onChange={(date) => handleMedicineChange('applicationDate',
                  date)}
                renderInput={(params) => <TextField {...params} size="small"
                                                    fullWidth/>}
                inputFormat="dd/MM/yyyy"
              />
            </LocalizationProvider>
            {currentMedicine?.type && currentMedicine.type.toLowerCase() ===
              'inyectable' && (<>
                  <FormControl fullWidth size="small">
                    <InputLabel>Lugar de Aplicación</InputLabel>
                    <Select
                      value={currentMedicine?.applicationLocation || ''}
                      onChange={(e) => handleMedicineChange(
                        'applicationLocation', e.target.value)}
                      label="Lugar de Aplicación"
                    >
                      <MenuItem value="consultorio">Consultorio</MenuItem>
                      <MenuItem value="clinica">Clínica</MenuItem>
                      <MenuItem value="hospital">Hospital</MenuItem>
                      <MenuItem value="domicilio">Domicilio</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Persona que Aplica</InputLabel>
                    <Select
                      value={currentMedicine?.applicationPerson || ''}
                      onChange={(e) => handleMedicineChange('applicationPerson',
                        e.target.value)}
                      label="Persona que Aplica"
                    >
                      <MenuItem value="doctor">Doctor/a</MenuItem>
                      <MenuItem value="enfermero">Enfermero/a</MenuItem>
                      <MenuItem value="conocido">Conocido/a</MenuItem>
                    </Select>
                  </FormControl>
                </>)}
            <TextField
              label="Notas"
              value={currentMedicine?.notes || ''}
              onChange={(e) => handleMedicineChange('notes', e.target.value)}
              size="small"
              fullWidth
              multiline
              rows={2}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSaveMedicine} variant="contained"
                  color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity}
               sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>)
}

MedicationTable.propTypes = {
  medicines: PropTypes.array, setMedicines: PropTypes.func,
}

export default MedicationTable
