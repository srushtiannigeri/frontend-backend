import { useConnect, useAccount } from 'wagmi';
import { useNavigate, Link } from "react-router-dom"; 
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; 
import { ShieldCheck, Mail, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [isVerifying, setIsVerifying] = useState(false);
  
  // State for the three mandatory legal consents
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [readPrivacy, setReadPrivacy] = useState(false);
  const [consentData, setConsentData] = useState(false);

  const { connect, connectors } = useConnect({
    mutation: {
      onSuccess: () => {
        setIsVerifying(false);
        toast.success("Wallet Connected!");
        // Navigate directly to home when wallet connects
        setTimeout(() => navigate("/home"), 500);
      },
      onError: (error) => {
        setIsVerifying(false);
        toast.error(`Verification Failed: ${error.message}`);
      }
    }
  });

  // Auto-navigate if wallet is already connected
  useEffect(() => {
    if (isConnected) {
      navigate("/home");
    }
  }, [isConnected, navigate]);

  const handleWeb3AuthLogin = () => {
    // Role 4 Enforcement: Ensure all gates are open
    if (!agreedTerms || !readPrivacy || !consentData) {
      toast.error("Please provide all required consents to proceed.");
      return;
    }
    setIsVerifying(true);
    const web3authConnector = connectors.find((c) => c.id === "web3auth");
    if (web3authConnector) {
      connect({ connector: web3authConnector });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
      <Card className="w-full max-w-md bg-glass/60 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Certisure Connect</CardTitle>
          <CardDescription className="text-gray-400">Identity & Trust Protocol</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pb-10">
          {/* Legal Consent Section - Matching your Screenshot */}
          <div className="space-y-4 p-5 rounded-xl bg-black/40 border border-white/10 shadow-inner">
            <div className="flex items-center space-x-3 group">
              <Checkbox 
                id="terms" 
                checked={agreedTerms} 
                onCheckedChange={(checked) => setAgreedTerms(!!checked)}
                className="border-white/20 data-[state=checked]:bg-primary"
              />
              <label htmlFor="terms" className="text-[13px] text-gray-200 cursor-pointer select-none">
                I agree to the <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
              </label>
            </div>

            <div className="flex items-center space-x-3 group">
              <Checkbox 
                id="privacy" 
                checked={readPrivacy} 
                onCheckedChange={(checked) => setReadPrivacy(!!checked)}
                className="border-white/20 data-[state=checked]:bg-primary"
              />
              <label htmlFor="privacy" className="text-[13px] text-gray-200 cursor-pointer select-none">
                I have read the <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
              </label>
            </div>

            <div className="pt-2">
              <div className="flex items-start space-x-3 group">
                <Checkbox 
                  id="data-consent" 
                  checked={consentData} 
                  onCheckedChange={(checked) => setConsentData(!!checked)}
                  className="mt-1 border-white/20 data-[state=checked]:bg-primary"
                />
                <div className="space-y-2">
                  <label htmlFor="data-consent" className="text-[13px] text-gray-200 leading-tight cursor-pointer select-none">
                    I consent to the processing of my personal data for:
                  </label>
                  <ul className="text-[11px] text-gray-500 space-y-1 pl-4 border-l border-white/10 ml-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary/40" /> Account creation</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary/40" /> Case management</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary/40" /> Nominee assignment</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary/40" /> Legal verification & release</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleWeb3AuthLogin} 
            disabled={isVerifying || !agreedTerms || !readPrivacy || !consentData}
            className="w-full gap-3 py-7 text-lg font-bold shadow-lg transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
          >
            {isVerifying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            {isVerifying ? "Verifying..." : "Sign in with Social / Email"}
          </Button>

          <div className="flex items-center justify-center gap-2 opacity-30">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-widest font-medium text-white">
              End-to-End Encryption Enforced
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}