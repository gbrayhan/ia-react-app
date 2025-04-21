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
import {
    FiCheck,
    FiChevronDown,
    FiChevronRight,
    FiColumns,
    FiEye,
    FiFilter,
    FiMoreHorizontal,
    FiSearch,
    FiX,
} from "react-icons/fi";
import PropTypes from "prop-types";

const columns = [{id: "checkbox", label: "", minWidth: 50}, {id: "name", label: "Nombre", minWidth: 170}, {
    id: "rfc",
    label: "RFC",
    minWidth: 100
}, {id: "fiscalAddress", label: "Dirección", minWidth: 170}, {id: "tipo", label: "Tipo", minWidth: 100},];

const jsonResponse = [{
    id: 1,
    aliasName: "ACME",
    clientName: "ACME Inc Updated",
    rfc: "RFC123",
    fiscalAddress: "456 Main St",
    satCfdiUsage: "G01",
    satPaymentForm: "03",
    satPaymentMethod: "PUE",
    createdAt: "2025-02-10T14:04:36.069149-06:00",
    updatedAt: "2025-02-10T14:04:48.125217-06:00",
    isDeleted: 0,
    icdCatalog: "cie10",
    subClients: [{
        id: 1,
        clientId: 1,
        alias: "Subclient A",
        contractNumber: "C001",
        fiscalAddress: "789 Side St",
        createdAt: "2025-02-10T14:05:02.983761-06:00",
        updatedAt: "2025-02-10T14:05:02.983762-06:00",
        rfc: "RFC456",
        isDeleted: 0,
        legalName: "Subclient Legal",
        client: {
            id: 0,
            aliasName: "",
            clientName: "",
            rfc: "",
            fiscalAddress: "",
            satCfdiUsage: "",
            satPaymentForm: "",
            satPaymentMethod: "",
            createdAt: "0001-01-01T00:00:00Z",
            updatedAt: "0001-01-01T00:00:00Z",
            isDeleted: 0,
            icdCatalog: "",
        },
        programs: [{
            id: 1,
            subclientId: 1,
            name: "Program A",
            description: "Program description",
            createdAt: "2025-02-10T14:05:52.849364-06:00",
            updatedAt: "2025-02-10T14:05:52.849364-06:00",
            isDeleted: 0,
        },],
    },],
},];

const transformData = (data) => data.map((client) => ({
    id: `client-${client.id}`,
    name: client.clientName,
    rfc: client.rfc,
    fiscalAddress: client.fiscalAddress,
    tipo: "cliente",
    level: 0,
    children: client.subClients.map((sub) => ({
        id: `subclient-${sub.id}`,
        name: sub.alias,
        rfc: sub.rfc,
        fiscalAddress: sub.fiscalAddress,
        tipo: "subcliente",
        level: 1,
        children: sub.programs.map((program) => ({
            id: `program-${program.id}`,
            name: program.name,
            rfc: "",
            fiscalAddress: "",
            tipo: "programa",
            level: 2,
            children: [],
        })),
    })),
}));

export default function ModernTreeTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [columnsAnchorEl, setColumnsAnchorEl] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(columns.map((col) => col.id));
    const [nameFilter, setNameFilter] = useState([]);
    const [tipoFilter, setTipoFilter] = useState([]);
    const [selected, setSelected] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openMoveModal, setOpenMoveModal] = useState(false);
    const [openMoreModal, setOpenMoreModal] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");

    const buttonSx = {
        minHeight: "24px",
        padding: "0.2rem 0.5rem",
        fontSize: "0.75rem",
        borderColor: "info.main",
        color: "info.main",
        "&:hover": {backgroundColor: "info.main", color: "info.contrastText"},
    };

    const treeData = transformData(jsonResponse);
    const getVisibleRows = (nodes) => {
        let result = [];
        nodes.forEach((node) => {
            result.push(node);
            if (expandedNodes.includes(node.id) && node.children && node.children.length > 0) {
                result = result.concat(getVisibleRows(node.children));
            }
        });
        return result;
    };
    const visibleRows = getVisibleRows(treeData);
    const filteredRows = visibleRows.filter((row) => {
        const matchesSearch = searchTerm === "" || (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) || (row.rfc && row.rfc.toLowerCase().includes(searchTerm.toLowerCase())) || (row.fiscalAddress && row.fiscalAddress.toLowerCase().includes(searchTerm.toLowerCase())) || (row.tipo && row.tipo.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesNameFilter = nameFilter.length === 0 || nameFilter.includes(row.name);
        const matchesTipoFilter = tipoFilter.length === 0 || tipoFilter.includes(row.tipo);
        return matchesSearch && matchesNameFilter && matchesTipoFilter;
    });
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
    const toggleExpand = (id) => {
        setExpandedNodes((prev) => prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]);
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
    const handleCloseViewModal = () => {
        setOpenViewModal(false);
    };
    const handleCloseMoveModal = () => {
        setOpenMoveModal(false);
    };
    const handleCloseMoreModal = () => {
        setOpenMoreModal(false);
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
                    <Button variant="outlined" startIcon={<FiChevronRight/>} size="small" sx={buttonSx}
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
                <Table stickyHeader aria-label="tree table" size="small"
                       sx={{"& .MuiTableCell-root": {padding: "0.6rem"}}}>
                    <TableHead>
                        <TableRow>
                            {visibleColumns.includes("checkbox") && <TableCell padding="checkbox"/>}
                            {columns.map((column) => column.id !== "checkbox" && visibleColumns.includes(column.id) && (
                                <TableCell key={column.id} style={{minWidth: column.minWidth}}>
                                    {column.label}
                                </TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
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
                                            if (column.id === "name") {
                                                return (visibleColumns.includes(column.id) && (
                                                        <TableCell key={column.id}>
                                                            <div style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                paddingLeft: row.level * 20
                                                            }}>
                                                                {row.children && row.children.length > 0 && (<IconButton
                                                                        size="small"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleExpand(row.id);
                                                                        }}
                                                                        sx={{padding: "0.2rem"}}
                                                                    >
                                                                        {expandedNodes.includes(row.id) ?
                                                                            <FiChevronDown/> : <FiChevronRight/>}
                                                                    </IconButton>)}
                                                                {row.name}
                                                            </div>
                                                        </TableCell>));
                                            }
                                            return visibleColumns.includes(column.id) &&
                                                <TableCell key={column.id}>{value}</TableCell>;
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
                        options={[...new Set(visibleRows.map((row) => row.name))]}
                        value={nameFilter}
                        onChange={setNameFilter}
                        label="Nombre"
                        placeholder="Search names..."
                    />
                </MenuItem>
                <MenuItem>
                    <CustomSearchSelect
                        options={[...new Set(visibleRows.map((row) => row.tipo))]}
                        value={tipoFilter}
                        onChange={setTipoFilter}
                        label="Tipo"
                        placeholder="Search type..."
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
            <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="sm" fullWidth>
                <DialogTitle>Vista</DialogTitle>
                <DialogContent>
                    <Typography>Contenido del modal de vista</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseViewModal} color="primary" size="small"
                            sx={{minHeight: "24px", padding: "0.2rem 0.5rem", fontSize: "0.75rem"}}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openMoveModal} onClose={handleCloseMoveModal} maxWidth="sm" fullWidth>
                <DialogTitle>Mover</DialogTitle>
                <DialogContent>
                    <Typography>Contenido del modal de mover</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMoveModal} color="primary" size="small"
                            sx={{minHeight: "24px", padding: "0.2rem 0.5rem", fontSize: "0.75rem"}}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openMoreModal} onClose={handleCloseMoreModal} maxWidth="sm" fullWidth>
                <DialogTitle>Más Opciones</DialogTitle>
                <DialogContent>
                    <Typography>Contenido del modal de más opciones</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMoreModal} color="primary" size="small"
                            sx={{minHeight: "24px", padding: "0.2rem 0.5rem", fontSize: "0.75rem"}}>
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
