"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTablesData = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const getTablesData = (dbName) => {
    const db = new sqlite3_1.default.Database(dbName);
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = "SELECT name FROM sqlite_master WHERE type='table'";
            db.all(query, (err, rows) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Internal Server Error" });
                }
                else {
                    const tableNames = rows.map((row) => row.name);
                    const tablesData = tableNames.map((tableName) => {
                        return new Promise((resolve) => {
                            const tableQuery = `SELECT * FROM ${tableName}`;
                            db.all(tableQuery, (err, rows) => {
                                if (err) {
                                    console.error(err);
                                    resolve({ tableName, error: "Error retrieving data" });
                                }
                                else {
                                    resolve({ tableName, data: rows });
                                }
                            });
                        });
                    });
                    Promise.all(tablesData)
                        .then((results) => {
                        const format = req.query.format || "html";
                        if (format === "json") {
                            res.json(results);
                        }
                        else {
                            const tableHTML = results
                                .map((result) => {
                                if (result.error) {
                                    return `<h2>${result.tableName}: ${result.error}</h2>`;
                                }
                                else {
                                    const columnNames = Object.keys(result.data[0]);
                                    const tableRows = result.data
                                        .map((row) => {
                                        const cells = columnNames
                                            .map((column) => `<td>${row[column]}</td>`)
                                            .join("");
                                        return `<tr>${cells}</tr>`;
                                    })
                                        .join("");
                                    return `
                        <h2>${result.tableName}</h2>
                        <table>
                          <tr>${columnNames
                                        .map((column) => `<th>${column}</th>`)
                                        .join("")}</tr>
                          ${tableRows}
                        </table>
                      `;
                                }
                            })
                                .join("");
                            const html = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Tables Data</title>
                    <style>
                    body {
                      font-family: 'Courier New', monospace;
                      text-align: center;
                      margin: 0;
                      padding: 20px;
                      background: #1e1e1e;
                      color: #ffffff;
                    }
                
                    h1 {
                      color: #ffffff;
                      font-size: 36px;
                      margin-bottom: 20px;
                    }
                
                    h2 {
                      color: #ffffff;
                      font-size: 24px;
                      margin-bottom: 10px;
                    }
                
                    table {
                      margin: 20px auto;
                      border-collapse: collapse;
                    }
                
                    th, td {
                      border: 1px solid #ffffff;
                      padding: 8px;
                    }
                
                    th {
                      background: #073655;
                      color: #ffffff;
                    }
                  </style>
                  </head>
                  <body>
                    <h1>Tables Data</h1>
                    ${tableHTML}
                  </body>
                  </html>
                `;
                            res.send(html);
                        }
                    })
                        .catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: "Internal Server Error" });
                    });
                }
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getTablesData = getTablesData;
