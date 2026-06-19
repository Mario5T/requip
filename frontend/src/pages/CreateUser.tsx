import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateUser } from '../hooks/useUsers';
import UserForm from '../components/UserForm';
import type { CreateUserFormData } from '../utils/validation';
import { AxiosError } from 'axios';

export default function CreateUser() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      await createUser.mutateAsync({
        ...formData,
        secondaryMobile: formData.secondaryMobile || undefined,
        gender: (formData.gender as 'MALE' | 'FEMALE' | 'OTHER') || undefined,
        createdBy: 'system',
      });
      toast.success('User created successfully!');
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<{ message: string; errors?: Array<{ field: string; message: string }> }>;
      const msg = error.response?.data?.message || 'Failed to create user';
      toast.error(msg);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
            <ArrowLeft size={16} />
            Back to Users
          </button>
          <h1 className="page-header__title">Create New User</h1>
          <p className="page-header__subtitle">Fill in the details below to register a new user</p>
        </div>
      </div>

      <UserForm
        onSubmit={handleSubmit}
        isLoading={createUser.isPending}
        submitLabel="Create User"
      />
    </div>
  );
}
