import { useState } from "react";
import { toast } from "sonner";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Agent } from "@/utils/api";

interface AgentContactFormProps {
  agent: Agent;
  userEmail?: string;
  userName?: string;
}

const AgentContactForm = ({
  agent,
  userEmail = "",
  userName = "",
}: AgentContactFormProps) => {
  const [email, setEmail] = useState(userEmail);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userEmail && !email.trim()) {
      newErrors.email = "Email is required";
    } else if (!userEmail && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      if (!userEmail) setEmail("");
      setMessage("");

      // Show success notification
      toast.success("Message Sent!", {
        description: `Your message has been delivered to ${
          agent.name.split(" ")[0]
        }`,
      });
    } catch (err) {
      toast.error("Message Failed", {
        description: "Could not send your message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-card rounded-lg shadow-md overflow-hidden text-accent-foreground">
      <CardTitle className="text-xl text-center font-bold ">
        Contact {agent.name.split(" ")[0]}
      </CardTitle>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Name */}
          {userName && (
            <div className="space-y-2">
              <label className="block text-sm font-medium ">Your Name</label>
              <Input
                value={userName}
                disabled
                className="bg-gray-50 cursor-pointer"
              />
            </div>
          )}

          {/* User Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Your Email {!userEmail && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!userEmail}
              className={userEmail ? "bg-gray-50 cursor-not-allowed" : ""}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Agent Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Agent's Email</label>
            <Input
              value={agent.email}
              disabled
              className="bg-gray-50 font-medium"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="block text-sm font-medium ">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I'm interested in this property. Please contact me to schedule a viewing..."
              rows={5}
              className="min-h-[120px]"
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-chart-2 transition-all duration-500 hover:text-foreground/90 ease-in-out cursor-pointer text-background font-medium py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Message...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgentContactForm;
