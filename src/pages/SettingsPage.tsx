/**
 * Settings Page
 * Tabbed layout: Profile + Account
 */

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, Globe, KeyRound, Mail, Trash2, User } from 'lucide-react'
import {
  useCurrentProfile,
  useUpdateProfile,
  useUploadAvatar,
  useEmailPreferences,
  useUpdateEmailPreferences,
  useChangePassword,
  useDeleteAccount,
} from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import { isAbortError } from '@/lib/errors'
import { useZodForm } from '@/lib/forms/use-zod-form'
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@/lib/validations'
import { PageHeader } from '@/components/ui/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { AvatarUpload } from '@/components/upload/AvatarUpload'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'profile'
  const { user } = useAuth()

  const { data: profile, isLoading, isError, error } = useCurrentProfile()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const { data: emailPrefs, isLoading: emailPrefsLoading } =
    useEmailPreferences()
  const updateEmailPrefs = useUpdateEmailPreferences()
  const changePassword = useChangePassword()
  const deleteAccount = useDeleteAccount()

  // Profile form
  const profileForm = useZodForm(updateProfileSchema, {
    defaultValues: {
      first_name: '',
      last_name: '',
      display_name: '',
      bio: '',
      city: '',
      website: '',
      phone: '',
    },
  })

  // Password form
  const passwordForm = useZodForm(changePasswordSchema, {
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Populate profile form when data loads
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        website: profile.website || '',
        phone: profile.phone || '',
      })
    }
  }, [profile, profileForm])

  const onProfileSubmit = (data: UpdateProfileInput) => {
    updateProfile.mutate(data)
  }

  const onPasswordSubmit = (data: ChangePasswordInput) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => passwordForm.reset() }
    )
  }

  const handleAvatarUpload = async (file: File) => {
    uploadAvatar.mutate(file)
  }

  // Check if user has email/password auth (vs OAuth-only)
  const hasPasswordAuth = user?.identities?.some(
    (identity) => identity.provider === 'email'
  )

  // Check if user has Google OAuth connected
  const hasGoogleAuth = user?.identities?.some(
    (identity) => identity.provider === 'google'
  )

  const bioValue = profileForm.watch('bio') ?? ''

  // Loading state
  if (isLoading) {
    return (
      <div data-testid="settings-page" className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your profile and account"
        />
        <LoadingSpinner fullScreen={false} />
      </div>
    )
  }

  // Error state (skip abort errors from StrictMode)
  if (isError && !isAbortError(error)) {
    return (
      <div data-testid="settings-page" className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your profile and account"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load profile</AlertTitle>
          <AlertDescription>
            {error?.message ?? 'Please try again'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const displayName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')

  return (
    <div data-testid="settings-page" className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and account"
      />

      <Tabs
        value={tab}
        onValueChange={(value) => setSearchParams({ tab: value })}
      >
        <TabsList>
          <TabsTrigger value="profile" data-testid="tab-profile">
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" data-testid="tab-account">
            Account
          </TabsTrigger>
        </TabsList>

        {/* ──── Profile Tab ──── */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar upload */}
              <div className="flex justify-center">
                <AvatarUpload
                  currentAvatarUrl={profile?.avatar_url}
                  onUpload={handleAvatarUpload}
                  uploading={uploadAvatar.isPending}
                  userName={displayName}
                />
              </div>

              <Separator />

              {/* Profile form */}
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
                data-testid="settings-form"
              >
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display name</Label>
                  <Input
                    id="display_name"
                    placeholder="How others see you"
                    data-testid="settings-display-name"
                    {...profileForm.register('display_name')}
                  />
                  {profileForm.formState.errors.display_name && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.display_name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      data-testid="settings-first-name"
                      {...profileForm.register('first_name')}
                    />
                    {profileForm.formState.errors.first_name && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      data-testid="settings-last-name"
                      {...profileForm.register('last_name')}
                    />
                    {profileForm.formState.errors.last_name && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    rows={3}
                    data-testid="settings-bio"
                    {...profileForm.register('bio')}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {bioValue.length}/500
                  </p>
                  {profileForm.formState.errors.bio && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Where are you based?"
                    data-testid="settings-city"
                    {...profileForm.register('city')}
                  />
                  {profileForm.formState.errors.city && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    data-testid="settings-website"
                    {...profileForm.register('website')}
                  />
                  {profileForm.formState.errors.website && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.website.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+49 123 456 7890"
                    data-testid="settings-phone"
                    {...profileForm.register('phone')}
                  />
                  {profileForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={
                      updateProfile.isPending || !profileForm.formState.isDirty
                    }
                    data-testid="settings-save"
                  >
                    {updateProfile.isPending ? 'Saving...' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ──── Account Tab ──── */}
        <TabsContent value="account" className="mt-6 space-y-6">
          {/* Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="account-email">Email address</Label>
                <Input
                  id="account-email"
                  type="email"
                  value={profile?.email ?? ''}
                  disabled
                  data-testid="settings-email"
                />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email address
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Connected Accounts
              </CardTitle>
              <CardDescription>
                Authentication methods linked to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasPasswordAuth && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email & Password</p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              )}
              {hasGoogleAuth && (
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                </div>
              )}
              {!hasPasswordAuth && !hasGoogleAuth && (
                <p className="text-sm text-muted-foreground">
                  No connected accounts found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card data-testid="email-preferences-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose which email notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {emailPrefsLoading ? (
                <LoadingSpinner fullScreen={false} />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="booking-emails">Booking updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified when you receive or update a booking
                      </p>
                    </div>
                    <Switch
                      id="booking-emails"
                      data-testid="toggle-booking-emails"
                      checked={emailPrefs?.booking_emails ?? true}
                      disabled={updateEmailPrefs.isPending}
                      onCheckedChange={(checked) =>
                        updateEmailPrefs.mutate({ booking_emails: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="message-emails">New messages</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified when someone sends you a message
                      </p>
                    </div>
                    <Switch
                      id="message-emails"
                      data-testid="toggle-message-emails"
                      checked={emailPrefs?.message_emails ?? true}
                      disabled={updateEmailPrefs.isPending}
                      onCheckedChange={(checked) =>
                        updateEmailPrefs.mutate({ message_emails: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing</Label>
                      <p className="text-xs text-muted-foreground">
                        Occasional updates about new features
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      data-testid="toggle-marketing-emails"
                      checked={emailPrefs?.marketing_emails ?? false}
                      disabled={updateEmailPrefs.isPending}
                      onCheckedChange={(checked) =>
                        updateEmailPrefs.mutate({ marketing_emails: checked })
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Change Password (only if email/password auth) */}
          {hasPasswordAuth && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                  data-testid="password-form"
                >
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      data-testid="settings-current-password"
                      {...passwordForm.register('currentPassword')}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      data-testid="settings-new-password"
                      {...passwordForm.register('newPassword')}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      data-testid="settings-confirm-password"
                      {...passwordForm.register('confirmPassword')}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={changePassword.isPending}
                      data-testid="settings-change-password"
                    >
                      {changePassword.isPending
                        ? 'Changing...'
                        : 'Change password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    data-testid="settings-delete-account"
                  >
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all
                      associated data including your profile, bookings, and
                      messages. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteAccount.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      data-testid="confirm-delete-account"
                    >
                      {deleteAccount.isPending
                        ? 'Deleting...'
                        : 'Yes, delete my account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage
