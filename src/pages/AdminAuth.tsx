import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { Car } from "lucide-react";

const AdminAuth = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Car className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Portail Administrateur
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous à votre compte administrateur
          </p>
        </div>

        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;