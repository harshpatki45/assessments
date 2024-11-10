import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DocumentCapture = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a document first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process document');
      }

      setExtractedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Document Information Extractor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
              </label>
            </div>

            {/* Preview Section */}
            {preview && (
              <div className="mt-4">
                <img 
                  src={preview} 
                  alt="Document preview" 
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Extract Information'}
            </button>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results Display */}
            {extractedData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Extracted Information:</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="font-medium">Name:</dt>
                    <dd>{extractedData.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Document Number:</dt>
                    <dd>{extractedData.documentNumber}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Expiration Date:</dt>
                    <dd>{extractedData.expirationDate}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentCapture;