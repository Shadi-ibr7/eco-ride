import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Zap, User, Calendar, Clock, Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Demo data for when no real rides exist
const demoRides = [
  {
    id: "demo-1",
    departure_city: "Paris",
    arrival_city: "Lyon",
    departure_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    arrival_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours after departure
    price: 25,
    seats_available: 3,
    is_electric_car: true,
    profile: { name: "Marie D." },
    driver_rating: 4.8
  },
  {
    id: "demo-2",
    departure_city: "Marseille",
    arrival_city: "Nice",
    departure_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    arrival_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // 2.5 hours after departure
    price: 18,
    seats_available: 2,
    is_electric_car: false,
    profile: { name: "Thomas B." },
    driver_rating: 4.5
  },
  {
    id: "demo-3",
    departure_city: "Bordeaux",
    arrival_city: "Toulouse",
    departure_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    arrival_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // 2.5 hours after departure
    price: 20,
    seats_available: 4,
    is_electric_car: true,
    profile: { name: "Sophie M." },
    driver_rating: 4.9
  }
];

interface SearchResultsProps {
  rides: any[];
  showNoResults: boolean;
  nextAvailableDate?: Date;
  onDateChange?: (date: Date) => void;
}

export const SearchResults = ({ rides, showNoResults, nextAvailableDate, onDateChange }: SearchResultsProps) => {
  const navigate = useNavigate();
  const displayRides = rides.length > 0 ? rides : (!showNoResults ? demoRides : []);

  const handleRideClick = (ride: any) => {
    if (ride.id.toString().startsWith('demo-')) {
      toast.info("Ceci est un trajet de démonstration. Veuillez rechercher des trajets réels.");
      return;
    }
    navigate(`/rides/${ride.id}`);
  };

  if (!showNoResults && displayRides.length === 0) {
    return (
      <div className="min-h-[60vh] bg-grass-50/50 rounded-lg p-8">
        <Card className="mt-8">
          <CardContent className="p-6">
            <p className="text-center text-grass-700">
              Aucun trajet n'est disponible pour le moment. Revenez plus tard ou créez votre propre trajet !
            </p>
            <div className="text-center mt-4">
              <Button 
                onClick={() => navigate('/rides/create')}
                className="bg-grass-600 hover:bg-grass-700 text-white"
              >
                Créer un trajet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showNoResults && displayRides.length === 0 && nextAvailableDate) {
    return (
      <div className="min-h-[60vh] bg-grass-50/50 rounded-lg p-8">
        <Card className="mt-8">
          <CardContent className="p-6">
            <p className="text-center text-grass-700 mb-4">
              Aucun trajet disponible à cette date. Le prochain trajet disponible est le :
            </p>
            <div className="text-center">
              <Button 
                onClick={() => onDateChange?.(nextAvailableDate)}
                className="bg-grass-600 hover:bg-grass-700 text-white"
              >
                Voir les trajets pour le {format(new Date(nextAvailableDate), "d MMMM yyyy", { locale: fr })}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-grass-50/50 rounded-lg p-8 mt-8 space-y-4">
      {displayRides.map((ride) => (
        <Card key={ride.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Driver Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <User className="h-6 w-6" />
                </Avatar>
                <div>
                  <p className="font-medium text-grass-900">{ride.profile?.name || "Anonyme"}</p>
                  <div className="flex items-center space-x-2">
                    {ride.is_electric_car && (
                      <div className="flex items-center text-grass-600 text-sm">
                        <Zap className="h-4 w-4 mr-1" />
                        Véhicule électrique
                      </div>
                    )}
                    {ride.driver_rating && (
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="h-4 w-4 mr-1" />
                        {ride.driver_rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2 text-sm text-grass-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(ride.departure_date), "d MMMM yyyy", { locale: fr })}
                  </span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>
                    {format(new Date(ride.departure_date), "HH:mm")} - {format(new Date(ride.arrival_time), "HH:mm")}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="font-medium text-grass-800">{ride.departure_city}</span>
                  <span className="mx-2 text-grass-600">→</span>
                  <span className="font-medium text-grass-800">{ride.arrival_city}</span>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-grass-900">{ride.price}€</p>
                  <p className="text-sm text-grass-600">{ride.seats_available} place{ride.seats_available > 1 ? 's' : ''} disponible{ride.seats_available > 1 ? 's' : ''}</p>
                </div>
                <Button 
                  className="bg-grass-600 hover:bg-grass-700 text-white"
                  onClick={() => handleRideClick(ride)}
                >
                  Détails
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};