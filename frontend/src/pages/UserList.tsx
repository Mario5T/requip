import { useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import type { User } from '../types/user';

export default function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // Read params from URL
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const search = searchParams.get('search') || '';

  const { data, isLoading, isError, error, refetch } = useUsers({
    page,
    limit,
    sortBy,
    sortOrder,
    search: search || undefined,
  });
  const deleteUser = useDeleteUser();

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      updateParams({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      updateParams({ sortBy: field, sortOrder: 'asc' });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ search: e.target.value, page: 1 });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted successfully`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown size={12} />;
    return sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay message={(error as Error)?.message} onRetry={() => refetch()} />;

  const users = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header__title">User Management</h1>
          <p className="page-header__subtitle">
            {pagination?.totalRecords || 0} users registered in the system
          </p>
        </div>
        <div className="page-header__actions">
          <Link to="/users/create" className="btn btn--primary">
            <Plus size={16} />
            Add New User
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-bar">
          <Search size={16} className="search-bar__icon" />
          <input
            className="form-input search-bar__input"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="toolbar__spacer" />
        <select
          className="form-input form-select"
          value={limit}
          onChange={(e) => updateParams({ limit: e.target.value, page: 1 })}
          style={{ width: 'auto' }}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Users className="empty-state__icon" />
            <h3 className="empty-state__title">
              {search ? 'No results found' : 'No users yet'}
            </h3>
            <p className="empty-state__text">
              {search
                ? `No users match "${search}". Try a different search term.`
                : 'Get started by adding your first user to the system.'}
            </p>
            {!search && (
              <Link to="/users/create" className="btn btn--primary" style={{ marginTop: '16px' }}>
                <Plus size={16} />
                Add First User
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th
                    className={sortBy === 'name' ? 'th--active' : ''}
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <span className="sort-icon"><SortIcon field="name" /></span>
                  </th>
                  <th
                    className={sortBy === 'email' ? 'th--active' : ''}
                    onClick={() => handleSort('email')}
                  >
                    Email
                    <span className="sort-icon"><SortIcon field="email" /></span>
                  </th>
                  <th>Mobile</th>
                  <th>PAN</th>
                  <th>Status</th>
                  <th
                    className={sortBy === 'createdAt' ? 'th--active' : ''}
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                    <span className="sort-icon"><SortIcon field="createdAt" /></span>
                  </th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.primaryMobile}</td>
                    <td style={{ fontFamily: 'monospace' }}>{user.pan}</td>
                    <td>
                      <span className={`badge badge--${user.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                        <span className="badge__dot" />
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="table__actions" style={{ justifyContent: 'flex-end' }}>
                        <Link to={`/users/${user.id}`} className="btn btn--ghost btn--icon" title="View">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/users/${user.id}/edit`} className="btn btn--ghost btn--icon" title="Edit">
                          <Pencil size={16} />
                        </Link>
                        <button
                          className="btn btn--ghost btn--icon"
                          onClick={() => setDeleteTarget(user)}
                          title="Delete"
                          style={{ color: 'var(--color-accent-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={(p) => updateParams({ page: p })}
            />
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action will soft-delete the user and they will no longer appear in the system.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
