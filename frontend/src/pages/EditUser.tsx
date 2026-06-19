import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser, useUpdateUser } from '../hooks/useUsers';
import UserForm from '../components/UserForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import type { CreateUserFormData } from '../utils/validation';
import { AxiosError } from 'axios';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError, error } = useUser(id!);
  const updateUser = useUpdateUser();

  const handleSubmit = async (formData: CreateUserFormData) => {
    if (!id) return;
    try {
      await updateUser.mutateAsync({
        id,
        payload: {
          ...formData,
          secondaryMobile: formData.secondaryMobile || undefined,
          gender: (formData.gender as 'MALE' | 'FEMALE' | 'OTHER') || undefined,
          updatedBy: 'system',
        },
      });
      toast.success('User updated successfully!');
      navigate(`/users/${id}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to update user');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay message={(error as Error)?.message} onRetry={() => window.location.reload()} />;
  if (!user) return <ErrorDisplay message="User not found" />;

  // Convert user data to form defaults
  const defaults: Partial<CreateUserFormData> = {
    name: user.name,
    email: user.email,
    primaryMobile: user.primaryMobile,
    secondaryMobile: user.secondaryMobile || '',
    aadhaar: user.aadhaar,
    pan: user.pan,
    dateOfBirth: user.dateOfBirth?.split('T')[0] || '',
    placeOfBirth: user.placeOfBirth,
    currentAddress: user.currentAddress,
    permanentAddress: user.permanentAddress,
    gender: user.gender || undefined,
    status: user.status,
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost" onClick={() => navigate(`/users/${id}`)} style={{ marginBottom: '8px' }}>
            <ArrowLeft size={16} />
            Back to User
          </button>
          <h1 className="page-header__title">Edit User</h1>
          <p className="page-header__subtitle">Update the details for {user.name}</p>
        </div>
      </div>

      <UserForm
        defaultValues={defaults}
        onSubmit={handleSubmit}
        isLoading={updateUser.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
