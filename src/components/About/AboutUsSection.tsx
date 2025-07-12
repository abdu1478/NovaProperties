import AnimatedCounter from "@/components/AnimatedCounter";
import { Award, MoveRight, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

function AboutUsSection() {
  return (
    <>
      <section id="about" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              About Nova Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              For over 25 years, we've been connecting families with their
              perfect homes. Our dedicated team of professionals brings
              unmatched expertise and personalized service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-background rounded-xl p-8 shadow-lg hover:shadow-lg transition-shadow">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2 text-center">
                <AnimatedCounter to={25} suffix="+" />
              </h3>
              <p className="text-muted-foreground text-center">
                Experience in Real Estate
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2 text-center">
                <AnimatedCounter to={500} suffix="+" />
              </h3>
              <p className="text-muted-foreground text-center">
                Happy Families Served
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2 text-center">
                <AnimatedCounter to={50} prefix="$" suffix="M+" />
              </h3>
              <p className="text-muted-foreground text-center">
                Properties Sold
              </p>
            </div>
          </div>

          <div
            className=" p-8 md:p-12
           shadow-lg bg-card rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Our Vision
                </h3>
                <p className="text-lg mb-6 text-muted-foreground">
                  To revolutionize the real estate industry by setting new
                  standards of excellence in property development, sales, and
                  client service.
                </p>
                <div className="flex justify-start">
                  <Link
                    to="/about-us"
                    className="bg-chart-3 hover:bg-amber-600 text-center text-secondary-foreground rounded-lg px-6 py-3 font-bold flex items-center"
                  >
                    Meet Our Team <MoveRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="bg-accent rounded-lg flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    <AnimatedCounter to={10} suffix="K+" />
                  </span>
                  <span>Happy Clients</span>
                </div>
                <div className="bg-accent rounded-lg flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    <AnimatedCounter to={50} suffix="+" />
                  </span>
                  <span>Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutUsSection;
