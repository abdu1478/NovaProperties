import { useAuth } from "@/contexts/AuthContext";
import { submitUserMessage } from "@/utils/api";
import type { EndUserHandler } from "Handlers";
import { useState } from "react";
import { toast } from "sonner";

const ContactSection = () => {
  const [form, setForm] = useState<EndUserHandler>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    subject: "",
  });
  const { user } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        await submitUserMessage({
          ...form,
          sourcePage: window.location.pathname,
          subject: form.subject ?? "",
        });
      } else {
        await submitUserMessage({
          ...form,
          sourcePage: window.location.pathname,
          userId: user.id,
          subject: form.subject ?? "",
        });
        console.log(user.id);
      }
      toast.success("Message sent successfully!");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        message: "",
        subject: "general-inquiry",
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <section
      id="contact"
      className="py-16 bg-background"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4">
        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8 border border-border">
          <header className="mb-8">
            <h3 className="text-2xl font-bold text-foreground">
              Send Us a Message
            </h3>
            <p className="text-muted-foreground mt-2">
              We'll respond within 24 business hours
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name *
                </label>
                <input
                  name="fullName"
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  placeholder="Your name"
                  required
                  aria-required="true"
                  value={form.fullName}
                  onChange={handleChange}
                  aria-label="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  placeholder="your.email@example.com"
                  required
                  aria-required="true"
                  value={form.email}
                  onChange={handleChange}
                  aria-label="Your email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone Number
                </label>
                <input
                  required
                  name="phone"
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  placeholder="(123) 456-7890"
                  value={form.phone}
                  onChange={handleChange}
                  aria-label="Your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Inquiry Type
                </label>
                <select
                  name="subject"
                  id="subject"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm bg-background text-primary"
                  value={form.subject || ""}
                  onChange={handleChange}
                  aria-label="Inquiry Type"
                >
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="property-viewing">Property Viewing</option>
                  <option value="list-my-property">List My Property</option>
                  <option value="investment-consultation">
                    Investment Consultation
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Message *
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                placeholder="How can we assist you ?"
                required
                aria-required="true"
                value={form.message}
                onChange={handleChange}
                aria-label="Your message"
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                name="consent"
                id="consent"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                required
                aria-required="true"
                aria-label="Consent to Privacy Policy"
              />
              <label
                htmlFor="consent"
                className="ml-2 block text-sm text-muted-foreground"
              >
                I agree to Nova Properties' Privacy Policy and Terms of Service
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-4 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
