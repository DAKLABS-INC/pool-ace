import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Trophy, Users, Shield, Zap, TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import footballImg from "@/assets/sports/football.jpg";
import basketballImg from "@/assets/sports/basketball.jpg";
import rugbyImg from "@/assets/sports/rugby.jpg";
import tennisImg from "@/assets/sports/tennis.jpg";
import baseballImg from "@/assets/sports/baseball.jpg";
import logo from "@/assets/logo.png";

const Index = () => {
  const sportsImages = [
    { src: footballImg, alt: "Football action shot", sport: "Football" },
    { src: basketballImg, alt: "Basketball game", sport: "Basketball" },
    { src: rugbyImg, alt: "Rugby match", sport: "Rugby" },
    { src: tennisImg, alt: "Tennis player", sport: "Tennis" },
    { src: baseballImg, alt: "Baseball game", sport: "Baseball" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <img
              src={logo}
              alt="DakSports"
              className="h-32 w-32 mx-auto mb-6"
            />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent font-orbitron">
              DakSports
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create and join sports betting pools with friends. Secure, fair,
              and exciting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/pools">Browse Pools</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              <Link to="/create">Create Pool</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Active Pools</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50k+</div>
              <div className="text-sm text-muted-foreground">Total Bets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Carousel Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience Every Sport
            </h2>
            <p className="text-xl text-muted-foreground">
              From football to tennis, all your favorite sports in one place
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {sportsImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="border-0 overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-foreground drop-shadow-lg">
                            {image.sport}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DakSports?
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for the perfect betting pool experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Secure & Fair</CardTitle>
                <CardDescription>
                  Advanced security measures and transparent pool management
                  ensure fair play for everyone.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Quick pool creation, instant joining, and real-time updates
                  keep you in the action.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Social Betting</CardTitle>
                <CardDescription>
                  Create private pools with friends or join public ones. Make
                  every game more exciting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Custom Splits</CardTitle>
                <CardDescription>
                  Configure win/loss ratios from 60/40 to 90/10. You control how
                  winnings are distributed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Multi-Sport</CardTitle>
                <CardDescription>
                  Football, Basketball, Rugby, Tennis and more. All your
                  favorite sports in one place.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Auto Payouts</CardTitle>
                <CardDescription>
                  Automatic pool resolution and payout distribution when matches
                  are finalized.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of sports fans who trust DakSports for their betting
            pools.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/pools">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
