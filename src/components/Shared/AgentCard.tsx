import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import type { Agent } from "@/utils/api";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";

interface AgentCardProps {
  agents: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agents }) => {
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.4,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div ref={cardRef} className="h-full">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isVisible ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
        className="h-full"
      >
        <Card className="group shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden text-center bg-background h-full">
          <CardContent className="p-6 h-full flex flex-col">
            {/* Agent Image */}
            <div className="flex flex-col items-center mb-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <img
                  src={agents.image}
                  alt={agents.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md group-hover:shadow-lg transition duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      agents.name
                    )}&size=400&background=random`;
                  }}
                />
              </motion.div>
              <motion.h3
                className="text-xl font-bold text-primary mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {agents.name}
              </motion.h3>
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                {agents.title}
              </motion.p>
              <motion.p
                className="text-muted text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {agents.experience}
              </motion.p>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap justify-center gap-2 my-4">
              {agents.languages.map((lang, index) => (
                <motion.div
                  key={lang}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isVisible ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: 0.45 + index * 0.05,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {lang}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm mb-4 text-muted-foreground">
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ x: -10, opacity: 0 }}
                animate={isVisible ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>{agents.phone}</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ x: -10, opacity: 0 }}
                animate={isVisible ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.55, duration: 0.3 }}
              >
                <Mail className="w-4 h-4 text-primary" />
                <span className="truncate">{agents.email}</span>
              </motion.div>
            </div>

            {/* Spacer to push button to bottom */}
            <div className="flex-grow"></div>

            {/* Contact Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mt-4"
            >
              <Link
                to={`/agents/${agents._id}`}
                state={{ from: location.pathname }}
                className="inline-block w-full"
              >
                <Button className="w-full group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm cursor-pointer">
                  Contact Agent
                  <Mail className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentCard;
