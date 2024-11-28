import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    TablePagination,
} from "@mui/material";

const Risk = () => {
    const [trades, setTrades] = useState([]);
    const [threshold, setThreshold] = useState(0.5);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchTrades();
    }, [threshold]);

    const fetchTrades = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3000/api/risk?threshold=${threshold}`);
            setTrades(response.data);
        } catch (error) {
            console.error("Error fetching trades:", error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleThresholdChange = (event) => {
        let value = parseFloat(event.target.value);

        if (!isNaN(value)) {
            value = Math.round(value * 10) / 10;

            if (value >= 0 && value <= 1) {
                setThreshold(value);
            }
        }
    };

    return (
        <>
            <style>
                {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden; 
            background-color: #334155;
          }
          #root {
            height: 100%;
          }
        `}
            </style>
            <div
                style={{
                    backgroundColor: "#334155",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "20px",
                }}
            >
                <h2
                    style={{
                        color: "#ffffff",
                        marginBottom: "20px",
                        fontSize: "1.8rem",
                    }}
                >
                    Risk Assessment Dashboard
                </h2>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "30px",
                        gap: "10px",
                    }}
                >
                    <label
                        style={{
                            color: "#ffffff",
                            fontSize: "1rem",
                            marginRight: "10px",
                        }}
                    >
                        Risk Threshold:
                    </label>
                    <TextField
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={threshold}
                        onChange={handleThresholdChange}
                        variant="outlined"
                        inputProps={{
                            style: {
                                padding: "10px",
                                fontSize: "1rem",
                            },
                            step: 0.1,
                        }}
                        style={{
                            backgroundColor: "#ffffff",
                            width: "100%",
                            maxWidth: "200px",
                        }}
                    />
                </div>

                <TableContainer
                    component={Paper}
                    style={{
                        backgroundColor: "#1e293b",
                        width: "100vw",
                        maxWidth: "1200px",
                        overflowX: "auto",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: "#ffffff" }}>ID</TableCell>
                                <TableCell style={{ color: "#ffffff" }}>Name</TableCell>
                                <TableCell style={{ color: "#ffffff" }}>Market</TableCell>
                                <TableCell style={{ color: "#ffffff" }}>Risk Score</TableCell>
                                <TableCell style={{ color: "#ffffff" }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((trade) => (
                                <TableRow key={trade.id}>
                                    <TableCell style={{ color: "#ffffff" }}>{trade.id}</TableCell>
                                    <TableCell style={{ color: "#ffffff" }}>{trade.name}</TableCell>
                                    <TableCell style={{ color: "#ffffff" }}>{trade.market}</TableCell>
                                    <TableCell
                                        style={{
                                            color: "#ffffff",
                                            backgroundColor: trade.status === "Risky" ? "red" : "green",
                                            textAlign: "center",
                                        }}
                                    >
                                        {trade.risk_score.toFixed(2)}
                                    </TableCell>
                                    <TableCell style={{ color: "#ffffff" }}>{trade.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={trades.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 20]}
                    style={{
                        color: "#ffffff",
                        width: "100%",
                    }}
                />
            </div>
        </>
    );
};

export default Risk;
