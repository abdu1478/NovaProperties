import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Search } from "lucide-react";
import AgentCard from "@/components/Shared/AgentCard"; // Import the new card component
import { fetchAgents } from "@/utils/api";
import { Link } from "react-router-dom";
import type { AgentHandler } from "Handlers";

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [agents, setAgents] = useState<AgentHandler[]>([]);

  // Filter agents based on search term and role
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" ||
      agent.title
        .toLowerCase()
        .split(/\s+/)
        .includes(selectedRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const roles = ["all", "senior", "specialist", "advisor"];
  useEffect(() => {
    const fetchAgentsData = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
        console.log("Agents data:", data);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgentsData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-muted/20">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Meet Our Agents
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted real estate partners committed to helping you find the
            perfect property. Our experienced team brings expertise, dedication,
            and personalized service to every transaction.
          </p>
        </div>
      </section>
      {/* Search and Filter Section */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search agents by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {roles.map((role) => (
                <Badge
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => setSelectedRole(role)}
                >
                  {role === "all" ? "All Agents" : role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {filteredAgents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No agents found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent, index) => (
                <AgentCard key={index} agents={agent} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Work with Our Team?
          </h2>
          <p className="text-muted-foreground mb-8">
            Our experienced agents are here to guide you through every step of
            your real estate journey. Contact us today to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group cursor-pointer">
              Schedule Consultation
              <Phone className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              className="group cursor-pointer outline-none"
              variant="outline"
              size="lg"
            >
              <Link
                to="/properties/listings"
                className="flex items-center font-semibold"
              >
                <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Browse Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgentsPage;
