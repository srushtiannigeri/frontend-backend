import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonaSelector } from "@/components/PersonaSelector";
import { CaseStateMachine } from "@/components/CaseStateMachine";
import { EncryptedUpload } from "@/components/EncryptedUpload";
import { StateIndicator } from "@/components/StateIndicator";
import {
  Plus,
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  AlertCircle,
  Eye,
  ShieldCheck,
  History,
  Lock,
} from "lucide-react";

type Persona = "owner" | "nominee" | "access_nominee" | "reviewer" | "verifier" | "issuer";

type CaseState =
  | "draft"
  | "active"
  | "trigger_submitted"
  | "under_review"
  | "verified"
  | "release_authorized"
  | "released";

interface VaultedAsset {
  hash: string;
  wrappedKey: string;
  fileName: string;
  timestamp: string;
  asset?: {
    asset_id: string;
    encrypted_cid: string;
    title: string;
    created_at: string;
  };
}

export function Dashboard() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>("owner");
  const [caseState, setCaseState] = useState<CaseState>("draft");
  const [vaultedAssets, setVaultedAssets] = useState<VaultedAsset[]>([]);

  // Load simulated assets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("certisure_vault");
    if (saved) {
      try {
        setVaultedAssets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse vault", e);
      }
    }
  }, []);

  /**
   * Role 4 Workflow: Actions now simulate real transactions that update the 
   * state machine. In production, these are writeContract calls.
   */
  const simulateTransaction = (nextState: CaseState) => {
    setCaseState(nextState);
    console.log(`Transaction successful: State moved to ${nextState}`);
  };

  const handleUploadComplete = (payload: { hash: string; wrappedKey: string; fileName: string; asset?: any }) => {
    const newAsset: VaultedAsset = {
      ...payload,
      timestamp: new Date().toLocaleString(),
      asset: payload.asset,
    };
    const updatedVault = [newAsset, ...vaultedAssets];
    setVaultedAssets(updatedVault);
    localStorage.setItem("certisure_vault", JSON.stringify(updatedVault));
  };

  return (
    <section id="dashboard" className="py-20 bg-gradient-mesh min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Protocol <span className="text-gradient">Workspace</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Authorized stakeholder interface. Every action is cryptographically signed and 
            gated by the immutable on-chain state.
          </p>
        </div>

        {/* Persona Selector */}
        <div className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-center text-primary">
            Assume Stakeholder Identity
          </h3>
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSelect={setSelectedPersona}
          />
        </div>

        {/* Protocol Status Tracker */}
        <Card variant="gradient" className="mb-12 border-primary/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <StateIndicator 
                state={caseState === "under_review" ? "review" : caseState === "trigger_submitted" ? "pending" : caseState === "release_authorized" ? "verified" : caseState} 
                showLabel={false} 
              />
              Live Protocol State
            </CardTitle>
            <CardDescription>
              On-chain synchronization active. Logic gates are enforced based on current block state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CaseStateMachine currentState={caseState} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1. Workflow Actions Card */}
          <Card variant="glass" className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase">Workflow Actions</CardTitle>
              <CardDescription>
                Permissions for: {selectedPersona.replace("_", " ")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPersona === "owner" && (
                <>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 mb-4">
                    <p className="text-xs text-gray-400">Step 1: Upload and Encrypt Assets.</p>
                    <p className="text-xs text-gray-400">Step 2: Sign to activate nomination.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 border-primary/50 text-primary hover:bg-primary/10" 
                    disabled={caseState !== "draft" || vaultedAssets.length === 0}
                    onClick={() => simulateTransaction("active")}
                  >
                    <FileText className="w-4 h-4" />
                    Sign & Activate Nomination
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2" disabled={caseState === "released"}>
                    <Eye className="w-4 h-4" />
                    View & Decrypt Vault
                  </Button>
                </>
              )}

              {selectedPersona === "access_nominee" && (
                <>
                  <Button 
                    variant="warning" 
                    className="w-full justify-start gap-2" 
                    disabled={caseState !== "active"}
                    onClick={() => simulateTransaction("trigger_submitted")}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Submit Death Trigger
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    disabled={caseState !== "trigger_submitted"}
                    onClick={() => simulateTransaction("under_review")}
                  >
                    <Plus className="w-4 h-4" />
                    Upload Evidence (PDF)
                  </Button>
                </>
              )}

              {selectedPersona === "reviewer" && (
                <>
                  <Button 
                    variant="success" 
                    className="w-full justify-start gap-2" 
                    disabled={caseState !== "under_review"}
                    onClick={() => simulateTransaction("verified")}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Evidence Integrity
                  </Button>
                  <Button variant="destructive" className="w-full justify-start gap-2" disabled={caseState !== "under_review"}>
                    <XCircle className="w-4 h-4" />
                    Reject: Invalid Documents
                  </Button>
                </>
              )}

              {selectedPersona === "verifier" && (
                <Button 
                  variant="success" 
                  className="w-full justify-start gap-2" 
                  disabled={caseState !== "verified"}
                  onClick={() => simulateTransaction("release_authorized")}
                >
                  <Lock className="w-4 h-4" />
                  Final Release Authorization
                </Button>
              )}

              {selectedPersona === "nominee" && (
                <>
                  <Button 
                    variant="hero" 
                    className="w-full justify-start gap-2" 
                    disabled={caseState !== "release_authorized"}
                    onClick={() => simulateTransaction("released")}
                  >
                    <Download className="w-4 h-4" />
                    Claim & Decrypt Assets
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <History className="w-4 h-4" />
                    Download Audit Report
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* 2. Encryption Gateway & Audit Table */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Zero-Knowledge Gateway
                </h3>
                <EncryptedUpload onUploadComplete={handleUploadComplete} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Secured Asset Registry
                </h3>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md">
                  <table className="w-full text-left text-[11px] text-gray-400">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="p-3">Asset</th>
                        <th className="p-3">On-Chain Hash</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaultedAssets.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-10 text-center text-gray-600 italic">
                            No assets secured yet.
                          </td>
                        </tr>
                      ) : (
                        vaultedAssets.map((asset, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-3 font-medium text-white max-w-[80px] truncate">{asset.fileName}</td>
                            <td className="p-3 font-mono text-primary truncate max-w-[100px]">
                              {asset.asset?.encrypted_cid || asset.hash}
                            </td>
                            <td className="p-3 text-[9px] font-black text-green-500">
                              {asset.asset ? 'IPFS STORED' : 'VAULTED'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}