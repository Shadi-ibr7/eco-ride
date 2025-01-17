import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onLoginSuccess: (password: string, isTemporary: boolean) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log("Attempting login for email:", normalizedEmail);
      
      // First, check if the email is authorized
      const { data: employee, error: employeeError } = await supabase
        .from("authorized_employees")
        .select("email")
        .eq("email", normalizedEmail)
        .maybeSingle();

      console.log("Authorization check result:", { employee, employeeError });

      if (employeeError) {
        console.error("Error checking employee authorization:", employeeError);
        toast.error("Erreur lors de la vérification de l'autorisation");
        setIsLoading(false);
        return;
      }

      if (!employee) {
        console.log("Email not found in authorized_employees table:", normalizedEmail);
        toast.error("Cet email n'est pas autorisé à accéder à l'espace employé");
        setIsLoading(false);
        return;
      }

      console.log("Email authorized, proceeding with login attempt");

      // Proceed with login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        if (error.message === "Invalid login credentials") {
          toast.error("Email ou mot de passe incorrect");
        } else {
          toast.error("Erreur lors de la connexion");
        }
        setIsLoading(false);
        return;
      }

      console.log("Login successful, checking if password is temporary");

      // Check if this is a temporary password login
      const { data: metadata } = await supabase.auth.getUser();
      const isTemporary = metadata.user?.user_metadata?.is_temporary_password;

      console.log("Login completed successfully", {
        user: metadata.user,
        isTemporary,
      });

      toast.success("Connexion réussie !");
      
      if (isTemporary) {
        onLoginSuccess(password, isTemporary);
      } else {
        navigate("/employee");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background"
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-background"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
};