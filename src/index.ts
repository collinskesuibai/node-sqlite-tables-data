import sqlite3 from "sqlite3";
import express, { Request, Response, NextFunction } from "express";

const getTablesData = (dbName: string) => {
  const db = new sqlite3.Database(dbName);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = "SELECT name FROM sqlite_master WHERE type='table'";
      db.all(query, (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const tableNames = rows.map((row) => row.name);
          const tablesData = tableNames.map((tableName) => {
            return new Promise((resolve) => {
              const tableQuery = `SELECT * FROM ${tableName}`;
              db.all(tableQuery, (err: Error | null, rows: any[]) => {
                if (err) {
                  console.error(err);
                  resolve({ tableName, error: "Error retrieving data" });
                } else {
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
              } else {
                const tableHTML = results
                  .map((result :any) => {
                    if (result.error) {
                      return `<h2>${result.tableName}: ${result.error}</h2>`;
                    } else {
                      const columnNames = Object.keys(result.data[0]);
                      const tableRows = result.data
                        .map((row:any) => {
                          const cells = columnNames
                            .map(
                              (column) => `<td>${row[column as keyof typeof row]}</td>`
                            )
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

export { getTablesData };
