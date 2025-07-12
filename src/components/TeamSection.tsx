import { Card, CardContent } from "@/components/ui/card";
import ceoPortrait from "@/assets/ceo-portrait.jpg";

export function TeamSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Led by industry experts with decades of combined experience in real
            estate
          </p>
        </div>

        <Card className="max-w-4xl mx-auto overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src={ceoPortrait}
                  alt="Abdu Seid, CEO of Nova Properties"
                  className="w-full h-full object-cover min-h-[400px] md:min-h-[500px]"
                />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center bg-card">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Abdu Seid
                    </h3>
                    <p className="text-primary font-semibold text-lg">
                      Chief Executive Officer
                    </p>
                  </div>

                  <div className="space-y-4 text-foreground leading-relaxed">
                    <p>
                      With over 15 years of experience in the real estate
                      industry, Sarah has built Nova Properties into one of the
                      most trusted names in luxury property development and
                      sales.
                    </p>

                    <p>
                      Her vision for creating exceptional living spaces and
                      commitment to client satisfaction has earned numerous
                      industry awards and recognition.
                    </p>

                    <p>
                      Sarah holds an MBA in Business Administration and is a
                      licensed real estate broker with expertise in residential
                      and commercial properties.
                    </p>
                  </div>

                  <div className="pt-4">
                    <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4">
                      "Our mission is to turn your property dreams into reality
                      with unmatched service and expertise."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
