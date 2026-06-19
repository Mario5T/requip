import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserFormSchema, type CreateUserFormData } from '../utils/validation';

interface UserFormProps {
  defaultValues?: Partial<CreateUserFormData>;
  onSubmit: (data: CreateUserFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function UserForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create User',
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      primaryMobile: '',
      secondaryMobile: '',
      aadhaar: '',
      pan: '',
      dateOfBirth: '',
      placeOfBirth: '',
      currentAddress: '',
      permanentAddress: '',
      gender: undefined,
      status: 'ACTIVE',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="card card--elevated animate-slide-up">
        {/* Personal Information */}
        <h3 className="detail-section__title" style={{ marginBottom: '20px' }}>
          📋 Personal Information
        </h3>
        <div className="form-grid" style={{ marginBottom: '32px' }}>
          <div className="form-group">
            <label className="form-label form-label--required" htmlFor="name">Full Name</label>
            <input
              id="name"
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              placeholder="Enter full name"
              {...register('name')}
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="user@example.com"
              {...register('email')}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required" htmlFor="dateOfBirth">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              className={`form-input ${errors.dateOfBirth ? 'form-input--error' : ''}`}
              {...register('dateOfBirth')}
            />
            {errors.dateOfBirth && <span className="form-error">{errors.dateOfBirth.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required" htmlFor="placeOfBirth">Place of Birth</label>
            <input
              id="placeOfBirth"
              className={`form-input ${errors.placeOfBirth ? 'form-input--error' : ''}`}
              placeholder="City of birth"
              {...register('placeOfBirth')}
            />
            {errors.placeOfBirth && <span className="form-error">{errors.placeOfBirth.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="form-input form-select"
              {...register('gender')}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">Status</label>
            <select
              id="status"
              className="form-input form-select"
              {...register('status')}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <h3 className="detail-section__title" style={{ marginBottom: '20px' }}>
          📱 Contact Information
        </h3>
        <div className="form-grid" style={{ marginBottom: '32px' }}>
          <div className="form-group">
            <label className="form-label form-label--required" htmlFor="primaryMobile">Primary Mobile</label>
            <input
              id="primaryMobile"
              className={`form-input ${errors.primaryMobile ? 'form-input--error' : ''}`}
              placeholder="+919876543210"
              {...register('primaryMobile')}
            />
            {errors.primaryMobile && <span className="form-error">{errors.primaryMobile.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="secondaryMobile">Secondary Mobile</label>
            <input
              id="secondaryMobile"
              className={`form-input ${errors.secondaryMobile ? 'form-input--error' : ''}`}
              placeholder="+919876543211 (optional)"
              {...register('secondaryMobile')}
            />
            {errors.secondaryMobile && <span className="form-error">{errors.secondaryMobile.message}</span>}
          </div>
        </div>

        {/* Identity Documents */}
        <h3 className="detail-section__title" style={{ marginBottom: '20px' }}>
          🆔 Identity Documents
        </h3>
        <div className="form-grid" style={{ marginBottom: '32px' }}>
          <div className="form-group">
            <label className="form-label form-label--required" htmlFor="aadhaar">Aadhaar Number</label>
            <input
              id="aadhaar"
              className={`form-input ${errors.aadhaar ? 'form-input--error' : ''}`}
              placeholder="123456789012"
              maxLength={12}
              {...register('aadhaar')}
            />
            {errors.aadhaar && <span className="form-error">{errors.aadhaar.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required" htmlFor="pan">PAN Number</label>
            <input
              id="pan"
              className={`form-input ${errors.pan ? 'form-input--error' : ''}`}
              placeholder="ABCDE1234F"
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
              {...register('pan')}
            />
            {errors.pan && <span className="form-error">{errors.pan.message}</span>}
          </div>
        </div>

        {/* Address Information */}
        <h3 className="detail-section__title" style={{ marginBottom: '20px' }}>
          🏠 Address Information
        </h3>
        <div className="form-grid" style={{ marginBottom: '32px' }}>
          <div className="form-group form-grid--full">
            <label className="form-label form-label--required" htmlFor="currentAddress">Current Address</label>
            <textarea
              id="currentAddress"
              className={`form-input ${errors.currentAddress ? 'form-input--error' : ''}`}
              placeholder="Enter current residential address"
              rows={3}
              {...register('currentAddress')}
            />
            {errors.currentAddress && <span className="form-error">{errors.currentAddress.message}</span>}
          </div>

          <div className="form-group form-grid--full">
            <label className="form-label form-label--required" htmlFor="permanentAddress">Permanent Address</label>
            <textarea
              id="permanentAddress"
              className={`form-input ${errors.permanentAddress ? 'form-input--error' : ''}`}
              placeholder="Enter permanent address"
              rows={3}
              {...register('permanentAddress')}
            />
            {errors.permanentAddress && <span className="form-error">{errors.permanentAddress.message}</span>}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn--primary btn--lg" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
