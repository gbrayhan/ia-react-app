import { useState } from 'react'
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import PropTypes from 'prop-types'
import { useAuth } from '../../../contexts/UserContext.jsx'
import { ACESO_BACKEND_URL } from '../../../config.js'

const initialMedicineData = {
  medicineId: '',
  description: '',
  dosageQuantity: '',
  dosageUnit: '',
  frequencyQuantity: '',
  frequencyUnit: '',
  durationQuantity: '',
  durationUnit: '',
  additionalNotes: '',
  startOfTreatment: '',
  endOfTreatment: '',
  isUndefinedEndTreatment: false,
  prescribingDoctor: '',
  authorizationNumber: '',
  medicalServiceDoctor: '',
  lastDispensedDate: '',
  nextDispenseDateTreatment: '',
  limitNextDispenseDateTreatment: '',
  dispenseDateScheduled: '',
  dispenseScheduledFrequencyQuantity: '',
  dispenseScheduledFrequencyUnit: '',
  actualQuantity: '',
  actualQuantityType: '',
}

const dosageUnitOptions = [
  { key: 'mg', label: 'mg' },
  { key: 'ml', label: 'ml' },
  { key: 'tabletas', label: 'tabletas' }]

const timeUnits = [
  { key: 'day', label: 'Día(s)' },
  { key: 'week', label: 'Semana(s)' },
  { key: 'month', label: 'Mes(es)' }]

const MedicationTable = ({ medicines, setMedicines }) => {
  const { state: authState } = useAuth()
  const accessToken = authState.accessToken
  const [selectedMedicines, setSelectedMedicines] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentMedicine, setCurrentMedicine] = useState(null)
  const [editIndex, setEditIndex] = useState(-1)
  const [medicineOptions, setMedicineOptions] = useState([])
  const [medicineInputValue, setMedicineInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  const showToast = (message, severity = 'success') => {
    setToastMessage(message)
    setToastSeverity(severity)
    setToastOpen(true)
  }

  const handleCloseToast = () => {
    setToastOpen(false)
  }

  const handleOpenModal = (medicine = null, index = -1) => {
    setCurrentMedicine(medicine ? { ...medicine } : { ...initialMedicineData })
    setEditIndex(index)
    setOpenModal(true)
    setMedicineInputValue('')
    setMedicineOptions([])
    setSelectedOption(null)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setCurrentMedicine(null)
    setEditIndex(-1)
  }

  const handleSaveMedicine = () => {
    const newMedicines = [...medicines]
    if (selectedOption) {
      currentMedicine.medicineId = selectedOption.id
      currentMedicine.description = selectedOption.description
    }
    if (editIndex === -1) {
      newMedicines.push(currentMedicine)
    } else {
      newMedicines[editIndex] = currentMedicine
    }
    setMedicines(newMedicines)
    showToast('Medicamento guardado')
    handleCloseModal()
  }

  const handleDeleteMedicines = () => {
    const newMedicines = medicines.filter(
      (_, index) => !selectedMedicines.includes(index))
    setMedicines(newMedicines)
    setSelectedMedicines([])
    showToast('Medicamento(s) eliminado(s)')
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

  return (<div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          variant="text"
          color="primary"
          onClick={() => handleOpenModal()}
          style={{ marginRight: '8px' }}
        >
          Agregar
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={() => handleOpenModal(medicines[selectedMedicines[0]],
            selectedMedicines[0])}
          disabled={selectedMedicines.length !== 1}
          style={{ marginRight: '8px' }}
        >
          Editar
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={handleDeleteMedicines}
          disabled={selectedMedicines.length === 0}
        >
          Eliminar
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedMedicines.length > 0 &&
                    selectedMedicines.length < medicines.length}
                  checked={medicines.length > 0 && selectedMedicines.length ===
                    medicines.length}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedMedicines(medicines.map((_, idx) => idx))
                    } else {
                      setSelectedMedicines([])
                    }
                  }}
                />
              </TableCell>
              <TableCell>Medicamento</TableCell>
              <TableCell>Dosis</TableCell>
              <TableCell>Frecuencia</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Inicio Tratamiento</TableCell>
              <TableCell>Fin Tratamiento</TableCell>
              <TableCell>Indefinido</TableCell>
              <TableCell>Doctor que Prescribe</TableCell>
              <TableCell>Número de Autorización</TableCell>
              <TableCell>Servicio Médico (Doctor)</TableCell>
              <TableCell>Última Fecha Dispensada</TableCell>
              <TableCell>Próxima Fecha Dispensado</TableCell>
              <TableCell>Límite Próxima Fecha Dispensado</TableCell>
              <TableCell>Fecha Programada Dispensado</TableCell>
              <TableCell>Frecuencia Programada</TableCell>
              <TableCell>Unidad Frecuencia Programada</TableCell>
              <TableCell>Cantidad Actual</TableCell>
              <TableCell>Tipo Cantidad Actual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((medicine, index) => (<TableRow
                key={index}
                selected={selectedMedicines.includes(index)}
                onClick={(event) => handleSelectMedicine(event, index)}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedMedicines.includes(index)}/>
                </TableCell>
                <TableCell>{medicine.description ||
                  `ID: ${medicine.medicineId}`}</TableCell>
                <TableCell>{medicine.dosageQuantity} {medicine.dosageUnit}</TableCell>
                <TableCell>{medicine.frequencyQuantity} {medicine.frequencyUnit}</TableCell>
                <TableCell>{medicine.durationQuantity} {medicine.durationUnit}</TableCell>
                <TableCell>{medicine.additionalNotes}</TableCell>
                <TableCell>{medicine.startOfTreatment}</TableCell>
                <TableCell>{medicine.endOfTreatment}</TableCell>
                <TableCell>{medicine.isUndefinedEndTreatment
                  ? 'Sí'
                  : 'No'}</TableCell>
                <TableCell>{medicine.prescribingDoctor}</TableCell>
                <TableCell>{medicine.authorizationNumber}</TableCell>
                <TableCell>{medicine.medicalServiceDoctor}</TableCell>
                <TableCell>{medicine.lastDispensedDate}</TableCell>
                <TableCell>{medicine.nextDispenseDateTreatment}</TableCell>
                <TableCell>{medicine.limitNextDispenseDateTreatment}</TableCell>
                <TableCell>{medicine.dispenseDateScheduled}</TableCell>
                <TableCell>{medicine.dispenseScheduledFrequencyQuantity}</TableCell>
                <TableCell>{medicine.dispenseScheduledFrequencyUnit}</TableCell>
                <TableCell>{medicine.actualQuantity}</TableCell>
                <TableCell>{medicine.actualQuantityType}</TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md"
              fullWidth>
        <DialogTitle>{editIndex === -1
          ? 'Agregar Medicamento'
          : 'Editar Medicamento'}</DialogTitle>
        <DialogContent>
          {currentMedicine && (<div className="grid grid-cols-2 gap-4 mt-4">
              <Autocomplete
                value={selectedOption}
                onChange={(event, newValue) => {
                  setSelectedOption(newValue)
                }}
                inputValue={medicineInputValue}
                onInputChange={(event, newInputValue) => {
                  setMedicineInputValue(newInputValue)
                  if (newInputValue.length >= 3 && accessToken) {
                    fetch(
                      `${ACESO_BACKEND_URL}/api/medicines/search-paginated?page=1&limit=8&description_like=${newInputValue}`,
                      {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }).then((res) => res.json()).then((data) => {
                      if (data && data.medicines) setMedicineOptions(
                        data.medicines)
                    }).catch((err) => console.error(err))
                  } else {
                    setMedicineOptions([])
                  }
                }}
                options={medicineOptions}
                getOptionLabel={(option) => option.description || ''}
                renderInput={(params) => (<TextField
                    {...params}
                    label="Medicamento"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />)}
                fullWidth
              />
              <TextField
                label="Notas Adicionales"
                value={currentMedicine.additionalNotes}
                onChange={(e) => handleMedicineChange('additionalNotes',
                  e.target.value)}
                size="small"
                fullWidth
                multiline
                rows={2}
              />
              <div className="flex gap-2">
                <TextField
                  label="Dosis"
                  value={currentMedicine.dosageQuantity}
                  onChange={(e) => handleMedicineChange('dosageQuantity',
                    e.target.value)}
                  size="small"
                  fullWidth
                  type="number"
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    value={currentMedicine.dosageUnit}
                    label="Unidad"
                    onChange={(e) => handleMedicineChange('dosageUnit',
                      e.target.value)}
                  >
                    {dosageUnitOptions.map((option) => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.label}
                      </MenuItem>))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-2">
                <TextField
                  label="Frecuencia"
                  value={currentMedicine.frequencyQuantity}
                  onChange={(e) => handleMedicineChange('frequencyQuantity',
                    e.target.value)}
                  size="small"
                  type="number"
                  fullWidth
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    value={currentMedicine.frequencyUnit}
                    label="Unidad"
                    onChange={(e) => handleMedicineChange('frequencyUnit',
                      e.target.value)}
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
                  value={currentMedicine.durationQuantity}
                  onChange={(e) => handleMedicineChange('durationQuantity',
                    e.target.value)}
                  size="small"
                  type="number"
                  fullWidth
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    value={currentMedicine.durationUnit}
                    label="Unidad"
                    onChange={(e) => handleMedicineChange('durationUnit',
                      e.target.value)}
                  >
                    {timeUnits.map(
                      (unit) => (<MenuItem key={unit.key} value={unit.key}>
                          {unit.label}
                        </MenuItem>))}
                  </Select>
                </FormControl>
              </div>
              <TextField
                label="Inicio de Tratamiento"
                type="date"
                value={currentMedicine.startOfTreatment}
                onChange={(e) => handleMedicineChange('startOfTreatment',
                  e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Fin de Tratamiento"
                type="date"
                value={currentMedicine.endOfTreatment}
                onChange={(e) => handleMedicineChange('endOfTreatment',
                  e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={currentMedicine.isUndefinedEndTreatment}
                  onChange={(e) => handleMedicineChange(
                    'isUndefinedEndTreatment', e.target.checked)}
                />
                <span>Fin de Tratamiento Indefinido</span>
              </div>
              <TextField
                label="Doctor que Prescribe"
                value={currentMedicine.prescribingDoctor}
                onChange={(e) => handleMedicineChange('prescribingDoctor',
                  e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Número de Autorización"
                value={currentMedicine.authorizationNumber}
                onChange={(e) => handleMedicineChange('authorizationNumber',
                  e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Servicio Médico (Doctor)"
                value={currentMedicine.medicalServiceDoctor}
                onChange={(e) => handleMedicineChange('medicalServiceDoctor',
                  e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Última Fecha Dispensada"
                type="date"
                value={currentMedicine.lastDispensedDate}
                onChange={(e) => handleMedicineChange('lastDispensedDate',
                  e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Próxima Fecha de Dispensado"
                type="date"
                value={currentMedicine.nextDispenseDateTreatment}
                onChange={(e) => handleMedicineChange(
                  'nextDispenseDateTreatment', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Límite Próxima Fecha de Dispensado"
                type="date"
                value={currentMedicine.limitNextDispenseDateTreatment}
                onChange={(e) => handleMedicineChange(
                  'limitNextDispenseDateTreatment', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Fecha Programada de Dispensado"
                type="date"
                value={currentMedicine.dispenseDateScheduled}
                onChange={(e) => handleMedicineChange('dispenseDateScheduled',
                  e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <div className="flex gap-2">
                <TextField
                  label="Frecuencia Programada"
                  value={currentMedicine.dispenseScheduledFrequencyQuantity}
                  onChange={(e) => handleMedicineChange(
                    'dispenseScheduledFrequencyQuantity', e.target.value)}
                  size="small"
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Unidad Frecuencia Programada"
                  value={currentMedicine.dispenseScheduledFrequencyUnit}
                  onChange={(e) => handleMedicineChange(
                    'dispenseScheduledFrequencyUnit', e.target.value)}
                  size="small"
                  fullWidth
                />
              </div>
              <div className="flex gap-2">
                <TextField
                  label="Cantidad Actual"
                  value={currentMedicine.actualQuantity}
                  onChange={(e) => handleMedicineChange('actualQuantity',
                    e.target.value)}
                  size="small"
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Tipo Cantidad Actual"
                  value={currentMedicine.actualQuantityType}
                  onChange={(e) => handleMedicineChange('actualQuantityType',
                    e.target.value)}
                  size="small"
                  fullWidth
                />
              </div>
            </div>)}
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
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>)
}

MedicationTable.propTypes = {
  medicines: PropTypes.array, setMedicines: PropTypes.func,
}

export default MedicationTable
