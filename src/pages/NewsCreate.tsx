import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreateNewsForm } from '@/components/news/CreateNewsForm';

export default function NewsCreate() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/news');
  };

  const handleCancel = () => {
    navigate('/news');
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Noticia</CardTitle>
          <CardDescription>
            Completa el formulario para crear una nueva noticia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateNewsForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}