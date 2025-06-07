'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Braces, Brackets, Hash, Quote, ToggleLeft, Dot } from 'lucide-react';
import { TreeNode, generateTree, SearchResult } from '@/lib/json-utils';
import { Badge } from '@/components/ui/badge';

interface TreeExplorerProps {
  data: any;
  searchQuery?: string;
  searchResults?: SearchResult[];
}

interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  searchQuery?: string;
  searchResults?: SearchResult[];
  onToggle: (path: string) => void;
  expandedNodes: Set<string>;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  depth,
  searchQuery,
  searchResults,
  onToggle,
  expandedNodes
}) => {
  const isExpanded = expandedNodes.has(node.path);
  const hasChildren = node.children && node.children.length > 0;
  const isHighlighted = searchResults?.some(result => 
    result.path === node.path || 
    (result.key === node.key && result.type === 'key') ||
    (String(result.value) === String(node.value) && result.type === 'value')
  );

  const getTypeIcon = (type: TreeNode['type']) => {
    switch (type) {
      case 'object':
        return <Braces className="h-4 w-4 text-blue-500" />;
      case 'array':
        return <Brackets className="h-4 w-4 text-green-500" />;
      case 'string':
        return <Quote className="h-4 w-4 text-amber-500" />;
      case 'number':
        return <Hash className="h-4 w-4 text-purple-500" />;
      case 'boolean':
        return <ToggleLeft className="h-4 w-4 text-orange-500" />;
      case 'null':
        return <Dot className="h-4 w-4 text-gray-500" />;
      default:
        return <Dot className="h-4 w-4 text-gray-500" />;
    }
  };

  const getValueDisplay = (value: any, type: TreeNode['type']) => {
    switch (type) {
      case 'string':
        return `"${value}"`;
      case 'number':
      case 'boolean':
        return String(value);
      case 'null':
        return 'null';
      case 'object':
        if (hasChildren) {
          const keyCount = Object.keys(value || {}).length;
          return `{${keyCount} ${keyCount === 1 ? 'property' : 'properties'}}`;
        }
        return '{}';
      case 'array':
        if (hasChildren) {
          return `[${(value || []).length} ${(value || []).length === 1 ? 'item' : 'items'}]`;
        }
        return '[]';
      default:
        return String(value);
    }
  };

  const paddingLeft = depth * 16;

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-2 px-2 hover:bg-muted/50 rounded cursor-pointer transition-colors min-h-[44px] ${
          isHighlighted ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => hasChildren && onToggle(node.path)}
      >
        <div className="flex items-center min-w-0 flex-1">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground mr-1 sm:mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground mr-1 sm:mr-2 flex-shrink-0" />
            )
          ) : (
            <div className="w-4 sm:w-5 mr-1 sm:mr-2 flex-shrink-0" />
          )}
          
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {getTypeIcon(node.type)}
            </div>
            
            <span 
              className={`font-medium text-xs sm:text-sm break-all ${
                isHighlighted && searchResults?.some(r => r.key === node.key && r.type === 'key') 
                  ? 'bg-yellow-200 dark:bg-yellow-800' : ''
              }`}
            >
              {node.key}
            </span>
            
            <span className="text-muted-foreground text-xs sm:text-sm">:</span>
            
            <span 
              className={`text-xs sm:text-sm font-mono break-all ${
                isHighlighted && searchResults?.some(r => 
                  String(r.value) === String(node.value) && r.type === 'value'
                ) ? 'bg-yellow-200 dark:bg-yellow-800' : ''
              } ${
                node.type === 'string' ? 'text-green-600 dark:text-green-400' :
                node.type === 'number' ? 'text-blue-600 dark:text-blue-400' :
                node.type === 'boolean' ? 'text-orange-600 dark:text-orange-400' :
                node.type === 'null' ? 'text-gray-500' :
                'text-muted-foreground'
              }`}
            >
              {getValueDisplay(node.value, node.type)}
            </span>
          </div>
        </div>
        
        <Badge variant="outline" className="ml-1 sm:ml-2 text-xs hidden xs:inline-flex">
          {node.type}
        </Badge>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child, index) => (
            <TreeNodeComponent
              key={`${child.path}-${index}`}
              node={child}
              depth={depth + 1}
              searchQuery={searchQuery}
              searchResults={searchResults}
              onToggle={onToggle}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeExplorer: React.FC<TreeExplorerProps> = ({
  data,
  searchQuery,
  searchResults
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const tree = useMemo(() => {
    try {
      return generateTree(data);
    } catch (error) {
      console.error('Failed to generate tree:', error);
      return null;
    }
  }, [data]);

  const handleToggle = (path: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allPaths = new Set<string>();
    
    const collectPaths = (node: TreeNode) => {
      if (node.children && node.children.length > 0) {
        allPaths.add(node.path);
        node.children.forEach(collectPaths);
      }
    };
    
    if (tree) {
      collectPaths(tree);
    }
    
    setExpandedNodes(allPaths);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  if (!tree) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        <p>Unable to generate tree view</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 flex-wrap">
        <button
          onClick={expandAll}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 py-1 px-2 rounded hover:bg-muted/50 transition-colors min-h-[32px]"
        >
          Expand All
        </button>
        <span className="text-muted-foreground hidden xs:inline">|</span>
        <button
          onClick={collapseAll}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 py-1 px-2 rounded hover:bg-muted/50 transition-colors min-h-[32px]"
        >
          Collapse All
        </button>
        {searchResults && searchResults.length > 0 && (
          <>
            <span className="text-muted-foreground hidden xs:inline">|</span>
            <Badge variant="secondary" className="text-xs">
              {searchResults.length} match{searchResults.length !== 1 ? 'es' : ''}
            </Badge>
          </>
        )}
      </div>
      
      <div className="border rounded-lg bg-card">
        <div className="max-h-[400px] sm:max-h-[500px] overflow-auto p-2">
          <TreeNodeComponent
            node={tree}
            depth={0}
            searchQuery={searchQuery}
            searchResults={searchResults}
            onToggle={handleToggle}
            expandedNodes={expandedNodes}
          />
        </div>
      </div>
    </div>
  );
}; 