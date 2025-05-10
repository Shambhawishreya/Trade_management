import React, { useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { mkConfig, generateCsv, download } from "export-to-csv";

// Import the new NavBar component
import TradeNavbar from "./TradeNavBar";

// Import icons
import GlobeIcon from "../assets/globe.svg";
import TradeIcon from "../assets/trade.svg";
import TradeIcon2 from "../assets/trade2.svg";
import TradeIcon3 from "../assets/trade3.svg";

const getCsvConfig = (filename) =>
  mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: filename,
  });

const AllTradeData = () => {
  const [trades, setTrades] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const baseBackgroundColor = isDarkMode
    ? "rgba(30, 41, 59)"
    : "rgba(255, 255, 255)";
  const menuItems = [
    {
      label: "Trade History",
      icon: TradeIcon,
      path: "/all",
    },
    {
      label: "Live Trades",
      icon: TradeIcon2,
      path: "/today",
    },
    {
      label: "Trade Register",
      icon: TradeIcon3,
      path: "/traderegister",
    },
  ];

  const handleMenuItemClick = (item) => {
    window.location.href = item.path;
  };
  const generateFilename = (table, exportType) => {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const columnFilters = table.getState().columnFilters;
    const globalFilter = table.getState().globalFilter;

    let filterText = "";

    if (globalFilter) {
      filterText += `_global-${globalFilter}`;
    }

    if (columnFilters.length > 0) {
      filterText += columnFilters
        .map((filter) => `_${filter.id}-${filter.value}`)
        .join("");
    }

    filterText = filterText
      .replace(/[^a-z0-9-_]/gi, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    return `trades_${date}${filterText}_${exportType}`;
  };

  const handleExportRows = (rows, table, exportType) => {
    const rowData = rows.map((row) => row.original);
    const filename = generateFilename(table, exportType);
    const csv = generateCsv(getCsvConfig(filename))(rowData);
    download(getCsvConfig(filename))(csv);
  };

  const handleExportData = (table) => {
    const filename = generateFilename(table, "all");
    const csv = generateCsv(getCsvConfig(filename))(trades);
    download(getCsvConfig(filename))(csv);
  };

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/trades/get-trades"
        );
        const data = await response.json();
        setTrades(data?.data || []);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    };

    fetchTrades();
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      size: 110,
    },
    {
      accessorKey: "ticker",
      header: "Ticker",
      size: 110,
    },
    {
      accessorKey: "open",
      header: "Open",
      size: 110,
      Cell: ({ cell }) => (
        <Box
          sx={{
            display: "inline-block",
            padding: "4px 8px",
            backgroundColor: "#87CEEB",
            color: "#0f172a",
            borderRadius: "12px",
            fontWeight: "bold",
          }}
        >
          {cell.getValue()}
        </Box>
      ),
    },
    {
      accessorKey: "high",
      header: "High",
      size: 110,
    },
    {
      accessorKey: "low",
      header: "Low",
      size: 110,
    },
    {
      accessorKey: "last",
      header: "Last",
      size: 110,
    },
    {
      accessorKey: "settle",
      header: "Settle",
      size: 110,
    },
    {
      accessorKey: "change",
      header: "Change",
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return (
          <Box
            sx={{
              display: "inline-block",
              padding: "4px 8px",
              backgroundColor: value > 0 ? "#4CAF50" : "#F44336",
              color: "#fff",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      accessorKey: "estVolume",
      header: "Estimated Volume",
      size: 110,
    },
    {
      accessorKey: "market",
      header: "Market",
      size: 110,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        const marketColors = {
          Agriculture: "#8BC34A",
          Cryptocurrencies: "#FFC107",
          Energy: "#FF5722",
          Equities: "#3F51B5",
          FX: "#009688",
          "Interest Rate": "#9C27B0",
          Metals: "#795548",
          "Real Estate": "#607D8B",
          Weather: "#00BCD4",
        };

        return (
          <Box
            sx={{
              display: "inline-block",
              padding: "4px 8px",
              backgroundColor: marketColors[value] || "#808080",
              color: "#fff",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      size: 100,
    },
  ];
  const themex = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: "#1e293b",
        paper: "#374151",
      },
      text: {
        primary: "#ffffff",
        secondary: "#cbd5e1",
      },
    },
    typography: {
      fontFamily: "monospace",
      backgroundColor: "red",
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      h1: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
          },
          contained: {
            color: "#ffffff",
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#115293",
            },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: "#cbd5e1",
          },
          displayedRows: {
            color: "#ffffff",
          },
          selectLabel: {
            color: "#ffffff",
          },
          select: {
            color: "#ffffff",
          },
          actions: {
            "& .MuiSvgIcon-root": {
              color: "#ffffff",
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#ffffff",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: "black",
            color: "#ffffff",
          },
        },
      },
      MuiTableHeadCell: {
        styleOverrides: {
          root: {
            color: "green",
            "& .MuiTableSortLabel-root": {
              color: "white",
              "&:hover": {
                color: "lightgray",
              },
              "&.Mui-active": {
                color: "white",
                "& .MuiTableSortLabel-icon": {
                  color: "white !important",
                },
              },
            },
          },
        },
      },
      MuiTableBodyCell: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: "white",
          },
          menu: {
            "& .MuiList-root": {
              backgroundColor: "#1e293b",
            },
            "& .MuiMenuItem-root": {
              color: "white",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
    },
  });
  const themey = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: "#1e293b",
        paper: "#374151",
      },
      text: {
        primary: "#000000",
        secondary: "#000000",
      },
    },
    typography: {
      fontFamily: "monospace",
      backgroundColor: "red",
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      h1: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          body1: {
            color: "black",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
          },
          contained: {
            color: "#ffffff",
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#115293",
            },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: "#cbd5e1",
          },
          displayedRows: {
            color: "#ffffff",
          },
          selectLabel: {
            color: "#ffffff",
          },
          select: {
            color: "#ffffff",
          },
          actions: {
            "& .MuiSvgIcon-root": {
              color: "#ffffff",
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "black",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: "white",
            color: "black",
          },
        },
      },
      MuiTableHeadCell: {
        styleOverrides: {
          root: {
            color: "green",
            "& .MuiTableSortLabel-root": {
              color: "white",
              "&:hover": {
                color: "lightgray",
              },
              "&.Mui-active": {
                color: "white",
                "& .MuiTableSortLabel-icon": {
                  color: "white !important",
                },
              },
            },
          },
        },
      },
      MuiTableBodyCell: {
        styleOverrides: {
          root: {
            color: "black",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: "black",
          },
          menu: {
            "& .MuiList-root": {
              backgroundColor: "#1e293b",
            },
            "& .MuiMenuItem-root": {
              color: "white",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
      MuiPopper: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": {
              backgroundColor: "white", // White background for popper
              color: "black", // Black text in popper
            },
          },
        },
      },
    },
  });
  const tablex = useMaterialReactTable({
    columns,
    data: trades,
    enableHiding: true,
    enableRowSelection: true,
    enableColumnFiltering: true,
    enableGlobalFilter: true,
    enableColumnOrdering: true,
    enablePinning: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableColumnResizing: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      density: "compact",
    },
    muiTableHeadCellProps: {
      sx: {
        color: "white",
        "& .Mui-TableHeadCell-Content": {
          color: "white",
        },
        "& .MuiSvgIcon-root": {
          color: "white",
        },
        "& .MuiTableSortLabel-icon": {
          color: "white !important",
        },
        "& .MuiTableSortLabel-root.Mui-active": {
          color: "white",
        },
        "& .MuiTableSortLabel-root:hover": {
          color: "white",
        },
        "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
          color: "white !important",
        },
      },
    },
    muiSelectProps: {
      sx: {
        color: "white",
        "& .MuiList-root": {
          backgroundColor: baseBackgroundColor,
        },
        "& .MuiMenuItem-root": {
          color: "white",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        color: "whitesmoke",
      },
    },
    muiColumnActionsButtonProps: {
      sx: {
        color: "white",
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
          color: "green",
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleExportData(table)}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          variant="contained"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(
              table.getPrePaginationRowModel().rows,
              table,
              "filtered"
            )
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          variant="contained"
          disabled={table.getRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getRowModel().rows, table, "page")
          }
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          variant="contained"
          style={{ color: "white" }}
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() =>
            handleExportRows(
              table.getSelectedRowModel().rows,
              table,
              "selected"
            )
          }
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </div>
    ),
  });
  const tabley = useMaterialReactTable({
    columns,
    data: trades,
    enableHiding: true,
    enableRowSelection: true,
    enableColumnFiltering: true,
    enableGlobalFilter: true,
    enableColumnOrdering: true,
    enablePinning: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableColumnResizing: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      density: "compact",
    },
    muiTableHeadCellProps: {
      sx: {
        color: "white",
        "& .Mui-TableHeadCell-Content": {
          color: "black",
        },
        "& .MuiSvgIcon-root": {
          color: "black",
        },
        "& .MuiTableSortLabel-icon": {
          color: "white !important",
        },
        "& .MuiTableSortLabel-root.Mui-active": {
          color: "white",
        },
        "& .MuiTableSortLabel-root:hover": {
          color: "white",
        },
        "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
          color: "blue !important",
        },
      },
    },
    muiSelectProps: {
      sx: {
        color: "white",
        "& .MuiList-root": {
          backgroundColor: baseBackgroundColor,
        },
        "& .MuiMenuItem-root": {
          color: "white",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        color: "black",
      },
    },
    muiColumnActionsButtonProps: {
      sx: {
        color: "black",
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
          color: "green",
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleExportData(table)}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          variant="contained"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(
              table.getPrePaginationRowModel().rows,
              table,
              "filtered"
            )
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          variant="contained"
          disabled={table.getRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getRowModel().rows, table, "page")
          }
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          variant="contained"
          style={{ color: "white" }}
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() =>
            handleExportRows(
              table.getSelectedRowModel().rows,
              table,
              "selected"
            )
          }
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </div>
    ),
  });
  return (
    <ThemeProvider theme={isDarkMode ? themex : themey}>
      <div
        style={{
          backgroundColor: isDarkMode ? "#334155" : "#A9A9A9",
          minHeight: "100vh",
        }}
      >
        {/* Integrated NavBar Component */}
        <TradeNavbar
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          title = {"Trade History"}
          globalIcon={GlobeIcon}
          menuItems={menuItems}
          onMenuItemClick={handleMenuItemClick}
        />

        {/* Material React Table */}
        <div
        style={{
          marginLeft: "10px",
          marginRight:"10px", // Add spacing outside the table
          borderRadius: "8px", // Optional: rounded corners
        }}
      >
        <MaterialReactTable table={isDarkMode ? tablex : tabley} />
      </div>
      </div>
    </ThemeProvider>
  );
};

export default AllTradeData;
