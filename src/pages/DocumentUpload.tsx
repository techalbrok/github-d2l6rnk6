import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDocuments } from '@/hooks/use-documents';

export default function DocumentUpload() {
  const navigate = useNavigate();
  const { createDocument, isLoading } = useDocuments();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      await createDocument({
        title: file.name,
        file
      });
      navigate('/documents');
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Subir Documento</CardTitle>
          <CardDescription>
            Selecciona un archivo para subir al repositorio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                {file ? file.name : 'Haz clic para seleccionar un archivo'}
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/documents')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!file || isLoading}>
                {isLoading ? 'Subiendo...' : 'Subir Documento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}