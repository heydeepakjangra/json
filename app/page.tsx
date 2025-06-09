import JSONFormatter from '@/components/json-formatter';

export default function Home() {
  return (
    <main>
      {/* Hidden SEO content for search engines */}
      <div className="sr-only">
        <h1>JSON Formatter & Explorer - Free Online JSON Tools</h1>
        <p>
          Professional JSON formatter, validator, and explorer with real-time validation, 
          tree view, JSON comparison, search functionality, and more. Free online tool for developers.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Format and pretty-print JSON with customizable indentation</li>
          <li>Real-time JSON validation with detailed error messages</li>
          <li>Side-by-side JSON comparison with diff highlighting</li>
          <li>Interactive tree view explorer with expand/collapse</li>
          <li>Advanced search and highlighting across JSON data</li>
          <li>JSONPath query support for data extraction</li>
          <li>Export to CSV format for arrays of objects</li>
          <li>Dark and light theme support</li>
          <li>Progressive Web App with offline support</li>
          <li>Privacy-focused - all processing happens in your browser</li>
        </ul>
        <h2>How to Use</h2>
        <ol>
          <li>Paste your JSON data into the editor</li>
          <li>Use the Format button to pretty-print your JSON</li>
          <li>Switch to Tree View to explore data structure</li>
          <li>Use Compare tab to diff two JSON documents</li>
          <li>Search for specific keys or values</li>
          <li>Export your data as JSON or CSV</li>
        </ol>
      </div>
      
      <JSONFormatter />
    </main>
  );
}
