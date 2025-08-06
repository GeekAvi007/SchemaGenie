import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Upload, 
  Code, 
  FileText, 
  Braces, 
  Figma, 
  Copy, 
  Database,
  Zap,
  Star,
  Github,
  Mail,
  Shield,
  BookOpen,
  Lightbulb,
  Sparkles,
  Download,
  Network
} from 'lucide-react';

interface GeneratedResult {
  schema: string;
  erdImageUrl?: string;
  apiRoutes?: string;
  explanation?: string;
}

// Mermaid Diagram Component
function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      mermaid.initialize({
        theme: 'base',
        themeVariables: {
          primaryColor: '#6366f1',
          primaryTextColor: '#374151',
          primaryBorderColor: '#6366f1',
          lineColor: '#6b7280',
          sectionBkgColor: '#f9fafb',
          altSectionBkgColor: '#ffffff',
          gridColor: '#e5e7eb',
          c0: '#f9fafb',
          c1: '#f3f4f6',
          c2: '#e5e7eb',
          c3: '#d1d5db'
        }
      });

      const id = `mermaid-${Date.now()}`;
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return <div ref={ref} className="w-full" />;
}

export default function Index() {
  const [selectedInputType, setSelectedInputType] = useState('react');
  const [inputCode, setInputCode] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [outputFormat, setOutputFormat] = useState('prisma');
  const [databaseType, setDatabaseType] = useState('postgresql');
  const [suggestAPI, setSuggestAPI] = useState(true);
  const [generateERD, setGenerateERD] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputCode(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        inputCode: selectedInputType === 'figma' ? figmaUrl : inputCode,
        inputType: selectedInputType,
        options: {
          outputFormat,
          databaseType,
          suggestAPI,
          generateERD
        }
      };

      const response = await fetch('/api/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to generate schema:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="text-center space-y-4 lg:space-y-6 mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            SchemaGenie
          </h1>

          <h2 className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-medium px-4">
            Turn Your Frontend into a Smart Backend Instantly
          </h2>

          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Upload your UI/UX designs or frontend code — and get the optimal DB schema,
            API structure, and ER diagrams — powered by AI.
          </p>
          
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold">
            <Zap className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>

        {/* Main Application Interface */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Left Column - Input and Settings */}
          <div className="space-y-6">
            {/* Upload/Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Input Your Frontend Code or Design
                </CardTitle>
                <CardDescription>
                  Choose your input method and paste or upload your frontend assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedInputType} onValueChange={setSelectedInputType}>
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="react" className="flex items-center gap-1 text-xs lg:text-sm">
                      <Code className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="hidden sm:inline">React</span>
                      <span className="sm:hidden">JSX</span>
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex items-center gap-1 text-xs lg:text-sm">
                      <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
                      HTML
                    </TabsTrigger>
                    <TabsTrigger value="json" className="flex items-center gap-1 text-xs lg:text-sm">
                      <Braces className="w-3 h-3 lg:w-4 lg:h-4" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="figma" className="flex items-center gap-1 text-xs lg:text-sm">
                      <Figma className="w-3 h-3 lg:w-4 lg:h-4" />
                      Figma
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="react" className="mt-4">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".js,.jsx,.ts,.tsx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="react-upload"
                        />
                        <label htmlFor="react-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drop your React component file here or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Supports .js, .jsx, .ts, .tsx files
                          </p>
                        </label>
                      </div>
                      <Textarea
                        placeholder="Or paste your React component code here..."
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="min-h-32 font-mono text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="html" className="mt-4">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".html,.htm"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="html-upload"
                        />
                        <label htmlFor="html-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drop your HTML file here or click to upload
                          </p>
                        </label>
                      </div>
                      <Textarea
                        placeholder="Or paste your HTML code here..."
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="min-h-32 font-mono text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="json" className="mt-4">
                    <Textarea
                      placeholder="Paste your JSON form fields here..."
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="min-h-32 font-mono text-sm"
                    />
                  </TabsContent>

                  <TabsContent value="figma" className="mt-4">
                    <Input
                      placeholder="Enter Figma file URL (e.g., https://figma.com/file/...)"
                      value={figmaUrl}
                      onChange={(e) => setFigmaUrl(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* AI Settings Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  AI Generation Settings
                </CardTitle>
                <CardDescription>
                  Configure how you want your schema generated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="output-format">Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger id="output-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prisma">Prisma Schema</SelectItem>
                        <SelectItem value="sql">SQL</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                        <SelectItem value="firebase">Firebase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="database-type">Database Type</Label>
                    <Select value={databaseType} onValueChange={setDatabaseType}>
                      <SelectTrigger id="database-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                        <SelectItem value="firebase">Firebase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="suggest-api" className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Also suggest API Routes
                    </Label>
                    <Switch
                      id="suggest-api"
                      checked={suggestAPI}
                      onCheckedChange={setSuggestAPI}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="generate-erd" className="flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      Generate ER Diagram
                    </Label>
                    <Switch
                      id="generate-erd"
                      checked={generateERD}
                      onCheckedChange={setGenerateERD}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || (!inputCode && !figmaUrl)} 
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Schema...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Schema
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {/* Output Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Generated Output
                </CardTitle>
                <CardDescription>
                  Your AI-generated database schema and API structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="schema">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="schema">Generated Schema</TabsTrigger>
                    <TabsTrigger value="erd">ER Diagram</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="schema" className="mt-4">
                    <div className="space-y-4">
                      {result?.schema ? (
                        <div className="relative">
                          <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-96 overflow-auto">
                            <pre className="whitespace-pre-wrap">{result.schema}</pre>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(result.schema)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-muted rounded-lg p-8 text-center text-muted-foreground">
                          <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Your generated schema will appear here</p>
                          <p className="text-sm mt-2">Upload code and click "Generate Schema" to get started</p>
                        </div>
                      )}

                      {result?.apiRoutes && (
                        <div className="relative">
                          <Label className="text-sm font-medium">Suggested API Routes</Label>
                          <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-64 overflow-auto mt-2">
                            <pre className="whitespace-pre-wrap">{result.apiRoutes}</pre>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-6 right-2"
                            onClick={() => copyToClipboard(result.apiRoutes || '')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="erd" className="mt-4">
                    <div className="bg-card border rounded-lg p-4 min-h-64">
                      {result?.erdImageUrl ? (
                        <div className="w-full overflow-auto">
                          <MermaidDiagram chart={result.erdImageUrl.startsWith('data:') ? atob(result.erdImageUrl.split(',')[1]) : result.erdImageUrl} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                          <div className="text-center">
                            <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>ER Diagram will be generated here</p>
                            <p className="text-sm mt-2">Enable "Generate ER Diagram" in settings</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* AI Explanation Box */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI Explanation
                  </CardTitle>
                  <Switch
                    checked={showExplanation}
                    onCheckedChange={setShowExplanation}
                  />
                </div>
                <CardDescription>
                  Understand the reasoning behind the generated schema
                </CardDescription>
              </CardHeader>
              {showExplanation && (
                <CardContent>
                  {result?.explanation ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">AI explanation will appear here after generation</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Made with <span className="text-red-500">💡</span> by SchemaGenie Team
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
