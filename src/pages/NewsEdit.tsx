import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNews } from '@/hooks/use-news';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NewsEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNews, updateNews, isLoading } = useNews();
  const [news, setNews] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const newsData = await getNews(id);
        setNews(newsData);
      } catch (error) {
        setError('No se pudo cargar la noticia');
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [id, getNews]);

  const handleSuccess = () => {
    navigate('/news');
  };

  const handleCancel = () => {
    navigate('/news');
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Link to="/news" className="ml-2 underline">
            Volver a noticias
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (!news && isLoading) {
    return <div>Cargando...</div>;
  }

  if (!news) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-medium mb-2">Noticia no encontrada</h2>
        <Button asChild>
          <Link to="/news">Volver a noticias</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Noticia</CardTitle>
          <CardDescription>
            Modifica los detalles de la noticia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add your edit form component here */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSuccess}>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}