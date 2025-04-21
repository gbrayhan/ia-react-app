import {useEffect, useRef, useState} from "react";
import {
    Alert,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Popper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {FiArrowRight, FiCheck, FiColumns, FiEye, FiFilter, FiMoreHorizontal, FiSearch, FiX,} from "react-icons/fi";
import PropTypes from "prop-types";

const columns = [{id: "checkbox", label: "", minWidth: 50}, {id: "name", label: "Name", minWidth: 170}, {
    id: "code", label: "ISO Code", minWidth: 100
}, {
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
}, {
    id: "size", label: "Size (km²)", minWidth: 170, align: "right", format: (value) => value.toLocaleString("en-US"),
}, {
    id: "density", label: "Density", minWidth: 170, align: "right", format: (value) => value.toFixed(2),
},];

function createData(id, name, code, population, size) {
    const density = population / size;
    return {id, name, code, population, size, density};
}

const rows = [createData(1, "India", "IN", 1324171354, 3287263), createData(2, "China", "CN", 1403500365, 9596961), createData(3, "Italy", "IT", 60483973, 301340), createData(4, "United States", "US", 327167434, 9833517), createData(5, "Canada", "CA", 37602103, 9984670), createData(6, "Australia", "AU", 25475400, 7692024), createData(7, "Germany", "DE", 83019200, 357578), createData(8, "Ireland", "IE", 4857000, 70273), createData(9, "Mexico", "MX", 126577691, 1972550), createData(10, "Japan", "JP", 126317000, 377973),];

const CustomSearchSelect = ({options, value, onChange, label, placeholder}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef(null);
    const popperRef = useRef(null);
    const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };
    const handleDocumentClick = (event) => {
        if (anchorRef.current && !anchorRef.current.contains(event.target) && popperRef.current && !popperRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleDocumentClick);
        return () => document.removeEventListener("mousedown", handleDocumentClick);
    }, []);
    const handleOptionClick = (event, option) => {
        event.preventDefault();
        event.stopPropagation();
        onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
    };
    const handleRemoveChip = (optionToRemove) => {
        onChange(value.filter((item) => item !== optionToRemove));
    };
    return (<div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div
            ref={anchorRef}
            onClick={handleToggle}
            className="min-h-[45px] border border-gray-300 rounded-md p-2 flex flex-wrap items-center gap-1 cursor-pointer"
        >
            {value.length === 0 ? (<span className="text-gray-400">{placeholder}</span>) : (value.map((val) => (
                <Chip key={val} label={val} onDelete={() => handleRemoveChip(val)} deleteIcon={<FiX/>}
                      size="small"/>)))}
        </div>
        <Popper
            open={isOpen}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            className="z-[1300]"
            style={{width: anchorRef.current ? anchorRef.current.clientWidth : "auto"}}
        >
            <Paper ref={popperRef} className="p-2 max-h-[300px] overflow-auto">
                <TextField
                    autoFocus
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{startAdornment: <FiSearch className="mr-2 text-gray-400"/>}}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {borderColor: "gray"},
                            "&:hover fieldset": {borderColor: "gray"},
                            "&.Mui-focused fieldset": {borderColor: "gray"},
                        },
                    }}
                />
                <div className="mt-2">
                    {filteredOptions.length === 0 ? (<Typography variant="body2" className="text-gray-500 p-2">
                        No options found
                    </Typography>) : (filteredOptions.map((option) => (
                        <MenuItem key={option} onClick={(event) => handleOptionClick(event, option)}
                                  className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                                <Checkbox checked={value.includes(option)} color="primary" size="small"
                                          sx={{transform: "scale(0.75)"}}/>
                                <ListItemText primary={option}/>
                            </div>
                            {value.includes(option) && <FiCheck className="text-primary"/>}
                        </MenuItem>)))}
                </div>
            </Paper>
        </Popper>
    </div>);
};

CustomSearchSelect.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default function ModernTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [columnsAnchorEl, setColumnsAnchorEl] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(columns.map((col) => col.id));
    const [nameFilter, setNameFilter] = useState([]);
    const [codeFilter, setCodeFilter] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openMoveModal, setOpenMoveModal] = useState(false);
    const [openMoreModal, setOpenMoreModal] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };
    const handleColumnsClick = (event) => {
        setColumnsAnchorEl(event.currentTarget);
    };
    const handleColumnsClose = () => {
        setColumnsAnchorEl(null);
    };
    const toggleColumnVisibility = (columnId) => {
        setVisibleColumns((prev) => prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]);
    };
    const handleClick = (event, id) => {
        setSelected(id === selected ? null : id);
    };
    const isSelected = (id) => selected === id;
    const filteredRows = rows.filter((row) => (searchTerm === "" || Object.values(row).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))) && (nameFilter.length === 0 || nameFilter.includes(row.name)) && (codeFilter.length === 0 || codeFilter.includes(row.code)));
    const buttonSx = {
        minHeight: "24px",
        padding: "0.2rem 0.5rem",
        fontSize: "0.75rem",
        borderColor: "info.main",
        color: "info.main",
        "&:hover": {backgroundColor: "info.main", color: "info.contrastText"},
    };
    const showToast = (message, severity) => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };
    const handleCloseToast = () => {
        setToastOpen(false);
    };
    const handleView = () => {
        if (!selected) {
            showToast("Primero selecciona un registro", "warning");
            return;
        }
        setOpenViewModal(true);
    };
    const handleMove = () => {
        if (!selected) {
            showToast("Primero selecciona un registro", "warning");
            return;
        }
        setOpenMoveModal(true);
    };
    const handleMore = () => {
        if (!selected) {
            showToast("Primero selecciona un registro", "warning");
            return;
        }
        setOpenMoreModal(true);
    };

    return (<Paper className="p-4">
        <div className="flex justify-between items-center mb-4">
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{startAdornment: <FiSearch className="mr-2"/>}}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {borderColor: "gray"},
                        "&:hover fieldset": {borderColor: "gray"},
                        "&.Mui-focused fieldset": {borderColor: "gray"},
                    },
                }}
            />
            <div className="flex gap-2">
                <Button variant="outlined" startIcon={<FiEye/>} size="small" sx={buttonSx} onClick={handleView}>
                    View
                </Button>
                <Button variant="outlined" startIcon={<FiArrowRight/>} size="small" sx={buttonSx}
                        onClick={handleMove}>
                    Move
                </Button>
                <Button variant="outlined" startIcon={<FiMoreHorizontal/>} size="small" sx={buttonSx}
                        onClick={handleMore}>
                    More
                </Button>
                <IconButton size="small" onClick={handleColumnsClick} sx={{padding: "0.2rem"}}>
                    <FiColumns/>
                </IconButton>
                <IconButton size="small" onClick={handleFilterClick} sx={{padding: "0.2rem"}}>
                    <FiFilter/>
                </IconButton>
            </div>
        </div>
        <TableContainer>
            <Table stickyHeader size="small" aria-label="sticky table"
                   sx={{"& .MuiTableCell-root": {padding: "0.6rem"}}}>
                <TableHead>
                    <TableRow>
                        {visibleColumns.includes("checkbox") && <TableCell padding="checkbox"/>}
                        {columns.map((column) => column.id !== "checkbox" && visibleColumns.includes(column.id) && (
                            <TableCell key={column.id} align={column.align} style={{minWidth: column.minWidth}}>
                                {column.label}
                            </TableCell>))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const isItemSelected = isSelected(row.id);
                        return (<TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                        >
                            {visibleColumns.includes("checkbox") && (<TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{"aria-labelledby": `enhanced-table-checkbox-${row.id}`}}
                                    sx={{transform: "scale(0.75)"}}
                                />
                            </TableCell>)}
                            {columns.map((column) => {
                                if (column.id === "checkbox") return null;
                                const value = row[column.id];
                                return (visibleColumns.includes(column.id) && (
                                    <TableCell key={column.id} align={column.align}>
                                        {column.format && typeof value === "number" ? column.format(value) : value}
                                    </TableCell>));
                            })}
                        </TableRow>);
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <div className="flex justify-between items-center mt-2 ml-5">
            <Typography variant="body2" className="text-gray-700">
                Total: {filteredRows.length}
            </Typography>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{width: "auto"}}
            />
        </div>
        <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{style: {maxHeight: 400, width: "320px"}}}
        >
            <MenuItem>
                <CustomSearchSelect
                    options={rows.map((row) => row.name)}
                    value={nameFilter}
                    onChange={setNameFilter}
                    label="Name"
                    placeholder="Search names..."
                />
            </MenuItem>
            <MenuItem>
                <CustomSearchSelect
                    options={rows.map((row) => row.code)}
                    value={codeFilter}
                    onChange={setCodeFilter}
                    label="ISO Code"
                    placeholder="Search codes..."
                />
            </MenuItem>
        </Menu>
        <Menu anchorEl={columnsAnchorEl} open={Boolean(columnsAnchorEl)} onClose={handleColumnsClose}>
            {columns
                .filter((column) => column.id !== "checkbox")
                .map((column) => (<MenuItem key={column.id} onClick={() => toggleColumnVisibility(column.id)}>
                    <Checkbox checked={visibleColumns.includes(column.id)} sx={{transform: "scale(0.75)"}}/>
                    <ListItemText primary={column.label}/>
                </MenuItem>))}
        </Menu>
        <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>View</DialogTitle>
            <DialogContent>
                <Typography>Contenido del modal de View</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenViewModal(false)} color="primary" size="small" sx={buttonSx}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={openMoveModal} onClose={() => setOpenMoveModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Move</DialogTitle>
            <DialogContent>
                <Typography>Contenido del modal de Move</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenMoveModal(false)} color="primary" size="small" sx={buttonSx}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={openMoreModal} onClose={() => setOpenMoreModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>More</DialogTitle>
            <DialogContent>
                <Typography>Contenido del modal de More</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenMoreModal(false)} color="primary" size="small" sx={buttonSx}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleCloseToast}
                  anchorOrigin={{vertical: "top", horizontal: "right"}}>
            <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{width: "100%"}}>
                {toastMessage}
            </Alert>
        </Snackbar>
    </Paper>);
}
