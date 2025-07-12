import { Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-16 bg-background"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <header className="mb-10">
              <h2
                id="contact-heading"
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground">
                Have questions or ready to start your real estate journey? Our
                team is here to help.
              </p>
            </header>

            <div className="space-y-8">
              <div className="flex items-start">
                <div
                  className="rounded-xl p-3 mr-4 flex-shrink-0 bg-accent text-accent-foreground"
                  aria-hidden="true"
                >
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Call Us</h3>
                  <p className="text-muted-foreground mt-1">
                    <a
                      href="tel:8001234567"
                      className="hover:text-primary transition-colors"
                    >
                      (800) 123-4567
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div
                  className="rounded-xl p-3 mr-4 flex-shrink-0 bg-accent text-accent-foreground"
                  aria-hidden="true"
                >
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    Email Us
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    <a
                      href="mailto:info@novaproperties.com"
                      className="hover:text-primary transition-colors"
                    >
                      info@novaproperties.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div
                  className="rounded-xl p-3 mr-4 flex-shrink-0 bg-accent text-accent-foreground"
                  aria-hidden="true"
                >
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    Office Hours
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Monday-Friday: 9am-6pm
                  </p>
                  <p className="text-muted-foreground">Saturday: 10am-4pm</p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-xl overflow-hidden bg-muted border border-border">
              <div
                className="w-full h-64 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                Map Location
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-card rounded-xl shadow-md p-6 sm:p-8 border border-border">
              <header className="mb-8">
                <h3 className="text-2xl font-bold text-foreground">
                  Send a Message
                </h3>
                <p className="text-muted-foreground mt-2">
                  We'll respond within 24 business hours
                </p>
              </header>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Your name"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="How can we help you?"
                    required
                    aria-required="true"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-4 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
