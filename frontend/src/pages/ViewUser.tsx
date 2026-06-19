import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  User as UserIcon,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useUser, useDeleteUser } from '../hooks/useUsers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ViewUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError, error } = useUser(id!);
  const deleteUser = useDeleteUser();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser.mutateAsync(user.id);
      toast.success(`${user.name} deleted successfully`);
      navigate('/');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay message={(error as Error)?.message} onRetry={() => window.location.reload()} />;
  if (!user) return <ErrorDisplay message="User not found" />;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="btn btn--ghost" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
            <ArrowLeft size={16} />
            Back to Users
          </button>
          <h1 className="page-header__title">{user.name}</h1>
          <p className="page-header__subtitle">
            <span className={`badge badge--${user.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
              <span className="badge__dot" />
              {user.status}
            </span>
            <span style={{ marginLeft: '12px', color: 'var(--color-text-muted)' }}>
              Version {user.version}
            </span>
          </p>
        </div>
        <div className="page-header__actions">
          <Link to={`/users/${user.id}/edit`} className="btn btn--secondary">
            <Pencil size={16} />
            Edit
          </Link>
          <button className="btn btn--danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="card card--elevated">
        {/* Personal Info */}
        <div className="detail-section">
          <h3 className="detail-section__title">
            <UserIcon size={16} /> Personal Information
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item__label">Full Name</span>
              <span className="detail-item__value">{user.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Date of Birth</span>
              <span className="detail-item__value">
                <Calendar size={14} style={{ marginRight: '6px', opacity: 0.5, verticalAlign: 'text-bottom' }} />
                {formatDate(user.dateOfBirth)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Place of Birth</span>
              <span className="detail-item__value">{user.placeOfBirth}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Gender</span>
              <span className="detail-item__value">{user.gender || '—'}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="detail-section">
          <h3 className="detail-section__title">
            <Phone size={16} /> Contact Information
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item__label">Email</span>
              <span className="detail-item__value">
                <Mail size={14} style={{ marginRight: '6px', opacity: 0.5, verticalAlign: 'text-bottom' }} />
                {user.email}
                {user.emailVerified && (
                  <span className="badge badge--active" style={{ marginLeft: '8px', fontSize: '10px' }}>
                    Verified
                  </span>
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Primary Mobile</span>
              <span className="detail-item__value">
                <Phone size={14} style={{ marginRight: '6px', opacity: 0.5, verticalAlign: 'text-bottom' }} />
                {user.primaryMobile}
                {user.mobileVerified && (
                  <span className="badge badge--active" style={{ marginLeft: '8px', fontSize: '10px' }}>
                    Verified
                  </span>
                )}
              </span>
            </div>
            {user.secondaryMobile && (
              <div className="detail-item">
                <span className="detail-item__label">Secondary Mobile</span>
                <span className="detail-item__value">{user.secondaryMobile}</span>
              </div>
            )}
          </div>
        </div>

        {/* Identity Documents */}
        <div className="detail-section">
          <h3 className="detail-section__title">
            <CreditCard size={16} /> Identity Documents
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item__label">Aadhaar Number</span>
              <span className="detail-item__value" style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>
                <Shield size={14} style={{ marginRight: '6px', opacity: 0.5, verticalAlign: 'text-bottom' }} />
                {user.aadhaar.replace(/(\d{4})/g, '$1 ').trim()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">PAN Number</span>
              <span className="detail-item__value" style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>
                {user.pan}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="detail-section">
          <h3 className="detail-section__title">
            <MapPin size={16} /> Address Information
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item__label">Current Address</span>
              <span className="detail-item__value">{user.currentAddress}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Permanent Address</span>
              <span className="detail-item__value">{user.permanentAddress}</span>
            </div>
          </div>
        </div>

        {/* Audit Info */}
        <div className="detail-section">
          <h3 className="detail-section__title">
            <Clock size={16} /> Audit Trail
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item__label">Created At</span>
              <span className="detail-item__value">{formatDateTime(user.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Updated At</span>
              <span className="detail-item__value">{formatDateTime(user.updatedAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Created By</span>
              <span className="detail-item__value">{user.createdBy}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Updated By</span>
              <span className="detail-item__value">{user.updatedBy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${user.name}? This action will soft-delete the user.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
