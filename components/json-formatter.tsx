'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Upload, 
  Copy, 
  Moon, 
  Sun,
  Minimize2,
  Maximize2,
  TreePine,
  RotateCcw,
  Filter,
  AlertCircle,
  CheckCircle,
  Zap,
  GitCompare
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { TreeExplorer } from './tree-explorer';
import { useSettings } from '@/hooks/use-settings';
import {
  parseJSON,
  formatJSON,
  minifyJSON,
  sortObjectKeys,
  searchJSON,
  extractJSONPath,
  copyToClipboard,
  downloadFile,
  readFile,
  SearchResult,
  JSONParseResult
} from '@/lib/json-utils';

export default function JSONFormatter() {
  const { settings, toggleTheme, isLoaded } = useSettings();
  
  // State
  const [jsonInput, setJsonInput] = useState('');
  const [jsonInputB, setJsonInputB] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [jsonPathQuery, setJsonPathQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'tree' | 'compare'>('editor');
  const [lastAction, setLastAction] = useState<'format' | 'minify' | 'sort' | 'copy' | 'download' | 'upload' | 'clear' | null>(null);

  // Parsed JSON and validation
  const parseResult: JSONParseResult = useMemo(() => {
    return parseJSON(jsonInput);
  }, [jsonInput]);

  const parseResultB: JSONParseResult = useMemo(() => {
    return parseJSON(jsonInputB);
  }, [jsonInputB]);

  // Search results
  const searchResults: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim() || !parseResult.isValid || !parseResult.data) {
      return [];
    }
    return searchJSON(parseResult.data, searchQuery);
  }, [parseResult, searchQuery]);

  // JSONPath extraction result
  const jsonPathResult = useMemo(() => {
    if (!jsonPathQuery.trim() || !parseResult.isValid || !parseResult.data) {
      return null;
    }
    try {
      return extractJSONPath(parseResult.data, jsonPathQuery);
    } catch (error) {
      return null;
    }
  }, [parseResult, jsonPathQuery]);

  // JSON comparison
  const compareResults = useMemo(() => {
    if (!parseResult.isValid || !parseResultB.isValid || !parseResult.data || !parseResultB.data) {
      return null;
    }
    
    const differences: Array<{path: string, type: 'added' | 'removed' | 'changed', valueA?: any, valueB?: any}> = [];
    
    const compareObjects = (objA: any, objB: any, path = '') => {
      if (typeof objA !== typeof objB) {
        differences.push({ path: path || 'root', type: 'changed', valueA: objA, valueB: objB });
        return;
      }
      
      if (Array.isArray(objA) !== Array.isArray(objB)) {
        differences.push({ path: path || 'root', type: 'changed', valueA: objA, valueB: objB });
        return;
      }
      
      if (typeof objA !== 'object' || objA === null || objB === null) {
        if (objA !== objB) {
          differences.push({ path: path || 'root', type: 'changed', valueA: objA, valueB: objB });
        }
        return;
      }
      
      // Get all keys from both objects
      const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);
      
      for (const key of allKeys) {
        const newPath = path ? `${path}.${key}` : key;
        const hasA = key in objA;
        const hasB = key in objB;
        
        if (hasA && !hasB) {
          differences.push({ path: newPath, type: 'removed', valueA: objA[key] });
        } else if (!hasA && hasB) {
          differences.push({ path: newPath, type: 'added', valueB: objB[key] });
        } else if (hasA && hasB) {
          compareObjects(objA[key], objB[key], newPath);
        }
      }
    };
    
    compareObjects(parseResult.data, parseResultB.data);
    return differences;
  }, [parseResult, parseResultB]);

  // Load sample data on first load
  useEffect(() => {
    if (!jsonInput.trim()) {
      setJsonInput(`{
  "name": "JSON Formatter & Explorer",
  "version": "1.0.0",
  "features": [
    "Real-time validation",
    "Tree explorer",
    "Search & highlight",
    "Format & minify",
    "Transform utilities"
  ],
  "settings": {
    "theme": "light",
    "indentSize": 2
  },
  "users": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "active": true
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "active": false
    }
  ]
}`);
    }
  }, [jsonInput]);

  const handleFormat = useCallback(() => {
    if (!parseResult.isValid || !parseResult.data) {
      toast.error('Cannot format invalid JSON');
      return;
    }
    
    try {
      const formatted = formatJSON(parseResult.data, { indent: 2 });
      setJsonInput(formatted);
      setLastAction('format');
      toast.success('JSON formatted successfully');
    } catch (error) {
      toast.error('Failed to format JSON');
    }
  }, [parseResult]);

  const handleMinify = useCallback(() => {
    if (!parseResult.isValid || !parseResult.data) {
      toast.error('Cannot minify invalid JSON');
      return;
    }
    
    try {
      const minified = minifyJSON(parseResult.data);
      setJsonInput(minified);
      setLastAction('minify');
      toast.success('JSON minified successfully');
    } catch (error) {
      toast.error('Failed to minify JSON');
    }
  }, [parseResult]);

  const handleSortKeys = useCallback(() => {
    if (!parseResult.isValid || !parseResult.data) {
      toast.error('Cannot sort invalid JSON');
      return;
    }
    
    try {
      const sorted = sortObjectKeys(parseResult.data);
      const formatted = formatJSON(sorted, { indent: 2 });
      setJsonInput(formatted);
      setLastAction('sort');
      toast.success('JSON keys sorted successfully');
    } catch (error) {
      toast.error('Failed to sort JSON keys');
    }
  }, [parseResult]);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(jsonInput);
      setLastAction('copy');
      toast.success('JSON copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  }, [jsonInput]);

  const handleDownloadJSON = useCallback(() => {
    if (!jsonInput.trim()) {
      toast.error('No JSON content to download');
      return;
    }
    
    try {
      downloadFile(jsonInput, 'data.json', 'application/json');
      setLastAction('download');
      toast.success('JSON file downloaded');
    } catch (error) {
      toast.error('Failed to download JSON file');
    }
  }, [jsonInput]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
      toast.error('Please select a JSON file');
      return;
    }
    
    readFile(file)
      .then(content => {
        setJsonInput(content);
        setLastAction('upload');
        toast.success('JSON file loaded successfully');
      })
      .catch(() => {
        toast.error('Failed to read JSON file');
      });
    
    // Clear the input
    event.target.value = '';
  }, []);

  const handleClear = useCallback(() => {
    setJsonInput('');
    setSearchQuery('');
    setJsonPathQuery('');
    setActiveTab('editor');
    setLastAction('clear');
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">JSON Formatter & Explorer</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Format, validate, and explore JSON data</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
              >
                {settings.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-card rounded-lg border">
              <div className="flex flex-wrap items-center gap-2 w-full">
                <Button 
                  onClick={handleFormat} 
                  disabled={!parseResult.isValid} 
                  size="sm"
                  variant={lastAction === 'format' ? 'default' : 'outline'}
                  className="min-h-[36px]"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Format
                </Button>
                
                <Button 
                  onClick={handleMinify} 
                  disabled={!parseResult.isValid} 
                  size="sm" 
                  variant={lastAction === 'minify' ? 'default' : 'outline'}
                  className="min-h-[36px]"
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Minify
                </Button>
                
                <Button 
                  onClick={handleSortKeys} 
                  disabled={!parseResult.isValid} 
                  size="sm" 
                  variant={lastAction === 'sort' ? 'default' : 'outline'}
                  className="min-h-[36px]"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sort Keys
                </Button>
                
                <Button 
                  onClick={handleCopy} 
                  size="sm" 
                  variant={lastAction === 'copy' ? 'default' : 'outline'} 
                  className="min-h-[36px]"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                
                <Button 
                  onClick={handleDownloadJSON} 
                  size="sm" 
                  variant={lastAction === 'download' ? 'default' : 'outline'} 
                  className="min-h-[36px]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button 
                    size="sm" 
                    variant={lastAction === 'upload' ? 'default' : 'outline'} 
                    className="min-h-[36px]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                
                <Button 
                  onClick={handleClear} 
                  size="sm" 
                  variant={lastAction === 'clear' ? 'default' : 'outline'} 
                  className="min-h-[36px]"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Main Editor/Tree View */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'tree' | 'compare')}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:flex">
                  <TabsTrigger value="editor" className="text-xs sm:text-sm py-2">
                    <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="tree" disabled={!parseResult.isValid} className="text-xs sm:text-sm py-2">
                    <TreePine className="h-4 w-4 mr-1 sm:mr-2" />
                    Tree View
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="text-xs sm:text-sm py-2">
                    <GitCompare className="h-4 w-4 mr-1 sm:mr-2" />
                    Compare
                  </TabsTrigger>
                </TabsList>
                
                {/* Validation Status */}
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  {parseResult.isValid ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid JSON
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Invalid JSON
                    </Badge>
                  )}
                </div>
              </div>
              
              <TabsContent value="editor" className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      // Reset last action when user manually edits
                      if (lastAction) {
                        setLastAction(null);
                      }
                    }}
                    placeholder="Paste your JSON here..."
                    className="min-h-[300px] sm:min-h-[400px] font-mono text-xs sm:text-sm"
                    spellCheck={false}
                  />
                  
                  {/* Error Display */}
                  {!parseResult.isValid && parseResult.error && (
                    <Alert className="border-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">JSON Syntax Error</p>
                          <p className="text-sm">{parseResult.error}</p>
                          {parseResult.line && parseResult.column && (
                            <p className="text-xs text-muted-foreground">
                              Line {parseResult.line}, Column {parseResult.column}
                            </p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tree">
                {parseResult.isValid && parseResult.data ? (
                  <TreeExplorer
                    data={parseResult.data}
                    searchQuery={searchQuery}
                    searchResults={searchResults}
                  />
                ) : (
                  <div className="flex items-center justify-center h-32 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground text-center text-sm px-4">Please enter valid JSON to view tree structure</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="compare" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2 order-1">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium text-sm">JSON A (Original)</Label>
                      {parseResult.isValid ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Invalid
                        </Badge>
                      )}
                    </div>
                    <Textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder="Paste first JSON here..."
                      className="min-h-[200px] sm:min-h-[300px] font-mono text-xs sm:text-sm"
                      spellCheck={false}
                    />
                  </div>
                  
                  <div className="space-y-2 order-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium text-sm">JSON B (Compare)</Label>
                      {parseResultB.isValid ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Invalid
                        </Badge>
                      )}
                    </div>
                    <Textarea
                      value={jsonInputB}
                      onChange={(e) => setJsonInputB(e.target.value)}
                      placeholder="Paste second JSON here..."
                      className="min-h-[200px] sm:min-h-[300px] font-mono text-xs sm:text-sm"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Comparison Results */}
                {compareResults && (
                  <div className="space-y-3 order-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Differences</Label>
                      <Badge variant="secondary">
                        {compareResults.length} difference{compareResults.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {compareResults.length === 0 ? (
                      <div className="flex items-center justify-center h-20 border rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-green-700 dark:text-green-300 font-medium">JSONs are identical!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/50">
                        {compareResults.map((diff, index) => (
                          <div key={index} className={`p-2 rounded text-sm ${
                            diff.type === 'added' ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' :
                            diff.type === 'removed' ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800' :
                            'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                          } border`}>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant={
                                diff.type === 'added' ? 'default' :
                                diff.type === 'removed' ? 'destructive' : 
                                'secondary'
                              } className="text-xs">
                                {diff.type.toUpperCase()}
                              </Badge>
                              <span className="font-mono text-xs break-all">{diff.path}</span>
                            </div>
                            
                            {diff.type === 'changed' && (
                              <div className="space-y-1 text-xs">
                                <div className="flex items-start gap-2">
                                  <span className="text-red-600 dark:text-red-400 font-medium">-</span>
                                  <span className="font-mono bg-red-50 dark:bg-red-900/20 px-1 rounded break-all">
                                    {JSON.stringify(diff.valueA)}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-green-600 dark:text-green-400 font-medium">+</span>
                                  <span className="font-mono bg-green-50 dark:bg-green-900/20 px-1 rounded break-all">
                                    {JSON.stringify(diff.valueB)}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {diff.type === 'added' && (
                              <div className="text-xs mt-1">
                                <span className="font-mono bg-green-50 dark:bg-green-900/20 px-1 rounded break-all">
                                  {JSON.stringify(diff.valueB)}
                                </span>
                              </div>
                            )}
                            
                            {diff.type === 'removed' && (
                              <div className="text-xs mt-1">
                                <span className="font-mono bg-red-50 dark:bg-red-900/20 px-1 rounded break-all">
                                  {JSON.stringify(diff.valueA)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Error messages for invalid JSONs */}
                {!parseResult.isValid && parseResult.error && (
                  <Alert className="border-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">JSON A Error</p>
                        <p className="text-sm">{parseResult.error}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {!parseResultB.isValid && parseResultB.error && (
                  <Alert className="border-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">JSON B Error</p>
                        <p className="text-sm">{parseResultB.error}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {/* Search */}
            <div className="bg-card p-4 rounded-lg border space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Label className="font-medium">Search</Label>
              </div>
              
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keys and values..."
                disabled={!parseResult.isValid}
                className="text-sm"
              />
              
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{searchResults.length} results</Badge>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {searchResults.slice(0, 10).map((result, index) => (
                      <div key={index} className="text-xs p-2 bg-muted rounded">
                        <div className="font-mono break-all">{result.path}</div>
                        <div className="text-muted-foreground truncate">
                          {result.type === 'key' ? `Key: ${result.key}` : `Value: ${String(result.value)}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* JSONPath Query */}
            <div className="bg-card p-4 rounded-lg border space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Label className="font-medium">JSONPath Query</Label>
              </div>
              
              <Input
                value={jsonPathQuery}
                onChange={(e) => setJsonPathQuery(e.target.value)}
                placeholder="e.g. users.0.name"
                disabled={!parseResult.isValid}
                className="text-sm font-mono"
              />
              
              {jsonPathQuery && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Result:</Label>
                  <div className="p-2 bg-muted rounded text-xs font-mono max-h-32 overflow-auto break-all">
                    {jsonPathResult !== null ? (
                      JSON.stringify(jsonPathResult, null, 2)
                    ) : (
                      <span className="text-muted-foreground">No result</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            {parseResult.isValid && parseResult.data && (
              <div className="bg-card p-4 rounded-lg border space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <Label className="font-medium">Statistics</Label>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{jsonInput.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lines:</span>
                    <span>{jsonInput.split('\n').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{Array.isArray(parseResult.data) ? 'Array' : typeof parseResult.data}</span>
                  </div>
                  {Array.isArray(parseResult.data) && (
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{parseResult.data.length}</span>
                    </div>
                  )}
                  {typeof parseResult.data === 'object' && parseResult.data !== null && !Array.isArray(parseResult.data) && (
                    <div className="flex justify-between">
                      <span>Keys:</span>
                      <span>{Object.keys(parseResult.data).length}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>JSON Formatter & Explorer</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Created by</span>
              <a 
                href="https://x.com/heydeepakjangra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <span>@heydeepakjangra</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 