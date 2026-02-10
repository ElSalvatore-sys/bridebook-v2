import { useState } from 'react'
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdminUsers, useUpdateUserRole } from '@/hooks/queries/use-admin'
import type { ProfileRole } from '@/services/profiles'

const ROLES: ProfileRole[] = ['USER', 'ARTIST', 'VENUE', 'ADMIN']

export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useAdminUsers(page, search || undefined)
  const updateRole = useUpdateUserRole()

  const totalPages = data ? Math.ceil(data.total / 20) : 0

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function handleRoleChange(userId: string, role: ProfileRole) {
    if (confirm(`Change this user's role to ${role}?`)) {
      updateRole.mutate({ userId, role })
    }
  }

  return (
    <div className="space-y-6 p-6" data-testid="admin-users">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            data-testid="admin-user-search"
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-md border bg-background pl-10 pr-4 py-2 text-sm"
          />
        </div>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr key={user.id} data-testid={`admin-user-row-${user.id}`} className="border-b">
                  <td className="py-3">{user.display_name ?? `${user.first_name} ${user.last_name}`}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <select
                      data-testid={`admin-role-select-${user.id}`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as ProfileRole)}
                      className="rounded border bg-background px-2 py-1 text-xs"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border p-2 disabled:opacity-50"
            data-testid="admin-users-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border p-2 disabled:opacity-50"
            data-testid="admin-users-next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
