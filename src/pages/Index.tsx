import React, { useState } from 'react';
import { Database, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { LLMSummary } from '@/components/LLMSummary';
import { RemediationPanel } from '@/components/RemediationPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [remediationApplied, setRemediationApplied] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    upload: false,
    analysis: false,
    summary: false,
    remediation: false,
    export: false,
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  const handleRemediationApply = (options: any[]) => {
    setRemediationApplied(true);
  };

  const CollapsibleSection = ({ 
    title, 
    section, 
    children, 
    icon: Icon 
  }: { 
    title: string; 
    section: keyof typeof collapsedSections; 
    children: React.ReactNode;
    icon: any;
  }) => (
    <Collapsible 
      open={!collapsedSections[section]} 
      onOpenChange={() => toggleSection(section)}
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between p-4 h-auto mb-4 bg-secondary/20 hover:bg-secondary/40 border border-border/50"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">{title}</span>
          </div>
          {collapsedSections[section] ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronUp className="h-4 w-4" />
          }
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mb-8">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-lg border border-primary/30">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Data Remediation Studio
                </h1>
                <p className="text-lg text-muted-foreground">
                  AI-powered data quality analysis and remediation
                </p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg border border-primary/30">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Input Panel */}
          <CollapsibleSection 
            title="1. Upload Data File" 
            section="upload"
            icon={Database}
          >
            <div className="grid lg:grid-cols-2 gap-6">
              <FileUpload 
                onFileSelect={setSelectedFile} 
                selectedFile={selectedFile} 
              />
              <DataPreview 
                file={selectedFile} 
              />
            </div>
          </CollapsibleSection>

          {/* Analysis Panel */}
          <CollapsibleSection 
            title="2. Data Analysis" 
            section="analysis"
            icon={Sparkles}
          >
            <AnalysisPanel 
              file={selectedFile}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </CollapsibleSection>

          {/* LLM Summary */}
          {analysisResult && (
            <CollapsibleSection 
              title="3. AI Quality Summary" 
              section="summary"
              icon={Sparkles}
            >
              <LLMSummary analysisResult={analysisResult} />
            </CollapsibleSection>
          )}

          {/* Remediation Panel */}
          {analysisResult && (
            <CollapsibleSection 
              title="4. Data Remediation" 
              section="remediation"
              icon={Database}
            >
              <RemediationPanel 
                analysisResult={analysisResult}
                onApplyRemediation={handleRemediationApply}
              />
            </CollapsibleSection>
          )}

          {/* Export Panel */}
          {analysisResult && (
            <CollapsibleSection 
              title="5. Export Results" 
              section="export"
              icon={Database}
            >
              <ExportPanel 
                remediationApplied={remediationApplied}
                originalFile={selectedFile}
              />
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
