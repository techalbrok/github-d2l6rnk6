
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers } from '@/hooks/use-users';
import { useBranches } from '@/hooks/use-branches';
import { UserRole, UserType } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// User types
const USER_TYPES = [
  'Administrador',
  'Responsable de Departamento',
  'Delegación',
  'Empleado SSCC',
  'Colaborador'
];

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const { createUser, isLoading } = useUsers();
  const { branches } = useBranches();
  const [error, setError] = useState<string | null>(null);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    type: '',
    branchId: '',
    position: '',
    extension: '',
    socialContact: '',
    password: ''
  });
  
  const handleChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    // Clear error when user changes something
    if (error) setError(null);
  };
  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!userData.name || !userData.email || !userData.role || !userData.type || !userData.branchId || !userData.password) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }
    
    // Password validation - at least 8 characters with letters and numbers
    if (userData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    try {
      createUser({
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        type: userData.type as UserType,
        branchId: userData.branchId,
        position: userData.position || undefined,
        extension: userData.extension || undefined,
        socialContact: userData.socialContact || undefined,
        password: userData.password
      }, {
        onSuccess: () => {
          onSuccess();
        },
        onError: (err) => {
          console.error("Error from createUser in form handler:", err);
          setError(err instanceof Error ? err.message : 'Error al crear el usuario');
        }
      });
    } catch (err) {
      console.error("Exception in createUser form handler:", err);
      setError(err instanceof Error ? err.message : 'Error al crear el usuario');
    }
  };
  
  const renderUserTypeOption = (type: string) => (
    <SelectItem key={type} value={type}>
      {type}
    </SelectItem>
  );
  
  return (
    <form onSubmit={handleCreateUser}>
      <div className="grid gap-4 py-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo *</Label>
            <Input 
              id="name" 
              placeholder="Nombre y apellidos" 
              required 
              value={userData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="correo@ejemplo.com" 
              required 
              value={userData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select 
              required
              value={userData.role}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="delegate">Delegado</SelectItem>
                <SelectItem value="employee">Empleado</SelectItem>
                <SelectItem value="collaborator">Colaborador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Usuario *</Label>
            <Select 
              required
              value={userData.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map(renderUserTypeOption)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="branch">Sucursal *</Label>
            <Select 
              required
              value={userData.branchId}
              onValueChange={(value) => handleChange('branchId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                {branches && branches.length > 0 ? (
                  branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-branches" disabled>
                    No hay sucursales disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Cargo</Label>
            <Input 
              id="position" 
              placeholder="Ej: Director de Departamento" 
              value={userData.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="extension">Extensión</Label>
            <Input 
              id="extension" 
              placeholder="Ej: 123"
              value={userData.extension}
              onChange={(e) => handleChange('extension', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social">Contacto Social</Label>
            <Input 
              id="social" 
              placeholder="Ej: @usuario"
              value={userData.socialContact}
              onChange={(e) => handleChange('socialContact', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña temporal *</Label>
          <Input 
            id="password" 
            type="password" 
            required
            value={userData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="mt-2 sm:mt-0">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
}
