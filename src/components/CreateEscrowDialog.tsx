import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';

interface CreateEscrowDialogProps {
  onSubmit: (description: string, freelancer: string, amount: string) => Promise<number>;
  isLoading: boolean;
}

export const CreateEscrowDialog: React.FC<CreateEscrowDialogProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [freelancer, setFreelancer] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!freelancer.match(/^0x[a-fA-F0-9]{40}$/)) {
      newErrors.freelancer = 'Invalid Ethereum address';
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    await onSubmit(description, freelancer, amount);
    setDescription('');
    setFreelancer('');
    setAmount('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 font-semibold">
          <Plus className="h-4 w-4" />
          Create Escrow
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/20 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-text">Create New Escrow</DialogTitle>
          <DialogDescription>
            Create a secure escrow contract for your freelance job. Funds will be held until work is approved.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="freelancer">Freelancer Address</Label>
            <Input
              id="freelancer"
              placeholder="0x..."
              value={freelancer}
              onChange={(e) => setFreelancer(e.target.value)}
              className="font-mono bg-secondary/50 border-border focus:border-primary"
            />
            {errors.freelancer && (
              <p className="text-xs text-destructive">{errors.freelancer}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the work to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 bg-secondary/50 border-border focus:border-primary resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-12 bg-secondary/50 border-border focus:border-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ETH
              </span>
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Escrow
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
