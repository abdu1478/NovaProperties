import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentDetailSkeleton } from "@/components/AgentDetailSkeleton";
import { fetchAgentById, type Agent } from "@/utils/api";

export default function AgentsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const from = location.state?.from || "/agents";

  const getBackButtonText = () => {
    switch (from) {
      case "/":
        return "Back to Home";
      case "/agents":
        return "Back to Agents";
      case "/properties":
        return "Back to Properties";
      case "/favorites":
        return "Back to Favorites";
      default:
        return "Back to Agents";
    }
  };

  useEffect(() => {
    const loadAgent = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const agentData = await fetchAgentById(id);
        if (agentData) {
          setAgent(agentData);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [id]);

  if (loading) {
    return <AgentDetailSkeleton />;
  }

  if (notFound || !agent) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            Agent Not Found
          </h1>
          <p className="text-xl text-muted-foreground">
            We couldn't find the agent you're looking for.
          </p>
          <Button onClick={() => navigate(from)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getBackButtonText()}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background py-4 md:py-6 relative">
        <div className="container top-2 left-2 absolute">
          <Button variant="outline" size="sm" onClick={() => navigate(from)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getBackButtonText()}
          </Button>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6"></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground">
            {agent.name}
          </h1>
          <p className="text-xl text-center text-muted-foreground mt-4">
            {agent.title}
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Agent Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <img
                  src={agent.image}
                  alt={`${agent.name} - ${agent.title}`}
                  className="w-full h-80 md:h-96 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      agent.name
                    )}&size=400&background=random`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            </div>

            {/* Agent Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {agent.name}
                  </h2>
                  <p className="text-xl text-muted-foreground">{agent.title}</p>
                  <p className="text-lg text-primary font-medium">
                    {agent.experience} Experience
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-foreground">
                  {/* {agent.bio} */}
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <a href={`mailto:${agent.email}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    Email Agent
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={`tel:${agent.phone}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </a>
                </Button>
              </div>

              {/* Specialties */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {/* {agent.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {specialty}
                    </Badge>
                  ))} */}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{agent.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Listings Section */}
          {/* {agent.listings && agent.listings.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Current Listings
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agent.listings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {listing.address}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-xl font-bold text-primary">
                          {listing.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {listing.type}
                        </span>
                      </div>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </section>
    </main>
  );
}
