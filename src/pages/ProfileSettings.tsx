
import MainLayout from '@/components/layout/MainLayout';
import ProfileSettingsComponent from '@/components/profile/ProfileSettings';

const ProfileSettings = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте настройками вашего аккаунта
          </p>
        </div>
        
        <ProfileSettingsComponent />
      </div>
    </MainLayout>
  );
};

export default ProfileSettings;
