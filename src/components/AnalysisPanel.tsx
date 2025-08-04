import React, { useState } from 'react';
import { Play, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
  totalRows: number;
  totalColumns: number;
  nullCounts: Record<string, number>;
  duplicateRows: number;
  dataTypes: Record<string, string>;
  schemaMismatches: string[];
}

interface AnalysisPanelProps {
  file: File | null;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ file, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);

  const runAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Mock analysis result
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        totalRows: 1247,
        totalColumns: 5,
        nullCounts: {
          name: 23,
          email: 5,
          age: 47,
          department: 12,
        },
        duplicateRows: 8,
        dataTypes: {
          id: 'integer',
          name: 'string',
          email: 'string',
          age: 'integer',
          department: 'string',
        },
        schemaMismatches: ['Invalid email formats detected', 'Age column contains non-numeric values'],
      };

      setProgress(100);
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      onAnalysisComplete(mockResult);
    }, 3000);
  };

  const getQualityScore = () => {
    if (!analysisResult) return 0;
    
    const totalCells = analysisResult.totalRows * analysisResult.totalColumns;
    const nullCount = Object.values(analysisResult.nullCounts).reduce((sum, count) => sum + count, 0);
    const nullPercentage = (nullCount / totalCells) * 100;
    const duplicatePercentage = (analysisResult.duplicateRows / analysisResult.totalRows) * 100;
    
    const score = Math.max(0, 100 - nullPercentage - duplicatePercentage - (analysisResult.schemaMismatches.length * 5));
    return Math.round(score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Data Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button 
            onClick={runAnalysis}
            disabled={!file || isAnalyzing}
            variant="gradient"
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Analysis Progress</span>
              <span className="text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {analysisResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-secondary/20 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-foreground">{analysisResult.totalRows.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center p-3 bg-secondary/20 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-foreground">{analysisResult.totalColumns}</div>
                <div className="text-sm text-muted-foreground">Columns</div>
              </div>
              <div className="text-center p-3 bg-secondary/20 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-orange-400">{analysisResult.duplicateRows}</div>
                <div className="text-sm text-muted-foreground">Duplicates</div>
              </div>
              <div className="text-center p-3 bg-secondary/20 rounded-lg border border-border/50">
                <div className={`text-2xl font-bold ${getScoreColor(getQualityScore())}`}>
                  {getQualityScore()}%
                </div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Data Quality Issues</h4>
              
              {Object.entries(analysisResult.nullCounts).map(([column, count]) => (
                count > 0 && (
                  <div key={column} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/30">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-foreground">Null values in <code className="bg-primary/20 px-1 rounded text-primary">{column}</code></span>
                    </div>
                    <Badge variant="destructive">{count} records</Badge>
                  </div>
                )
              ))}

              {analysisResult.duplicateRows > 0 && (
                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-foreground">Duplicate rows detected</span>
                  </div>
                  <Badge variant="secondary">{analysisResult.duplicateRows} rows</Badge>
                </div>
              )}

              {analysisResult.schemaMismatches.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-foreground">{issue}</span>
                  </div>
                  <Badge variant="outline">Schema Issue</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};