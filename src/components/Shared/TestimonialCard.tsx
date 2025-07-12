import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@/utils/api";
import { Star, StarHalf } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(testimonial.rating);
    const hasHalfStar = testimonial.rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-5 h-5 text-chart-3 fill-chart-3" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-5 h-5 text-secondary fill-secondary"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-5 h-5 text-muted-foreground"
          fill="none"
        />
      );
    }

    return stars;
  };

  return (
    <Card className="bg-card shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex mb-4 text-amber-100">{renderStars()}</div>

        <blockquote className="text-foreground mb-6 leading-relaxed flex-grow italic">
          "{testimonial.testimonial}"
        </blockquote>

        <div className="border-t border-border pt-4 flex items-center">
          <Avatar className="mr-4">
            {testimonial?.image ? (
              <AvatarImage src={testimonial?.image} alt={testimonial.name} />
            ) : (
              <AvatarFallback className="bg-muted text-muted-foreground">
                {testimonial.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-semibold text-primary">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.location}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  return (
    <section
      className="py-16 bg-background text-foreground"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 max-w-3xl mx-auto">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stories from real families who found their dream homes with us.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
