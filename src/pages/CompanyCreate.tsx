import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanies } from '@/hooks/use-companies';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CompanyCreate() {
  const navigate = useNavigate();
  const { createCompany, isLoading } = useCompanies();
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    agentAccessUrl: '',
    contactEmail: '',
    classification: 'Standard'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCompany(formData, {
        onSuccess: () => {
          navigate('/companies');
        }
      });
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/companies">Compañías</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Crear Compañía</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Crear Nueva Compañía</h1>
        <Button variant="outline" asChild>
          <Link to="/companies">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Compañía</CardTitle>
          <CardDescription>
            Introduce los datos de la nueva compañía. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Compañía *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="agentAccessUrl">URL de Acceso para Mediadores</Label>
                  <Input
                    id="agentAccessUrl"
                    value={formData.agentAccessUrl}
                    onChange={(e) => handleChange('agentAccessUrl', e.target.value)}
                    placeholder="acceso.ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="contacto@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="classification">Clasificación</Label>
                  <Select
                    value={formData.classification}
                    onValueChange={(value) => handleChange('classification', value)}
                  >
                    <SelectTrigger id="classification">
                      <SelectValue placeholder="Seleccione una clasificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preferente">Preferente</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Básica">Básica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/companies')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear Compañía'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}