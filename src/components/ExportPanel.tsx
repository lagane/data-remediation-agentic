import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExportPanelProps {
  remediationApplied: boolean;
  originalFile: File | null;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ 
  remediationApplied, 
  originalFile 
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'data' | 'report') => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      if (type === 'data') {
        // Create mock file download
        const filename = `remediated_${originalFile?.name || 'data'}.${exportFormat}`;
        console.log(`Downloading ${filename}`);
      } else {
        // Create mock report download
        const filename = `analysis_report_${new Date().toISOString().split('T')[0]}.pdf`;
        console.log(`Downloading ${filename}`);
      }
      setIsExporting(false);
    }, 2000);
  };

  const getFileIcon = (format: string) => {
    return format === 'csv' ? FileText : FileSpreadsheet;
  };

  if (!originalFile) {
    return null;
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Export Results</CardTitle>
          </div>
          {remediationApplied && (
            <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Ready
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!remediationApplied ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">
              Apply remediation first to enable export
            </div>
            <Badge variant="secondary">Waiting for remediation</Badge>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Export Format</label>
                <Select value={exportFormat} onValueChange={(value: 'csv' | 'xlsx') => setExportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        CSV (.csv)
                      </div>
                    </SelectItem>
                    <SelectItem value="xlsx">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel (.xlsx)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <div className="p-4 border border-border/50 rounded-lg bg-secondary/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(getFileIcon(exportFormat), { className: "h-5 w-5 text-primary" })}
                      <span className="font-medium text-foreground">Remediated Dataset</span>
                    </div>
                    <Badge variant="outline">1,239 rows</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clean dataset with all applied remediations
                  </p>
                  <Button
                    onClick={() => handleExport('data')}
                    disabled={isExporting}
                    variant="glow"
                    size="sm"
                    className="w-full"
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Dataset
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg bg-secondary/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">Analysis Report</span>
                    </div>
                    <Badge variant="outline">PDF</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Detailed report of analysis and remediation steps
                  </p>
                  <Button
                    onClick={() => handleExport('report')}
                    disabled={isExporting}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Exported files maintain original structure with applied changes</p>
                <p>• Analysis report includes metadata, issues found, and remediation steps</p>
                <p>• All exports are timestamped for version control</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};