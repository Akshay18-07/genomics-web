import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Card, CardContent } from "@mui/material";
import { coloums, rows } from "./data/sheetData";

export default function ExcelLikeTable() {
  return (
    <Card sx={{ height: 800, width: "100%", p: 2 }}>
      <CardContent sx={{ height: 800, width: "100%", p: 2 }}>
        <DataGrid
          rows={rows}
          columns={coloums}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          // getRowId={(item) => item?.position}
          density="comfortable"
          components={{ Toolbar: GridToolbar }}
        />
      </CardContent>
    </Card>
  );
}
