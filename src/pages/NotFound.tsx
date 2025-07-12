import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";

function NotFound() {
  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Content */}
      <main className="flex-grow flex items-center py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <div className="relative">
                <div className="text-[10rem] md:text-[14rem] font-black text-primary/10 absolute -top-10 -left-6 z-0">
                  404
                </div>

                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-foreground relative z-10 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Page Not Found
                </motion.h1>

                <motion.p
                  className="text-xl text-muted-foreground mb-8 max-w-lg relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  The property you're looking for might have been sold, removed,
                  or is temporarily unavailable.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <Link
                    to="/"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    Return Home
                  </Link>

                  <Link
                    to="/properties/listings"
                    className="bg-transparent border border-border hover:bg-accent text-foreground px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    Browse Properties
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden border border-border relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-64 h-64">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-background border border-border rounded-lg"
                        animate={{
                          scale: [1, 0.9, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6">
                <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium">
                  Off Market
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default NotFound;
