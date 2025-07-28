import ContactSection from "@/components/Shared/ContactUs";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <>
      <head>
        <title>Contact Nova Properties | Real Estate Experts</title>
        <meta
          name="description"
          content="Reach Nova Properties for premium real estate services. Contact our team via phone, email, or visit our office for personalized assistance."
        />
        <meta
          name="keywords"
          content="real estate contact, property agents, housing consultation, nova properties contact"
        />
        <link rel="canonical" href="https://www.novaproperties.com/contact" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Nova Properties",
            image: "/logo.png",
            "@id": "",
            url: "https://www.novaproperties.com",
            telephone: "+1-800-123-4567",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Main Street",
              addressLocality: "New York",
              addressRegion: "NY",
              postalCode: "10001",
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 40.7128,
              longitude: -74.006,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "10:00",
                closes: "16:00",
              },
            ],
            sameAs: [
              "https://www.facebook.com/novaproperties",
              "https://www.instagram.com/novaproperties",
              "https://www.linkedin.com/company/novaproperties",
            ],
          })}
        </script>
      </head>

      <main className="min-h-screen bg-gradient-to-b from-background to-accent/10">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Contact Our Real Estate Experts
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Whether you're buying, selling, or just exploring options, our
              team is ready to guide you through every step.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section
          className="py-16 bg-background"
          aria-labelledby="contact-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Enhanced Contact Information */}
              <div>
                <header className="mb-10">
                  <h2
                    id="contact-heading"
                    className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                  >
                    Our Contact Details
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Reach out through any channel that's convenient for you.
                    We're available 6 days a week.
                  </p>
                </header>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div
                      className="rounded-xl p-3 mr-4 flex-shrink-0 bg-primary text-primary-foreground"
                      aria-hidden="true"
                    >
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        Call Us
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        <a
                          href="tel:2519023456"
                          className="hover:text-primary transition-colors font-medium"
                        >
                          (251) 902-345678
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Direct line to our customer service team
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div
                      className="rounded-xl p-3 mr-4 flex-shrink-0 bg-primary text-primary-foreground"
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
                          className="hover:text-primary transition-colors font-medium"
                        >
                          info@novaproperties.com
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Average response time: 24 business hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div
                      className="rounded-xl p-3 mr-4 flex-shrink-0 bg-primary text-primary-foreground"
                      aria-hidden="true"
                    >
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        Office Hours
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        Monday-Friday: 8am-5pm
                      </p>
                      <p className="text-muted-foreground">
                        Saturday: 10am-4pm
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Sunday: Closed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div
                      className="rounded-xl p-3 mr-4 flex-shrink-0 bg-primary text-primary-foreground"
                      aria-hidden="true"
                    >
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        Visit Us
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        Bole medhanialem tezera building, <br /> 2nd floor
                        office number 203
                      </p>
                      <p className="text-muted-foreground">
                        Bole, Addis Ababa, Ethiopia
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Free on-site parking available behind the building.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  id="map-container"
                  className="mt-12 rounded-xl overflow-hidden bg-muted border border-border shadow-lg"
                >
                  <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mb-4" />
                    <p>Interactive Map Location</p>
                    <p className="text-sm mt-2">
                      123 Main Street, New York, NY
                    </p>
                    <Button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Contact Form */}
              <div>
                <ContactSection />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  How soon can I get a property viewing?
                </h3>
                <p className="text-muted-foreground">
                  We typically schedule viewings within 24-48 hours of request,
                  depending on property availability.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  Do you offer virtual tours?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We provide high-quality virtual tours for all our listed
                  properties upon request.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  What areas do you serve?
                </h3>
                <p className="text-muted-foreground">
                  We cover all major metropolitan areas in New York, New Jersey,
                  and Connecticut.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  How are your agents compensated?
                </h3>
                <p className="text-muted-foreground">
                  Our agents work on commission only when your property
                  transaction successfully closes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;
