export interface JSONParseResult {
  isValid: boolean;
  data?: any;
  error?: string;
  line?: number;
  column?: number;
}

export interface FormatOptions {
  indent: number;
  sortKeys?: boolean;
}

export interface SearchResult {
  path: string;
  key?: string;
  value: any;
  type: 'key' | 'value';
}

/**
 * Parse JSON with detailed error information
 */
export function parseJSON(jsonString: string): JSONParseResult {
  if (!jsonString.trim()) {
    return {
      isValid: false,
      error: 'Empty JSON string',
      line: 1,
      column: 1
    };
  }

  try {
    const data = JSON.parse(jsonString);
    return {
      isValid: true,
      data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Extract line and column from SyntaxError
    const match = errorMessage.match(/at position (\d+)/);
    let line = 1;
    let column = 1;
    
    if (match) {
      const position = parseInt(match[1]);
      const lines = jsonString.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      isValid: false,
      error: errorMessage,
      line,
      column
    };
  }
}

/**
 * Format JSON with specified indentation
 */
export function formatJSON(data: any, options: FormatOptions = { indent: 2 }): string {
  try {
    if (options.sortKeys) {
      data = sortObjectKeys(data);
    }
    return JSON.stringify(data, null, options.indent);
  } catch (error) {
    throw new Error('Failed to format JSON: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Minify JSON by removing all whitespace
 */
export function minifyJSON(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new Error('Failed to minify JSON: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Recursively sort object keys alphabetically
 */
export function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: any = {};
  
  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(obj[key]);
  }
  
  return sortedObj;
}

/**
 * Search for keys and values in JSON data
 */
export function searchJSON(data: any, query: string, caseSensitive: boolean = false): SearchResult[] {
  const results: SearchResult[] = [];
  const searchTerm = caseSensitive ? query : query.toLowerCase();
  
  function search(obj: any, path: string = '') {
    if (obj === null || obj === undefined) return;
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const currentPath = path ? `${path}[${index}]` : `[${index}]`;
        search(item, currentPath);
      });
    } else if (typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        // Check if key matches
        const keyToCheck = caseSensitive ? key : key.toLowerCase();
        if (keyToCheck.includes(searchTerm)) {
          results.push({
            path: currentPath,
            key,
            value,
            type: 'key'
          });
        }
        
        // Check if value matches (for primitives)
        if (typeof value === 'string' || typeof value === 'number') {
          const valueToCheck = caseSensitive ? String(value) : String(value).toLowerCase();
          if (valueToCheck.includes(searchTerm)) {
            results.push({
              path: currentPath,
              key,
              value,
              type: 'value'
            });
          }
        }
        
        search(value, currentPath);
      });
    } else {
      // Primitive value
      const valueToCheck = caseSensitive ? String(obj) : String(obj).toLowerCase();
      if (valueToCheck.includes(searchTerm)) {
        results.push({
          path,
          value: obj,
          type: 'value'
        });
      }
    }
  }
  
  search(data);
  return results;
}

/**
 * Convert array of objects to CSV
 */
export function arrayToCSV(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array');
  }

  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => allKeys.add(key));
    }
  });

  const headers = Array.from(allKeys);
  
  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(item => {
      return headers.map(header => {
        const value = item && typeof item === 'object' ? item[header] : '';
        // Escape quotes and wrap in quotes if necessary
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value || '');
      }).join(',');
    })
  ];

  return csvRows.join('\n');
}

/**
 * Simple JSONPath-like query extraction
 * Supports dot notation and bracket notation
 * Examples: "users.0.name", "users[0].name", "data.items[*].id"
 */
export function extractJSONPath(data: any, path: string): any {
  if (!path) return data;
  
  // Split path into segments
  const segments = path.split(/\.|\[|\]/).filter(segment => segment !== '');
  
  let current = data;
  
  for (const segment of segments) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    // Handle array wildcard
    if (segment === '*') {
      if (Array.isArray(current)) {
        return current;
      } else {
        return undefined;
      }
    }
    
    // Handle array index
    if (/^\d+$/.test(segment)) {
      const index = parseInt(segment);
      if (Array.isArray(current)) {
        current = current[index];
      } else {
        return undefined;
      }
    } else {
      // Handle object property
      if (typeof current === 'object' && current !== null) {
        current = current[segment];
      } else {
        return undefined;
      }
    }
  }
  
  return current;
}

/**
 * Generate a tree structure from JSON data for the tree explorer
 */
export interface TreeNode {
  key: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  path: string;
  children?: TreeNode[];
  expanded?: boolean;
}

export function generateTree(data: any, rootKey: string = 'root'): TreeNode {
  function createNode(value: any, key: string, path: string): TreeNode {
    const node: TreeNode = {
      key,
      value,
      type: getValueType(value),
      path,
      expanded: false
    };

    if (Array.isArray(value)) {
      node.children = value.map((item, index) => 
        createNode(item, `[${index}]`, path ? `${path}[${index}]` : `[${index}]`)
      );
    } else if (typeof value === 'object' && value !== null) {
      node.children = Object.entries(value).map(([k, v]) => 
        createNode(v, k, path ? `${path}.${k}` : k)
      );
    }

    return node;
  }

  return createNode(data, rootKey, '');
}

function getValueType(value: any): TreeNode['type'] {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (fallbackError) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Download content as file
 */
export function downloadFile(content: string, filename: string, contentType: string = 'application/json') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read file content
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
} 