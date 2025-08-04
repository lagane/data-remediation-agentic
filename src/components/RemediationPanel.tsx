import React, { useState } from 'react';
import { Settings, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RemediationOption {
  id: string;
  label: string;
  description: string;
  category: 'cleaning' | 'formatting' | 'validation';
  impact: 'low' | 'medium' | 'high';
  selected: boolean;
  config?: any;
}

interface RemediationPanelProps {
  analysisResult: any;
  onApplyRemediation: (options: RemediationOption[]) => void;
}

export const RemediationPanel: React.FC<RemediationPanelProps> = ({ 
  analysisResult, 
  onApplyRemediation 
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [remediationOptions, setRemediationOptions] = useState<RemediationOption[]>([
    {
      id: 'remove_nulls',
      label: 'Remove Null Values',
      description: 'Drop rows with missing critical data',
      category: 'cleaning',
      impact: 'high',
      selected: false,
    },
    {
      id: 'impute_nulls',
      label: 'Impute Missing Values',
      description: 'Fill missing values with statistical estimates',
      category: 'cleaning',
      impact: 'medium',
      selected: true,
      config: { method: 'mean' }
    },
    {
      id: 'remove_duplicates',
      label: 'Remove Duplicate Rows',
      description: 'Keep only unique records',
      category: 'cleaning',
      impact: 'medium',
      selected: true,
    },
    {
      id: 'standardize_emails',
      label: 'Standardize Email Formats',
      description: 'Fix email format inconsistencies',
      category: 'formatting',
      impact: 'low',
      selected: true,
    },
    {
      id: 'normalize_columns',
      label: 'Normalize Column Names',
      description: 'Convert to lowercase, replace spaces with underscores',
      category: 'formatting',
      impact: 'low',
      selected: false,
    },
    {
      id: 'validate_types',
      label: 'Enforce Data Types',
      description: 'Convert values to correct data types',
      category: 'validation',
      impact: 'medium',
      selected: true,
    },
  ]);

  const toggleOption = (id: string) => {
    setRemediationOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, selected: !option.selected } : option
      )
    );
  };

  const updateConfig = (id: string, config: any) => {
    setRemediationOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, config } : option
      )
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return '🧹';
      case 'formatting': return '📝';
      case 'validation': return '✅';
      default: return '⚙️';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const selectedCount = remediationOptions.filter(opt => opt.selected).length;

  const applyRemediation = () => {
    const selectedOptions = remediationOptions.filter(opt => opt.selected);
    onApplyRemediation(selectedOptions);
    setPreviewVisible(true);
  };

  if (!analysisResult) {
    return null;
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Data Remediation</CardTitle>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            {selectedCount} selected
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {['cleaning', 'formatting', 'validation'].map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-foreground mb-2 capitalize flex items-center gap-2">
                <span>{getCategoryIcon(category)}</span>
                {category} Operations
              </h4>
              
              <div className="space-y-2 pl-6">
                {remediationOptions
                  .filter(option => option.category === category)
                  .map(option => (
                    <div
                      key={option.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-border/30 bg-secondary/10 hover:bg-secondary/20 transition-colors"
                    >
                      <Checkbox
                        checked={option.selected}
                        onCheckedChange={() => toggleOption(option.id)}
                        className="mt-0.5"
                      />
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{option.label}</span>
                          <Badge variant={getImpactColor(option.impact)} className="text-xs">
                            {option.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                        
                        {option.id === 'impute_nulls' && option.selected && (
                          <div className="mt-2">
                            <Select
                              value={option.config?.method || 'mean'}
                              onValueChange={(value) => updateConfig(option.id, { method: value })}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mean">Mean imputation</SelectItem>
                                <SelectItem value="median">Median imputation</SelectItem>
                                <SelectItem value="mode">Mode imputation</SelectItem>
                                <SelectItem value="forward">Forward fill</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              
              {category !== 'validation' && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={applyRemediation}
            disabled={selectedCount === 0}
            variant="gradient"
            className="flex-1"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Apply Remediation ({selectedCount})
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setPreviewVisible(!previewVisible)}
            disabled={!previewVisible}
          >
            {previewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {previewVisible && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="font-medium text-green-400">Remediation Preview</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Removed 8 duplicate rows</p>
              <p>• Imputed 87 missing values using mean method</p>
              <p>• Standardized 12 email formats</p>
              <p>• Enforced data types for 3 columns</p>
              <p className="text-green-400 font-medium mt-2">
                Final dataset: {(analysisResult.totalRows - 8).toLocaleString()} rows, 
                improved quality score: 94%
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};