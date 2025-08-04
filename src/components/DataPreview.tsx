import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface DataPreviewProps {
  file: File | null;
  previewData?: any[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ file, previewData }) => {
  // Mock data for preview when no real data is available
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28, department: 'Marketing' },
    { id: 3, name: '', email: 'bob@example.com', age: null, department: 'Sales' },
    { id: 4, name: 'Alice Johnson', email: 'alice@invalid', age: 35, department: 'HR' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', age: 42, department: 'Finance' },
  ];

  const data = previewData || (file ? mockData : []);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  if (!file) {
    return null;
  }

  const renderCellValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return <Badge variant="destructive" className="text-xs">NULL</Badge>;
    }
    if (typeof value === 'string' && value.includes('@') && !value.includes('@example.com')) {
      return <span className="text-yellow-400">{value}</span>;
    }
    return value;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Data Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing first 5 rows of {file.name}
        </p>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/20">
                  {columns.map((column) => (
                    <TableHead key={column} className="font-medium text-foreground">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 5).map((row, index) => (
                  <TableRow key={index} className="border-border/30">
                    {columns.map((column) => (
                      <TableCell key={column} className="text-foreground">
                        {renderCellValue(row[column])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No data to preview
          </div>
        )}
      </CardContent>
    </Card>
  );
};